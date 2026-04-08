const SHEETS = 64;
const ROWS = 246;
const COLS = 246;
const VISIBLE_ROWS = 28;
const VISIBLE_COLS = 52;
const STORAGE_KEY = "sm7-goose-cube-v0.1.0";
const VIEWER_MAX_POINTS = 2200;
const CRAFT_SIZES = [3, 5, 7];
const SM7 = " .,:;!?\'\"-/+=*#@%&_()abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SM7_SET = new Set(SM7);
const DENSITY = ["@", "#", "%", "&", "*", "+", "=", "-", ".", ",", " "];
const FILLED_SM7 = [...SM7].filter((char) => char !== " ").join("");
const TOTAL_VOXELS = SHEETS * ROWS * COLS;

const GOOSE_VARIANTS = [
  ["   __    ", "  (oo)   ", " /(  )   ", "  mm mm  "],
  ["   __    ", "  (oo)   ", " /(  )_  ", "  mm     "],
  ["   __    ", "  (oo)   ", " /(  )   ", "  m  mm  "],
  ["   __    ", "  (oo)   ", " /(  )   ", "  mm m   "],
];

const GOOSE_ADJECTIVES = ["Warm", "Velvet", "Brass", "Moss", "Quiet", "Tidal", "Cinder", "Lattice"];
const GOOSE_NOUNS = ["Goose", "Clerk", "Archivist", "Guide", "Witness", "Seeder", "Companion", "Honk"];

const DENSITY_PALETTE = {
  "@": "#c95c33",
  "#": "#d4812f",
  "%": "#a07d32",
  "&": "#4d8a52",
  "*": "#3b80ad",
  "+": "#79aeca",
  "=": "#9c85cf",
  "-": "#aab2b8",
  ".": "#d6d8d9",
  ",": "#f0e4be",
};

const ui = {
  appShell: document.querySelector("#appShell"),
  toggleSimBtn: document.querySelector("#toggleSimBtn"),
  toggleSpinBtn: document.querySelector("#toggleSpinBtn"),
  honkBtn: document.querySelector("#honkBtn"),
  reseedBtn: document.querySelector("#reseedBtn"),
  exportCsvBtn: document.querySelector("#exportCsvBtn"),
  importCsvBtn: document.querySelector("#importCsvBtn"),
  seedReadout: document.querySelector("#seedReadout"),
  depthReadout: document.querySelector("#depthReadout"),
  memoryReadout: document.querySelector("#memoryReadout"),
  formulaReadout: document.querySelector("#formulaReadout"),
  viewerMetaReadout: document.querySelector("#viewerMetaReadout"),
  cellCoord: document.querySelector("#cellCoord"),
  formulaInput: document.querySelector("#formulaInput"),
  sheetButtons: document.querySelector("#sheetButtons"),
  jumpForm: document.querySelector("#jumpForm"),
  jumpInput: document.querySelector("#jumpInput"),
  sheetGrid: document.querySelector("#sheetGrid"),
  rowScroll: document.querySelector("#rowScroll"),
  colScroll: document.querySelector("#colScroll"),
  scrollReadout: document.querySelector("#scrollReadout"),
  viewerCanvas: document.querySelector("#viewerCanvas"),
  depthRange: document.querySelector("#depthRange"),
  densityRange: document.querySelector("#densityRange"),
  yawRange: document.querySelector("#yawRange"),
  resetViewBtn: document.querySelector("#resetViewBtn"),
  focusSelectionBtn: document.querySelector("#focusSelectionBtn"),
  viewModeReadout: document.querySelector("#viewModeReadout"),
  voxelReadout: document.querySelector("#voxelReadout"),
  viewerHint: document.querySelector("#viewerHint"),
  craftSizeReadout: document.querySelector("#craftSizeReadout"),
  craftOutputReadout: document.querySelector("#craftOutputReadout"),
  craftInputGrid: document.querySelector("#craftInputGrid"),
  craftOutputGrid: document.querySelector("#craftOutputGrid"),
  craftSizeRange: document.querySelector("#craftSizeRange"),
  craftDepthRange: document.querySelector("#craftDepthRange"),
  craftRotateBtn: document.querySelector("#craftRotateBtn"),
  craftMirrorBtn: document.querySelector("#craftMirrorBtn"),
  craftBakeBtn: document.querySelector("#craftBakeBtn"),
  craftStackBtn: document.querySelector("#craftStackBtn"),
  craftSummary: document.querySelector("#craftSummary"),
  gooseName: document.querySelector("#gooseName"),
  gooseMoodBadge: document.querySelector("#gooseMoodBadge"),
  gooseAscii: document.querySelector("#gooseAscii"),
  gooseSpeech: document.querySelector("#gooseSpeech"),
  gooseSeed: document.querySelector("#gooseSeed"),
  gooseSheet: document.querySelector("#gooseSheet"),
  gooseCell: document.querySelector("#gooseCell"),
  gooseViewer: document.querySelector("#gooseViewer"),
  statusLine: document.querySelector("#statusLine"),
  csvFileInput: document.querySelector("#csvFileInput"),
};

const runtime = {
  simTimer: null,
  saveTimer: 0,
  rafId: 0,
  lastFrame: 0,
  disposed: false,
  needsViewerDraw: true,
  projectedPoints: [],
  viewerDrag: {
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    moved: false,
    hitPoint: null,
  },
};

const state = loadState() ?? createDefaultState();

bindEvents();
resizeViewerCanvas();
renderAll("wake");
syncSimulation();
runtime.rafId = window.requestAnimationFrame(viewerLoop);
window.requestAnimationFrame(() => {
  resizeViewerCanvas();
  ui.appShell.focus();
});

function bindEvents() {
  ui.toggleSimBtn.addEventListener("click", () => {
    state.isingSim = !state.isingSim;
    syncSimulation();
    renderAll(state.isingSim ? "ising-start" : "ising-stop");
    scheduleSave();
  });

  ui.toggleSpinBtn.addEventListener("click", () => {
    state.viewer.autoSpin = !state.viewer.autoSpin;
    runtime.needsViewerDraw = true;
    renderMetaStrip();
    renderViewerPanel();
    scheduleSave();
    announceStatus(state.viewer.autoSpin ? "Viewer auto spin on." : "Viewer auto spin off.");
  });

  ui.honkBtn.addEventListener("click", () => {
    stampGooseAtSelection();
    state.honkCount += 1;
    renderAll("honk");
    scheduleSave();
    announceStatus("Stamped a goose into the current sheet.");
  });

  ui.reseedBtn.addEventListener("click", () => {
    reseedWorld();
    announceStatus("Built a fresh seeded cube.");
  });

  ui.exportCsvBtn.addEventListener("click", exportCurrentSheetAsCsv);
  ui.importCsvBtn.addEventListener("click", () => ui.csvFileInput.click());

  ui.csvFileInput.addEventListener("change", async (event) => {
    const [file] = event.target.files ?? [];
    event.target.value = "";
    if (!file) {
      return;
    }
    const text = await file.text();
    importCsvIntoCurrentSheet(text);
    renderAll("import");
    scheduleSave();
    announceStatus(`Imported CSV into sheet ${state.cur + 1}.`);
  });

  ui.formulaInput.addEventListener("focus", () => {
    if (!state.editMode) {
      startEdit(getRawCell(state.cur, state.selR, state.selC));
    }
  });

  ui.formulaInput.addEventListener("input", (event) => {
    state.formula = event.target.value;
  });

  ui.formulaInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitFormula();
      ui.appShell.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelEdit();
      ui.appShell.focus();
    }
    event.stopPropagation();
  });

  ui.formulaInput.addEventListener("blur", () => {
    if (state.editMode) {
      commitFormula();
    }
  });

  ui.sheetButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-sheet]");
    if (!button) {
      return;
    }
    state.cur = Number.parseInt(button.dataset.sheet, 10);
    ensureSelectionVisible();
    renderAll("sheet");
    scheduleSave();
    ui.appShell.focus();
  });

  ui.jumpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const target = Number.parseInt(ui.jumpInput.value, 10);
    if (Number.isNaN(target) || target < 1 || target > SHEETS) {
      return;
    }
    state.cur = target - 1;
    ui.jumpInput.value = "";
    renderAll("sheet");
    scheduleSave();
    announceStatus(`Jumped to sheet ${state.cur + 1}.`);
    ui.appShell.focus();
  });

  ui.sheetGrid.addEventListener("click", (event) => {
    const cell = event.target.closest("td[data-r][data-c]");
    if (!cell) {
      return;
    }
    state.selR = Number.parseInt(cell.dataset.r, 10);
    state.selC = Number.parseInt(cell.dataset.c, 10);
    ensureSelectionVisible();
    renderAll("cell");
    ui.appShell.focus();
  });

  ui.craftInputGrid.addEventListener("click", (event) => {
    const cell = event.target.closest("td[data-r][data-c]");
    if (!cell) {
      return;
    }
    state.selR = Number.parseInt(cell.dataset.r, 10);
    state.selC = Number.parseInt(cell.dataset.c, 10);
    ensureSelectionVisible();
    renderAll("craft");
    ui.appShell.focus();
  });

  ui.craftOutputGrid.addEventListener("click", (event) => {
    const cell = event.target.closest("td[data-r][data-c][data-sheet]");
    if (!cell) {
      return;
    }
    state.cur = Number.parseInt(cell.dataset.sheet, 10);
    state.selR = Number.parseInt(cell.dataset.r, 10);
    state.selC = Number.parseInt(cell.dataset.c, 10);
    ensureSelectionVisible();
    renderAll("craft-target");
    scheduleSave();
    ui.appShell.focus();
  });

  ui.rowScroll.addEventListener("input", (event) => {
    state.scrollR = Number.parseInt(event.target.value, 10);
    renderGrid();
    renderControlStrip();
    runtime.needsViewerDraw = true;
    scheduleSave();
  });

  ui.colScroll.addEventListener("input", (event) => {
    state.scrollC = Number.parseInt(event.target.value, 10);
    renderGrid();
    renderControlStrip();
    runtime.needsViewerDraw = true;
    scheduleSave();
  });

  ui.depthRange.addEventListener("input", (event) => {
    state.viewer.depthRadius = Number.parseInt(event.target.value, 10);
    runtime.needsViewerDraw = true;
    renderMetaStrip();
    renderViewerPanel();
    scheduleSave();
  });

  ui.densityRange.addEventListener("input", (event) => {
    state.viewer.densityFloor = Number.parseInt(event.target.value, 10);
    runtime.needsViewerDraw = true;
    renderMetaStrip();
    renderViewerPanel();
    scheduleSave();
  });

  ui.yawRange.addEventListener("input", (event) => {
    state.viewer.yaw = Number.parseInt(event.target.value, 10);
    runtime.needsViewerDraw = true;
    renderViewerPanel();
  });

  ui.resetViewBtn.addEventListener("click", () => {
    resetViewerView();
    announceStatus("Viewer reset to the default hatch angle.");
  });

  ui.craftSizeRange.addEventListener("input", (event) => {
    state.craft.sizeIndex = clamp(Number.parseInt(event.target.value, 10), 0, CRAFT_SIZES.length - 1);
    renderAll("craft");
    scheduleSave();
  });

  ui.craftDepthRange.addEventListener("input", (event) => {
    state.craft.stackDepth = clamp(Number.parseInt(event.target.value, 10), 1, 8);
    renderCraftBench();
    scheduleSave();
  });

  ui.craftRotateBtn.addEventListener("click", () => {
    state.craft.rotation = (state.craft.rotation + 1) % 4;
    renderAll("craft");
    scheduleSave();
    announceStatus(`Craft output rotated to ${state.craft.rotation * 90} degrees.`);
  });

  ui.craftMirrorBtn.addEventListener("click", () => {
    state.craft.mirrored = !state.craft.mirrored;
    renderAll("craft");
    scheduleSave();
    announceStatus(state.craft.mirrored ? "Craft output mirror on." : "Craft output mirror off.");
  });

  ui.craftBakeBtn.addEventListener("click", () => {
    const targetSheet = getCraftTargetSheet();
    const depth = applyCraftPattern(targetSheet, 1);
    renderAll("craft-bake");
    scheduleSave();
    announceStatus(
      depth > 0
        ? `Baked the active recipe into sheet ${targetSheet + 1}.`
        : "No deeper sheet was available for the craft output."
    );
  });

  ui.craftStackBtn.addEventListener("click", () => {
    const targetSheet = getCraftTargetSheet();
    const depth = applyCraftPattern(targetSheet, state.craft.stackDepth);
    renderAll("craft-stack");
    scheduleSave();
    announceStatus(
      depth > 0
        ? `Baked the active recipe across ${depth} sheet${depth === 1 ? "" : "s"}, starting at sheet ${targetSheet + 1}.`
        : "No deeper sheets were available for a slab bake."
    );
  });

  ui.focusSelectionBtn.addEventListener("click", () => {
    state.viewer.focusMode = state.viewer.focusMode === "world" ? "selection" : "world";
    runtime.needsViewerDraw = true;
    renderMetaStrip();
    renderViewerPanel();
    scheduleSave();
    announceStatus(
      state.viewer.focusMode === "selection" ? "Viewer now centers on the active selection." : "Viewer now centers on the world."
    );
  });

  ui.viewerCanvas.addEventListener("pointerdown", handleViewerPointerDown);
  ui.viewerCanvas.addEventListener("pointermove", handleViewerPointerMove);
  ui.viewerCanvas.addEventListener("pointerup", handleViewerPointerUp);
  ui.viewerCanvas.addEventListener("pointercancel", handleViewerPointerUp);
  ui.viewerCanvas.addEventListener("wheel", handleViewerWheel, { passive: false });
  ui.viewerCanvas.addEventListener("dblclick", () => {
    resetViewerView();
    announceStatus("Viewer reset to the default hatch angle.");
  });

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("resize", handleWindowResize);
  window.addEventListener("beforeunload", cleanup);
}

function handleWindowResize() {
  resizeViewerCanvas();
}

function resizeViewerCanvas() {
  const rect = ui.viewerCanvas.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return;
  }
  const pixelRatio = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(rect.width * pixelRatio));
  const height = Math.max(1, Math.round(rect.height * pixelRatio));
  if (ui.viewerCanvas.width !== width || ui.viewerCanvas.height !== height) {
    ui.viewerCanvas.width = width;
    ui.viewerCanvas.height = height;
    runtime.needsViewerDraw = true;
  }
}

function resetViewerView() {
  state.viewer.yaw = 26;
  state.viewer.pitch = 14;
  state.viewer.zoom = 1;
  state.viewer.autoSpin = false;
  runtime.needsViewerDraw = true;
  renderMetaStrip();
  renderViewerPanel();
  scheduleSave();
}

function viewerEventToCanvasPoint(event) {
  const rect = ui.viewerCanvas.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return null;
  }
  return {
    x: ((event.clientX - rect.left) / rect.width) * ui.viewerCanvas.width,
    y: ((event.clientY - rect.top) / rect.height) * ui.viewerCanvas.height,
  };
}

function findViewerPointAtPosition(x, y) {
  let best = null;
  runtime.projectedPoints.forEach((point) => {
    const dx = x - point.px;
    const dy = y - point.py;
    const distanceSquared = dx * dx + dy * dy;
    const radius = Math.max(12, point.size + 8);
    if (distanceSquared > radius * radius) {
      return;
    }
    if (!best || distanceSquared < best.distanceSquared) {
      best = { point, distanceSquared };
    }
  });
  return best?.point ?? null;
}

function updateViewerCursor(event) {
  const point = viewerEventToCanvasPoint(event);
  if (!point || runtime.viewerDrag.active) {
    return;
  }
  const hit = findViewerPointAtPosition(point.x, point.y);
  ui.viewerCanvas.style.cursor = hit ? "pointer" : "grab";
}

function handleViewerPointerDown(event) {
  if (event.button !== 0) {
    return;
  }
  const point = viewerEventToCanvasPoint(event);
  runtime.viewerDrag.active = true;
  runtime.viewerDrag.pointerId = event.pointerId;
  runtime.viewerDrag.startX = event.clientX;
  runtime.viewerDrag.startY = event.clientY;
  runtime.viewerDrag.lastX = event.clientX;
  runtime.viewerDrag.lastY = event.clientY;
  runtime.viewerDrag.moved = false;
  runtime.viewerDrag.hitPoint = point ? findViewerPointAtPosition(point.x, point.y) : null;
  ui.viewerCanvas.classList.add("dragging");
  ui.viewerCanvas.setPointerCapture(event.pointerId);
  event.preventDefault();
}

function handleViewerPointerMove(event) {
  updateViewerCursor(event);
  if (!runtime.viewerDrag.active || runtime.viewerDrag.pointerId !== event.pointerId) {
    return;
  }

  const totalDx = event.clientX - runtime.viewerDrag.startX;
  const totalDy = event.clientY - runtime.viewerDrag.startY;
  const stepDx = event.clientX - runtime.viewerDrag.lastX;
  const stepDy = event.clientY - runtime.viewerDrag.lastY;

  if (!runtime.viewerDrag.moved && Math.abs(totalDx) + Math.abs(totalDy) > 3) {
    runtime.viewerDrag.moved = true;
    if (state.viewer.autoSpin) {
      state.viewer.autoSpin = false;
      renderMetaStrip();
    }
  }

  if (runtime.viewerDrag.moved) {
    state.viewer.yaw = (state.viewer.yaw + stepDx * 0.42 + 3600) % 360;
    state.viewer.pitch = clamp(state.viewer.pitch + stepDy * 0.18, -52, 52);
    runtime.needsViewerDraw = true;
    renderViewerPanel();
  }

  runtime.viewerDrag.lastX = event.clientX;
  runtime.viewerDrag.lastY = event.clientY;
  event.preventDefault();
}

function handleViewerPointerUp(event) {
  if (!runtime.viewerDrag.active || runtime.viewerDrag.pointerId !== event.pointerId) {
    return;
  }

  const point = viewerEventToCanvasPoint(event);
  if (!runtime.viewerDrag.moved && point) {
    const hit = findViewerPointAtPosition(point.x, point.y) ?? runtime.viewerDrag.hitPoint;
    if (hit) {
      state.cur = hit.sheetIndex;
      state.selR = hit.row;
      state.selC = hit.col;
      ensureSelectionVisible();
      renderAll("viewer-pick");
      scheduleSave();
      announceStatus(`Viewer selected ${colLabel(hit.col)}${hit.row + 1} on sheet ${hit.sheetIndex + 1}.`);
    }
  } else if (runtime.viewerDrag.moved) {
    scheduleSave();
  }

  if (ui.viewerCanvas.hasPointerCapture(event.pointerId)) {
    ui.viewerCanvas.releasePointerCapture(event.pointerId);
  }
  runtime.viewerDrag.active = false;
  runtime.viewerDrag.pointerId = null;
  runtime.viewerDrag.hitPoint = null;
  runtime.viewerDrag.moved = false;
  ui.viewerCanvas.classList.remove("dragging");
  ui.viewerCanvas.style.cursor = "grab";
}

function handleViewerWheel(event) {
  event.preventDefault();
  if (event.shiftKey) {
    state.viewer.densityFloor = clamp(state.viewer.densityFloor + Math.sign(event.deltaY), 0, 10);
  } else if (event.altKey) {
    state.viewer.depthRadius = clamp(state.viewer.depthRadius + Math.sign(event.deltaY), 1, 16);
  } else {
    state.viewer.zoom = clamp(state.viewer.zoom - Math.sign(event.deltaY) * 0.08, 0.65, 2.4);
  }
  if (state.viewer.autoSpin) {
    state.viewer.autoSpin = false;
    renderMetaStrip();
  }
  runtime.needsViewerDraw = true;
  renderViewerPanel();
  scheduleSave();
}

function cleanup() {
  if (runtime.disposed) {
    return;
  }
  runtime.disposed = true;
  window.clearInterval(runtime.simTimer);
  window.clearTimeout(runtime.saveTimer);
  window.cancelAnimationFrame(runtime.rafId);
  ui.viewerCanvas.removeEventListener("pointerdown", handleViewerPointerDown);
  ui.viewerCanvas.removeEventListener("pointermove", handleViewerPointerMove);
  ui.viewerCanvas.removeEventListener("pointerup", handleViewerPointerUp);
  ui.viewerCanvas.removeEventListener("pointercancel", handleViewerPointerUp);
  ui.viewerCanvas.removeEventListener("wheel", handleViewerWheel);
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("resize", handleWindowResize);
  window.removeEventListener("beforeunload", cleanup);
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.sheets) || parsed.sheets.length !== SHEETS) {
      return null;
    }
    return {
      sheets: parsed.sheets.map((sheet) => new Map(Object.entries(sheet ?? {}))),
      cur: clamp(parsed.cur, 0, SHEETS - 1),
      selR: clamp(parsed.selR, 0, ROWS - 1),
      selC: clamp(parsed.selC, 0, COLS - 1),
      scrollR: clamp(parsed.scrollR, 0, ROWS - VISIBLE_ROWS),
      scrollC: clamp(parsed.scrollC, 0, COLS - VISIBLE_COLS),
      formula: "",
      editMode: false,
      isingSim: Boolean(parsed.isingSim),
      honkCount: parsed.honkCount || 0,
      viewer: {
        depthRadius: clamp(parsed.viewer?.depthRadius ?? 6, 1, 16),
        densityFloor: clamp(parsed.viewer?.densityFloor ?? 6, 0, 10),
        yaw: clamp(parsed.viewer?.yaw ?? 26, 0, 360),
        pitch: clamp(parsed.viewer?.pitch ?? 14, -52, 52),
        zoom: clamp(parsed.viewer?.zoom ?? 1, 0.65, 2.4),
        autoSpin: parsed.viewer?.autoSpin ?? true,
        focusMode: parsed.viewer?.focusMode === "selection" ? "selection" : "world",
        lastPointCount: 0,
      },
      craft: {
        sizeIndex: clamp(parsed.craft?.sizeIndex ?? 1, 0, CRAFT_SIZES.length - 1),
        rotation: clamp(parsed.craft?.rotation ?? 0, 0, 3),
        mirrored: Boolean(parsed.craft?.mirrored),
        stackDepth: clamp(parsed.craft?.stackDepth ?? 3, 1, 8),
      },
    };
  } catch (error) {
    console.warn("Could not load cube state:", error);
    return null;
  }
}

function createDefaultState() {
  const sheets = Array.from({ length: SHEETS }, () => new Map());
  stampGoose(sheets[0], 6, 10, 0);
  stampSeedPatch(sheets[0], 12, 3, 18, 41);
  stampSeedPatch(sheets[1], 0, 0, 24, 57);
  stampSeedPatch(sheets[2], 20, 38, 18, 77);
  stampSeedPatch(sheets[7], 56, 60, 20, 99);
  setMapCell(sheets[3], 5, 5, "=S1.K7");
  setMapCell(sheets[3], 6, 5, "=S1.L7");
  setMapCell(sheets[4], 12, 12, "@");

  return {
    sheets,
    cur: 0,
    selR: 6,
    selC: 10,
    scrollR: 0,
    scrollC: 0,
    formula: "",
    editMode: false,
    isingSim: false,
    honkCount: 0,
    viewer: {
      depthRadius: 6,
      densityFloor: 6,
      yaw: 26,
      pitch: 14,
      zoom: 1,
      autoSpin: true,
      focusMode: "world",
      lastPointCount: 0,
    },
    craft: {
      sizeIndex: 1,
      rotation: 0,
      mirrored: false,
      stackDepth: 3,
    },
  };
}

function reseedWorld() {
  const viewer = { ...state.viewer };
  const craft = { ...state.craft };
  const fresh = createDefaultState();
  state.sheets = fresh.sheets;
  state.cur = fresh.cur;
  state.selR = fresh.selR;
  state.selC = fresh.selC;
  state.scrollR = fresh.scrollR;
  state.scrollC = fresh.scrollC;
  state.formula = "";
  state.editMode = false;
  state.isingSim = false;
  state.honkCount += 1;
  state.viewer = viewer;
  state.craft = craft;
  syncSimulation();
  renderAll("reseed");
  scheduleSave();
}

function scheduleSave() {
  window.clearTimeout(runtime.saveTimer);
  runtime.saveTimer = window.setTimeout(() => {
    try {
      const snapshot = {
        sheets: state.sheets.map((sheet) => Object.fromEntries(sheet.entries())),
        cur: state.cur,
        selR: state.selR,
        selC: state.selC,
        scrollR: state.scrollR,
        scrollC: state.scrollC,
        isingSim: state.isingSim,
        honkCount: state.honkCount,
        viewer: {
          depthRadius: state.viewer.depthRadius,
          densityFloor: state.viewer.densityFloor,
          yaw: state.viewer.yaw,
          pitch: state.viewer.pitch,
          zoom: state.viewer.zoom,
          autoSpin: state.viewer.autoSpin,
          focusMode: state.viewer.focusMode,
        },
        craft: {
          sizeIndex: state.craft.sizeIndex,
          rotation: state.craft.rotation,
          mirrored: state.craft.mirrored,
          stackDepth: state.craft.stackDepth,
        },
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (error) {
      console.warn("Could not save cube state:", error);
    }
  }, 120);
}

function clamp(value, min, max) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

function createCellKey(row, col) {
  return `${row},${col}`;
}

function parseCellKey(key) {
  const [row, col] = key.split(",").map(Number);
  return [row, col];
}

function isInBounds(sheetIndex, row, col) {
  return sheetIndex >= 0 && sheetIndex < SHEETS && row >= 0 && row < ROWS && col >= 0 && col < COLS;
}

function normalizeCellValue(value) {
  if (typeof value !== "string") {
    return " ";
  }
  const clean = value.replace(/\r/g, "");
  if (clean.startsWith("=")) {
    return clean.trim() || " ";
  }
  for (const char of clean) {
    if (SM7_SET.has(char)) {
      return char;
    }
  }
  return " ";
}

function seededGlyph(sheetIndex, row, col, seed = 42) {
  let value = Math.sin(sheetIndex * 0.137 + seed) * 173.4;
  value += Math.cos(row * 0.093) * 87.2;
  value += Math.sin(col * 0.071) * 51.7;
  value += Math.sin((sheetIndex * 19 + row * 31 + col * 73) * 0.007);
  value += Math.cos((sheetIndex + row + col + seed) * 0.021) * 29.5;
  value -= Math.floor(value);
  const index = Math.floor(value * FILLED_SM7.length);
  return FILLED_SM7[Math.min(index, FILLED_SM7.length - 1)];
}

function getStoredCell(sheetIndex, row, col, sheets = state.sheets) {
  if (!isInBounds(sheetIndex, row, col)) {
    return null;
  }
  return sheets[sheetIndex].get(createCellKey(row, col)) ?? null;
}

function setMapCell(sheet, row, col, value) {
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
    return;
  }
  const normalized = normalizeCellValue(value);
  const key = createCellKey(row, col);
  if (normalized === " ") {
    sheet.delete(key);
  } else {
    sheet.set(key, normalized);
  }
}

function getRawCell(sheetIndex, row, col, sheets = state.sheets) {
  if (!isInBounds(sheetIndex, row, col)) {
    return " ";
  }
  return getStoredCell(sheetIndex, row, col, sheets) ?? seededGlyph(sheetIndex, row, col);
}

function setRawCell(sheetIndex, row, col, value, sheets = state.sheets) {
  if (!isInBounds(sheetIndex, row, col)) {
    return;
  }
  setMapCell(sheets[sheetIndex], row, col, value);
}

function parseRef(expr, sheetIndex) {
  const full = expr.match(/^=S(\d+)\.([A-Z]+)(\d+)$/i);
  if (full) {
    return {
      s: Number.parseInt(full[1], 10) - 1,
      c: lettersToColumn(full[2]),
      r: Number.parseInt(full[3], 10) - 1,
    };
  }
  const local = expr.match(/^=([A-Z]+)(\d+)$/i);
  if (local) {
    return {
      s: sheetIndex,
      c: lettersToColumn(local[1]),
      r: Number.parseInt(local[2], 10) - 1,
    };
  }
  return null;
}

function lettersToColumn(letters) {
  return letters
    .toUpperCase()
    .split("")
    .reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0) - 1;
}

function colLabel(col) {
  let out = "";
  let value = col + 1;
  while (value > 0) {
    const mod = (value - 1) % 26;
    out = String.fromCharCode(65 + mod) + out;
    value = Math.floor((value - 1) / 26);
  }
  return out;
}

function resolveCell(sheetIndex, row, col, visited = new Set(), sheets = state.sheets) {
  const id = `${sheetIndex},${row},${col}`;
  if (visited.has(id)) {
    return "!";
  }
  visited.add(id);
  if (!isInBounds(sheetIndex, row, col)) {
    return "?";
  }
  const value = getStoredCell(sheetIndex, row, col, sheets);
  if (value === null) {
    return seededGlyph(sheetIndex, row, col);
  }
  if (value.startsWith("=")) {
    const ref = parseRef(value, sheetIndex);
    return ref ? resolveCell(ref.s, ref.r, ref.c, visited, sheets) : "?";
  }
  return value;
}

function displayChar(sheetIndex, row, col, sheets = state.sheets) {
  const stored = getStoredCell(sheetIndex, row, col, sheets);
  if (stored === null) {
    return seededGlyph(sheetIndex, row, col);
  }
  return stored.startsWith("=") ? resolveCell(sheetIndex, row, col, new Set(), sheets) : stored;
}

function charToDensityChar(char) {
  if (DENSITY.includes(char)) {
    return char;
  }
  const index = FILLED_SM7.indexOf(char);
  if (index < 0) {
    return DENSITY[DENSITY.length - 1];
  }
  return DENSITY[index % DENSITY.length];
}

function getDensityChar(sheetIndex, row, col, sheets = state.sheets) {
  if (!isInBounds(sheetIndex, row, col)) {
    return " ";
  }
  return charToDensityChar(displayChar(sheetIndex, row, col, sheets));
}

function densityStrength(char) {
  const densityChar = charToDensityChar(char);
  const index = DENSITY.indexOf(densityChar);
  return index >= 0 ? DENSITY.length - index : DENSITY.length + 1;
}

function seededDensity(sheetIndex, row, col, seed = 42) {
  let value = Math.sin(sheetIndex * 0.137 + seed) * 173.4;
  value += Math.cos(row * 0.093) * 87.2;
  value += Math.sin(col * 0.071) * 51.7;
  value += Math.sin((sheetIndex * 19 + row * 31 + col * 73) * 0.007);
  value -= Math.floor(value);
  const index = Math.floor(value * DENSITY.length);
  return DENSITY[Math.min(index, DENSITY.length - 1)];
}

function stampSeedPatch(sheet, startRow, startCol, size, seed) {
  for (let row = startRow; row < Math.min(ROWS, startRow + size); row += 1) {
    for (let col = startCol; col < Math.min(COLS, startCol + size); col += 1) {
      const char = seededDensity(seed % SHEETS, row, col, seed);
      if (char !== " ") {
        setMapCell(sheet, row, col, char);
      }
    }
  }
}

function stampGoose(sheet, startRow, startCol, variantIndex) {
  const lines = GOOSE_VARIANTS[variantIndex % GOOSE_VARIANTS.length];
  lines.forEach((line, rowOffset) => {
    [...line].forEach((char, colOffset) => {
      if (SM7_SET.has(char)) {
        setMapCell(sheet, startRow + rowOffset, startCol + colOffset, char);
      }
    });
  });
}

function stampGooseAtSelection() {
  const row = clamp(state.selR - 1, 0, ROWS - 4);
  const col = clamp(state.selC - 4, 0, COLS - 10);
  stampGoose(state.sheets[state.cur], row, col, state.honkCount);
}

function getCraftSize() {
  return CRAFT_SIZES[state.craft.sizeIndex] ?? CRAFT_SIZES[1];
}

function getCraftBounds() {
  const size = getCraftSize();
  const half = Math.floor(size / 2);
  const startRow = clamp(state.selR - half, 0, ROWS - size);
  const startCol = clamp(state.selC - half, 0, COLS - size);
  return {
    size,
    startRow,
    startCol,
    endRow: startRow + size - 1,
    endCol: startCol + size - 1,
  };
}

function getCraftTargetSheet() {
  return Math.min(state.cur + 1, SHEETS - 1);
}

function getCraftAvailableDepth(targetSheet = getCraftTargetSheet()) {
  return Math.min(state.craft.stackDepth, SHEETS - targetSheet);
}

function buildCraftInputPattern() {
  const bounds = getCraftBounds();
  return Array.from({ length: bounds.size }, (_, rowOffset) =>
    Array.from({ length: bounds.size }, (_, colOffset) => {
      const row = bounds.startRow + rowOffset;
      const col = bounds.startCol + colOffset;
      const stored = getStoredCell(state.cur, row, col);
      return {
        row,
        col,
        char: displayChar(state.cur, row, col),
        raw: stored ?? seededGlyph(state.cur, row, col),
        stored,
        selected: row === state.selR && col === state.selC,
      };
    })
  );
}

function rotatePattern(pattern) {
  const size = pattern.length;
  return Array.from({ length: size }, (_, rowIndex) =>
    Array.from({ length: size }, (_, colIndex) => pattern[size - 1 - colIndex][rowIndex])
  );
}

function mirrorPattern(pattern) {
  return pattern.map((row) => [...row].reverse());
}

function buildCraftOutputPattern() {
  let pattern = buildCraftInputPattern();
  if (state.craft.mirrored) {
    pattern = mirrorPattern(pattern);
  }
  for (let turn = 0; turn < state.craft.rotation; turn += 1) {
    pattern = rotatePattern(pattern);
  }
  return pattern;
}

function applyCraftPattern(targetSheet, requestedDepth) {
  if (targetSheet < 0 || targetSheet >= SHEETS) {
    return 0;
  }
  const bounds = getCraftBounds();
  const output = buildCraftOutputPattern();
  const depth = Math.min(Math.max(1, requestedDepth), SHEETS - targetSheet);

  for (let layer = 0; layer < depth; layer += 1) {
    const sheetIndex = targetSheet + layer;
    output.forEach((rowCells, rowOffset) => {
      rowCells.forEach((cell, colOffset) => {
        setRawCell(sheetIndex, bounds.startRow + rowOffset, bounds.startCol + colOffset, cell.char);
      });
    });
  }

  return depth;
}

function buildCraftSummary(output) {
  const bounds = getCraftBounds();
  const targetSheet = getCraftTargetSheet();
  const depth = getCraftAvailableDepth(targetSheet);
  const counts = new Map();

  output.flat().forEach((cell) => {
    counts.set(cell.char, (counts.get(cell.char) ?? 0) + 1);
  });

  const [dominantChar, dominantCount] =
    [...counts.entries()].sort((left, right) => right[1] - left[1])[0] ?? [" ", 0];
  const rotation = state.craft.rotation * 90;
  const mirrorText = state.craft.mirrored ? "mirrored, " : "";
  const outputEnd = targetSheet + depth - 1;

  return `Input ${colLabel(bounds.startCol)}${bounds.startRow + 1}-${colLabel(bounds.endCol)}${bounds.endRow + 1} on sheet ${
    state.cur + 1
  }. Output bakes to sheet ${targetSheet + 1}${depth > 1 ? ` through ${outputEnd + 1}` : ""} with ${mirrorText}${rotation} degree rotation. Dominant glyph "${
    dominantChar === " " ? "blank" : dominantChar
  }" x${dominantCount}.`;
}

function buildIsingFrontier(sheet) {
  const frontier = new Set();
  const offsets = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  sheet.forEach((value, key) => {
    if (!DENSITY.includes(value)) {
      return;
    }
    const [row, col] = parseCellKey(key);
    offsets.forEach(([dr, dc]) => {
      const nextRow = row + dr;
      const nextCol = col + dc;
      if (nextRow >= 0 && nextRow < ROWS && nextCol >= 0 && nextCol < COLS) {
        frontier.add(createCellKey(nextRow, nextCol));
      }
    });
  });

  if (!frontier.size) {
    offsets.forEach(([dr, dc]) => {
      const nextRow = state.selR + dr;
      const nextCol = state.selC + dc;
      if (nextRow >= 0 && nextRow < ROWS && nextCol >= 0 && nextCol < COLS) {
        frontier.add(createCellKey(nextRow, nextCol));
      }
    });
  }

  return frontier;
}

function isingStep(sheetIndex) {
  const sheet = state.sheets[sheetIndex];
  const frontier = buildIsingFrontier(sheet);
  const next = new Map(sheet);

  frontier.forEach((key) => {
    const [row, col] = parseCellKey(key);
    const currentChar = getDensityChar(sheetIndex, row, col, state.sheets);
    const currentIndex = DENSITY.indexOf(currentChar);
    const baseIndex = currentIndex >= 0 ? currentIndex : DENSITY.length - 1;
    const neighbors = [
      getDensityChar(sheetIndex, row - 1, col, state.sheets),
      getDensityChar(sheetIndex, row + 1, col, state.sheets),
      getDensityChar(sheetIndex, row, col - 1, state.sheets),
      getDensityChar(sheetIndex, row, col + 1, state.sheets),
    ];
    const neighborSum = neighbors.reduce((sum, neighbor) => {
      const neighborIndex = DENSITY.indexOf(neighbor);
      return sum + (neighborIndex >= 0 ? 5 - neighborIndex : -4);
    }, 0);

    let nextIndex = baseIndex;
    const spin = baseIndex < 5 ? 1 : -1;
    const delta = spin * neighborSum;

    if (delta < 0 || Math.random() < Math.exp(-Math.abs(delta) * 0.08)) {
      nextIndex = clamp(baseIndex + (Math.random() < 0.55 ? 1 : -1), 0, DENSITY.length - 1);
    } else if (Math.random() < 0.08) {
      nextIndex = clamp(baseIndex + (neighborSum > 0 ? -1 : 1), 0, DENSITY.length - 1);
    }

    setMapCell(next, row, col, DENSITY[nextIndex]);
  });

  return next;
}

function ensureSelectionVisible() {
  if (state.selR < state.scrollR) {
    state.scrollR = state.selR;
  } else if (state.selR >= state.scrollR + VISIBLE_ROWS) {
    state.scrollR = state.selR - VISIBLE_ROWS + 1;
  }
  if (state.selC < state.scrollC) {
    state.scrollC = state.selC;
  } else if (state.selC >= state.scrollC + VISIBLE_COLS) {
    state.scrollC = state.selC - VISIBLE_COLS + 1;
  }
}

function handleKeyDown(event) {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }

  const active = document.activeElement;
  if (active === ui.jumpInput) {
    return;
  }

  const moves = {
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
    ArrowLeft: [0, -1],
    ArrowRight: [0, 1],
  };

  if (!state.editMode && moves[event.key]) {
    event.preventDefault();
    state.selR = clamp(state.selR + moves[event.key][0], 0, ROWS - 1);
    state.selC = clamp(state.selC + moves[event.key][1], 0, COLS - 1);
    ensureSelectionVisible();
    renderAll("cell");
    scheduleSave();
    return;
  }

  if (!state.editMode && event.key === "PageUp") {
    event.preventDefault();
    state.cur = clamp(state.cur - 1, 0, SHEETS - 1);
    renderAll("sheet");
    scheduleSave();
    return;
  }

  if (!state.editMode && event.key === "PageDown") {
    event.preventDefault();
    state.cur = clamp(state.cur + 1, 0, SHEETS - 1);
    renderAll("sheet");
    scheduleSave();
    return;
  }

  if (!state.editMode && (event.key === "Delete" || event.key === "Backspace")) {
    event.preventDefault();
    setRawCell(state.cur, state.selR, state.selC, " ");
    renderAll("erase");
    scheduleSave();
    return;
  }

  if (!state.editMode && (event.key === "Enter" || event.key === "F2")) {
    event.preventDefault();
    startEdit(getRawCell(state.cur, state.selR, state.selC));
    return;
  }

  if (!state.editMode && event.key === "=") {
    event.preventDefault();
    startEdit("=");
    return;
  }

  if (!state.editMode && event.key.length === 1 && SM7_SET.has(event.key)) {
    event.preventDefault();
    setRawCell(state.cur, state.selR, state.selC, event.key);
    renderAll("type");
    scheduleSave();
  }
}

function startEdit(initialValue) {
  state.editMode = true;
  state.formula = initialValue ?? "";
  renderFormulaBar();
  window.requestAnimationFrame(() => {
    ui.formulaInput.focus();
    ui.formulaInput.select();
  });
}

function cancelEdit() {
  state.editMode = false;
  state.formula = "";
  renderFormulaBar();
}

function commitFormula() {
  setRawCell(state.cur, state.selR, state.selC, state.formula);
  state.editMode = false;
  state.formula = "";
  renderAll("commit");
  scheduleSave();
}

function exportCurrentSheetAsCsv() {
  const lines = [];
  for (let row = 0; row < ROWS; row += 1) {
    const values = [];
    for (let col = 0; col < COLS; col += 1) {
      const raw = getRawCell(state.cur, row, col);
      const safe = raw === " " ? "" : /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
      values.push(escapeCsv(safe));
    }
    lines.push(values.join(","));
  }
  const blob = new Blob([lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `sm7-goose-cube-sheet-${state.cur + 1}.csv`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  state.honkCount += 1;
  renderAll("export");
  scheduleSave();
  announceStatus(`Exported sheet ${state.cur + 1} as CSV.`);
}

function importCsvIntoCurrentSheet(csvText) {
  const rows = parseCsv(csvText);
  const replacement = new Map();
  rows.slice(0, ROWS).forEach((row, rowIndex) => {
    row.slice(0, COLS).forEach((value, colIndex) => {
      let nextValue = value ?? "";
      if (nextValue.length > 1 && nextValue.startsWith("'") && /^[=+\-@]/.test(nextValue[1])) {
        nextValue = nextValue.slice(1);
      }
      const normalized = normalizeCellValue(nextValue);
      if (normalized !== " ") {
        replacement.set(createCellKey(rowIndex, colIndex), normalized);
      }
    });
  });
  state.sheets[state.cur] = replacement;
}

function parseCsv(csvText) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];
    if (inQuotes) {
      if (char === "\"") {
        if (csvText[index + 1] === "\"") {
          field += "\"";
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === "\"") {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  row.push(field);
  rows.push(row);

  if (rows.length && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === "") {
    rows.pop();
  }

  return rows;
}

function escapeCsv(value) {
  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }
  return text;
}

function syncSimulation() {
  window.clearInterval(runtime.simTimer);
  if (!state.isingSim) {
    runtime.simTimer = null;
    return;
  }
  runtime.simTimer = window.setInterval(() => {
    state.sheets[state.cur] = isingStep(state.cur);
    renderAll("ising");
    scheduleSave();
  }, 180);
}

function getMemoryMetrics() {
  let touchedSheets = 0;
  let filledCells = 0;
  let formulaCells = 0;
  let densityCells = 0;

  state.sheets.forEach((sheet) => {
    if (sheet.size > 0) {
      touchedSheets += 1;
    }
    sheet.forEach((value) => {
      filledCells += 1;
      if (value.startsWith("=")) {
        formulaCells += 1;
      }
      if (DENSITY.includes(value)) {
        densityCells += 1;
      }
    });
  });

  return { touchedSheets, filledCells, formulaCells, densityCells };
}

function computeSeed(metrics) {
  const chunks = [];
  state.sheets.forEach((sheet, sheetIndex) => {
    const ordered = Array.from(sheet.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    ordered.forEach(([key, value]) => {
      chunks.push(`${sheetIndex}:${key}:${value}`);
    });
  });
  const hash = hashText(chunks.join("|") || "empty");
  return `${hash}-${metrics.touchedSheets.toString(16).padStart(2, "0")}${metrics.filledCells
    .toString(36)
    .padStart(3, "0")}`;
}

function hashText(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function deriveGoosePersona(seed, metrics) {
  const numeric = Number.parseInt(seed.slice(0, 8), 16);
  const adjective = GOOSE_ADJECTIVES[numeric % GOOSE_ADJECTIVES.length];
  const noun = GOOSE_NOUNS[(numeric >>> 4) % GOOSE_NOUNS.length];
  const mood =
    metrics.touchedSheets >= 16
      ? "deep"
      : state.isingSim
        ? "shivering"
        : metrics.formulaCells > 0
          ? "scheming"
          : metrics.filledCells < 24
            ? "drowsy"
            : "watchful";
  return {
    name: `${adjective} ${noun}`,
    mood,
    art: GOOSE_VARIANTS[numeric % GOOSE_VARIANTS.length].join("\n"),
  };
}

function buildGooseSpeech(reason, metrics, seed, viewerCount) {
  const raw = getRawCell(state.cur, state.selR, state.selC);
  const display = displayChar(state.cur, state.selR, state.selC);
  const messages = [];

  if (reason === "reseed") {
    messages.push(`Fresh seed ${seed}. The cube forgot just enough to stay useful.`);
  }
  if (reason === "honk") {
    messages.push("honk. I stamped this sheet so the viewer would have something louder to chew on.");
  }
  if (reason === "export") {
    messages.push(`Sheet ${state.cur + 1} is packed for travel. Sparse memory ships better.`);
  }
  if (reason === "import") {
    messages.push("Imported marks always change the weather of a cube.");
  }
  if (reason === "craft-bake") {
    messages.push("That recipe just moved one sheet deeper. Good bench work leaves a clean trail.");
  }
  if (reason === "craft-stack") {
    messages.push("A slab bake is just a recipe with enough conviction to become depth.");
  }
  if (reason === "craft-target") {
    messages.push("You are looking straight at the output sheet now. Inventory became object.");
  }
  if (reason === "viewer-pick") {
    messages.push("The hatch just pointed back into the cube. Good. A viewer should be able to answer with coordinates.");
  }
  if (raw.startsWith("=")) {
    messages.push("That cell is borrowing from another sheet. The hatch only works when memory crosses layers.");
  }
  if (metrics.touchedSheets >= 8) {
    messages.push("Eight or more sheets are awake. That is enough depth for a real goose opinion.");
  }
  if (metrics.formulaCells > 0) {
    messages.push("Formula cells are little tunnels. Keep them sparse and they stay legible.");
  }
  if (viewerCount === 0) {
    messages.push("The viewer floor is too strict right now. Lower it or stamp a denser patch.");
  }
  if (viewerCount > 800) {
    messages.push("A crowded hatch means the cube is warming up. Dense layers read better when the focus is tight.");
  }
  if (state.viewer.focusMode === "selection") {
    messages.push("I am staring directly at the selected cell. World center can wait.");
  }
  if (state.isingSim) {
    messages.push("The sparse frontier is drifting. Better this than boiling every empty cell in the cube.");
  }
  if (metrics.filledCells < 24) {
    messages.push("I am still mostly egg and whisper. A few more marks will hatch a stronger shape.");
  }
  messages.push(`Active cell ${colLabel(state.selC)}${state.selR + 1} is showing "${display === " " ? "blank" : display}".`);

  const pick = Number.parseInt(seed.slice(0, 4), 16) + state.honkCount + viewerCount;
  return messages[pick % messages.length];
}

function renderAll(reason = "idle") {
  ensureSelectionVisible();
  renderMetaStrip();
  renderFormulaBar();
  renderSheetButtons();
  renderGrid();
  renderControlStrip();
  renderCraftBench();
  renderViewerPanel();
  renderGoose(reason);
  runtime.needsViewerDraw = true;
}

function renderMetaStrip() {
  const metrics = getMemoryMetrics();
  ui.seedReadout.textContent = `seed: ${computeSeed(metrics)}`;
  ui.depthReadout.textContent = `sheet: ${state.cur + 1} / ${SHEETS}`;
  ui.memoryReadout.textContent = `cube: ${TOTAL_VOXELS.toLocaleString()} voxels`;
  ui.formulaReadout.textContent = `overrides: ${metrics.filledCells} / formulas: ${metrics.formulaCells}`;
  ui.viewerMetaReadout.textContent = `viewer: ${state.viewer.lastPointCount || 0} voxels`;
  ui.toggleSimBtn.textContent = state.isingSim ? "Pause ising" : "Start ising";
  ui.toggleSimBtn.classList.toggle("active", state.isingSim);
  ui.toggleSpinBtn.textContent = state.viewer.autoSpin ? "Auto spin on" : "Auto spin off";
  ui.toggleSpinBtn.classList.toggle("active", state.viewer.autoSpin);
}

function renderFormulaBar() {
  ui.cellCoord.textContent = `${colLabel(state.selC)}${state.selR + 1}`;
  const current = state.editMode ? state.formula : getRawCell(state.cur, state.selR, state.selC);
  if (document.activeElement !== ui.formulaInput || ui.formulaInput.value !== current) {
    ui.formulaInput.value = current;
  }
}

function renderSheetButtons() {
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < SHEETS; index += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.sheet = String(index);
    button.textContent = String(index + 1);
    if (index === state.cur) {
      button.classList.add("current");
    }
    fragment.append(button);
  }
  ui.sheetButtons.replaceChildren(fragment);
}

function renderGrid() {
  const visibleRows = Array.from({ length: VISIBLE_ROWS }, (_, index) => state.scrollR + index);
  const visibleCols = Array.from({ length: VISIBLE_COLS }, (_, index) => state.scrollC + index);

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  const corner = document.createElement("th");
  corner.className = "row-head";
  headRow.append(corner);
  visibleCols.forEach((col) => {
    const th = document.createElement("th");
    th.textContent = colLabel(col);
    headRow.append(th);
  });
  thead.append(headRow);

  const tbody = document.createElement("tbody");
  visibleRows.forEach((row) => {
    const tr = document.createElement("tr");
    const rowHead = document.createElement("th");
    rowHead.className = "row-head";
    rowHead.textContent = String(row + 1);
    tr.append(rowHead);

    visibleCols.forEach((col) => {
      const td = document.createElement("td");
      const stored = getStoredCell(state.cur, row, col);
      const char = displayChar(state.cur, row, col);
      td.dataset.r = String(row);
      td.dataset.c = String(col);
      td.textContent = char === " " ? "" : char;
      if (row === state.selR && col === state.selC) {
        td.classList.add("selected");
      }
      if (stored === null) {
        td.classList.add("seeded");
      }
      if (stored?.startsWith("=")) {
        td.classList.add("formula");
      }
      if (char === " ") {
        td.classList.add("empty");
      }
      tr.append(td);
    });

    tbody.append(tr);
  });

  ui.sheetGrid.replaceChildren(thead, tbody);
}

function renderControlStrip() {
  ui.rowScroll.value = String(state.scrollR);
  ui.colScroll.value = String(state.scrollC);
  ui.scrollReadout.textContent = `r${state.scrollR} c${state.scrollC}`;
}

function renderCraftBench() {
  const bounds = getCraftBounds();
  const input = buildCraftInputPattern();
  const output = buildCraftOutputPattern();
  const targetSheet = getCraftTargetSheet();
  const availableDepth = getCraftAvailableDepth(targetSheet);

  ui.craftSizeRange.value = String(state.craft.sizeIndex);
  ui.craftDepthRange.value = String(state.craft.stackDepth);
  ui.craftSizeReadout.textContent = `bench: ${bounds.size} x ${bounds.size}`;
  ui.craftOutputReadout.textContent =
    availableDepth > 1 ? `output: sheets ${targetSheet + 1}-${targetSheet + availableDepth}` : `output: sheet ${targetSheet + 1}`;
  ui.craftMirrorBtn.textContent = state.craft.mirrored ? "Mirror on" : "Mirror off";
  ui.craftMirrorBtn.classList.toggle("active", state.craft.mirrored);
  ui.craftSummary.textContent = buildCraftSummary(output);

  renderCraftGrid(ui.craftInputGrid, input, "input");
  renderCraftGrid(ui.craftOutputGrid, output, "output", bounds, targetSheet);
}

function renderCraftGrid(element, pattern, mode, bounds = getCraftBounds(), targetSheet = getCraftTargetSheet()) {
  const tbody = document.createElement("tbody");

  pattern.forEach((rowCells, rowOffset) => {
    const tr = document.createElement("tr");
    rowCells.forEach((cell, colOffset) => {
      const td = document.createElement("td");
      td.textContent = cell.char === " " ? "" : cell.char;
      if (mode === "input") {
        td.dataset.r = String(cell.row);
        td.dataset.c = String(cell.col);
        if (cell.stored === null) {
          td.classList.add("seeded");
        }
        if (cell.stored?.startsWith("=")) {
          td.classList.add("formula");
        }
      } else {
        td.dataset.r = String(bounds.startRow + rowOffset);
        td.dataset.c = String(bounds.startCol + colOffset);
        td.dataset.sheet = String(targetSheet);
      }
      if (cell.selected) {
        td.classList.add("selected");
      }
      tr.append(td);
    });
    tbody.append(tr);
  });

  element.replaceChildren(tbody);
}

function renderViewerPanel() {
  ui.depthRange.value = String(state.viewer.depthRadius);
  ui.densityRange.value = String(state.viewer.densityFloor);
  ui.yawRange.value = String(Math.round(state.viewer.yaw));
  ui.viewModeReadout.textContent = `focus: ${state.viewer.focusMode} / zoom ${state.viewer.zoom.toFixed(2)}x`;
  ui.voxelReadout.textContent = `${state.viewer.lastPointCount || 0} voxels / pitch ${Math.round(state.viewer.pitch)} deg`;
  ui.focusSelectionBtn.textContent =
    state.viewer.focusMode === "world" ? "Center on selection" : "Center on world";
  ui.viewerHint.textContent =
    "Drag to orbit. Wheel zooms. Shift-wheel changes density. Alt-wheel changes depth. Click a voxel to select it.";
}

function renderGoose(reason) {
  const metrics = getMemoryMetrics();
  const seed = computeSeed(metrics);
  const persona = deriveGoosePersona(seed, metrics);
  const viewerCount = state.viewer.lastPointCount || 0;

  ui.gooseName.textContent = persona.name;
  ui.gooseMoodBadge.textContent = persona.mood;
  ui.gooseAscii.textContent = persona.art;
  ui.gooseSpeech.textContent = buildGooseSpeech(reason, metrics, seed, viewerCount);
  ui.gooseSeed.textContent = seed;
  ui.gooseSheet.textContent = String(state.cur + 1);
  ui.gooseCell.textContent = `${colLabel(state.selC)}${state.selR + 1}`;
  ui.gooseViewer.textContent = String(viewerCount);
}

function announceStatus(message) {
  ui.statusLine.textContent = message;
}

function viewerLoop(timestamp) {
  if (runtime.disposed) {
    return;
  }

  const deltaSeconds = runtime.lastFrame ? (timestamp - runtime.lastFrame) / 1000 : 0;
  runtime.lastFrame = timestamp;

  if (state.viewer.autoSpin) {
    state.viewer.yaw = (state.viewer.yaw + deltaSeconds * 18) % 360;
    runtime.needsViewerDraw = true;
  }

  if (runtime.needsViewerDraw) {
    drawViewer();
    runtime.needsViewerDraw = false;
  }

  runtime.rafId = window.requestAnimationFrame(viewerLoop);
}

function collectViewerPoints() {
  const points = [];
  const startSheet = Math.max(0, state.cur - state.viewer.depthRadius);
  const endSheet = Math.min(SHEETS - 1, state.cur + state.viewer.depthRadius);
  const originRow = state.viewer.focusMode === "selection" ? state.selR : Math.floor(ROWS / 2);
  const originCol = state.viewer.focusMode === "selection" ? state.selC : Math.floor(COLS / 2);
  const planeRadius = state.viewer.focusMode === "selection" ? 24 : 42;
  const rowStart = Math.max(0, originRow - planeRadius);
  const rowEnd = Math.min(ROWS - 1, originRow + planeRadius);
  const colStart = Math.max(0, originCol - planeRadius);
  const colEnd = Math.min(COLS - 1, originCol + planeRadius);
  const sheetCount = endSheet - startSheet + 1;
  const rowCount = rowEnd - rowStart + 1;
  const colCount = colEnd - colStart + 1;
  const stride = Math.max(1, Math.ceil(Math.sqrt((sheetCount * rowCount * colCount) / VIEWER_MAX_POINTS)));
  let selectedIncluded = false;

  for (let sheetIndex = startSheet; sheetIndex <= endSheet; sheetIndex += 1) {
    for (let row = rowStart; row <= rowEnd; row += stride) {
      for (let col = colStart; col <= colEnd; col += stride) {
        const stored = getStoredCell(sheetIndex, row, col);
        const char = displayChar(sheetIndex, row, col);
        const strength = densityStrength(char);
        const selected = sheetIndex === state.cur && row === state.selR && col === state.selC;
        if (!selected && strength < state.viewer.densityFloor) {
          continue;
        }
        if (selected) {
          selectedIncluded = true;
        }
        points.push({
          sheetIndex,
          row,
          col,
          raw: stored ?? char,
          char,
          strength,
          selected,
          originRow,
          originCol,
        });
      }
    }
  }

  if (!selectedIncluded) {
    const stored = getStoredCell(state.cur, state.selR, state.selC);
    const char = displayChar(state.cur, state.selR, state.selC);
    points.push({
      sheetIndex: state.cur,
      row: state.selR,
      col: state.selC,
      raw: stored ?? char,
      char,
      strength: densityStrength(char),
      selected: true,
      originRow,
      originCol,
    });
  }

  if (points.length <= VIEWER_MAX_POINTS) {
    return points;
  }

  const step = Math.ceil(points.length / VIEWER_MAX_POINTS);
  return points.filter((point, index) => point.selected || index % step === 0);
}

function drawViewer() {
  resizeViewerCanvas();
  const ctx = ui.viewerCanvas.getContext("2d");
  const width = ui.viewerCanvas.width;
  const height = ui.viewerCanvas.height;
  const centerX = width / 2;
  const centerY = height / 2 + height * 0.05;

  ctx.clearRect(0, 0, width, height);

  const background = ctx.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, "#11161b");
  background.addColorStop(1, "#090d11");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  drawViewerGrid(ctx, centerX, centerY, state.viewer.zoom, width);

  const points = collectViewerPoints();
  const yaw = (state.viewer.yaw * Math.PI) / 180;
  const pitch = (state.viewer.pitch * Math.PI) / 180;
  const yawCos = Math.cos(yaw);
  const yawSin = Math.sin(yaw);
  const pitchCos = Math.cos(pitch);
  const pitchSin = Math.sin(pitch);
  const zoom = state.viewer.zoom;
  const xScale = 6.4 * zoom;
  const yScale = 6.1 * zoom;

  const projected = points
    .map((point) => {
      const worldX = (point.col - point.originCol) / 3.2;
      const worldY = (point.originRow - point.row) / 3.2;
      const worldZ = (point.sheetIndex - state.cur) * 5.4;
      const xRot = worldX * yawCos - worldZ * yawSin;
      const zRot = worldX * yawSin + worldZ * yawCos;
      const yTilt = worldY * pitchCos - zRot * pitchSin;
      const depth = worldY * pitchSin + zRot * pitchCos;
      const px = centerX + xRot * xScale;
      const py = centerY - yTilt * yScale + depth * 1.2;
      const size = clamp((1.4 + point.strength * 0.28 - Math.abs(depth) * 0.012) * zoom, 1.2, point.selected ? 10 : 7.2);
      return { ...point, px, py, depth, size };
    })
    .sort((left, right) => left.depth - right.depth || left.py - right.py);

  runtime.projectedPoints = projected;

  projected.forEach((point) => {
    const color = getViewerColor(point.char, point.raw);
    ctx.save();
    ctx.translate(point.px, point.py);
    ctx.fillStyle = color.fill;
    ctx.shadowBlur = point.selected ? 16 : 8;
    ctx.shadowColor = point.selected ? "#ffe8a6" : color.fill;
    ctx.fillRect(-point.size / 2, -point.size / 2, point.size, point.size);
    if (point.selected) {
      ctx.strokeStyle = "#fff4cf";
      ctx.lineWidth = 1.25;
      ctx.strokeRect(-point.size / 2 - 1.5, -point.size / 2 - 1.5, point.size + 3, point.size + 3);
    }
    ctx.restore();
  });

  ctx.fillStyle = "#d3c18e";
  ctx.font = '12px "IBM Plex Mono", monospace';
  ctx.fillText(`sheet ${state.cur + 1}`, 16, 24);
  ctx.fillText(`yaw ${Math.round(state.viewer.yaw)} deg`, 16, 40);
  ctx.fillText(`pitch ${Math.round(state.viewer.pitch)} deg`, 16, 56);
  ctx.fillText(`zoom ${state.viewer.zoom.toFixed(2)}x`, 16, 72);
  ctx.fillText(`depth +/-${state.viewer.depthRadius}`, 16, 88);
  ctx.fillText(`density floor ${state.viewer.densityFloor}`, 16, 104);

  if (!projected.length) {
    ctx.fillStyle = "#f1e0a7";
    ctx.font = '16px "Avenir Next", sans-serif';
    ctx.fillText("No voxels above the current floor.", width * 0.2, height / 2 - 6);
    ctx.fillStyle = "#b7c0c4";
    ctx.font = '12px "IBM Plex Mono", monospace';
    ctx.fillText("Lower the density floor or stamp a denser patch.", width * 0.16, height / 2 + 18);
  }

  state.viewer.lastPointCount = projected.length;
  ui.viewerMetaReadout.textContent = `viewer: ${projected.length} voxels`;
  ui.viewModeReadout.textContent = `focus: ${state.viewer.focusMode} / zoom ${state.viewer.zoom.toFixed(2)}x`;
  ui.voxelReadout.textContent = `${projected.length} voxels / pitch ${Math.round(state.viewer.pitch)} deg`;
  ui.gooseViewer.textContent = String(projected.length);
  ui.yawRange.value = String(Math.round(state.viewer.yaw));
}

function drawViewerGrid(ctx, centerX, centerY, zoom, width) {
  ctx.save();
  ctx.strokeStyle = "rgba(242, 206, 140, 0.14)";
  ctx.lineWidth = 1;
  const gridHalf = Math.min(width * 0.38, 170 * zoom);
  const rowStep = 18 * zoom;
  for (let index = -5; index <= 5; index += 1) {
    ctx.beginPath();
    ctx.moveTo(centerX - gridHalf, centerY + index * rowStep);
    ctx.lineTo(centerX + gridHalf, centerY + index * rowStep);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(centerX - gridHalf - 20 * zoom, centerY);
  ctx.lineTo(centerX + gridHalf + 20 * zoom, centerY);
  ctx.strokeStyle = "rgba(242, 206, 140, 0.24)";
  ctx.stroke();
  ctx.restore();
}

function getViewerColor(char, raw) {
  if (raw.startsWith("=")) {
    return { fill: "#66a5ff" };
  }
  if (DENSITY_PALETTE[char]) {
    return { fill: DENSITY_PALETTE[char] };
  }
  const glyphIndex = FILLED_SM7.indexOf(char);
  const hue = glyphIndex >= 0 ? Math.floor((glyphIndex / FILLED_SM7.length) * 360) : 0;
  const light = /[A-Z0-9]/.test(char) ? 68 : /[a-z]/.test(char) ? 58 : 76;
  return { fill: `hsl(${hue} 72% ${light}%)` };
}
