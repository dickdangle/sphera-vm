from __future__ import annotations

import struct
from pathlib import Path


NINTENDO_LOGO = bytes([
    0x24, 0xFF, 0xAE, 0x51, 0x69, 0x9A, 0xA2, 0x21, 0x3D, 0x84, 0x82, 0x0A,
    0x84, 0xE4, 0x09, 0xAD, 0x11, 0x24, 0x8B, 0x98, 0xC0, 0x81, 0x7F, 0x21,
    0xA3, 0x52, 0xBE, 0x19, 0x93, 0x09, 0xCE, 0x20, 0x10, 0x46, 0x4A, 0x4A,
    0xF8, 0x27, 0x31, 0xEC, 0x58, 0xC7, 0xE8, 0x33, 0x82, 0xE3, 0xCE, 0xBF,
    0x85, 0xF4, 0xDF, 0x94, 0xCE, 0x4B, 0x09, 0xC1, 0x94, 0x56, 0x8A, 0xC0,
    0x13, 0x72, 0xA7, 0xFC, 0x9F, 0x84, 0x4D, 0x73, 0xA3, 0xCA, 0x9A, 0x61,
    0x58, 0x97, 0xA3, 0x27, 0xFC, 0x03, 0x98, 0x76, 0x23, 0x1D, 0xC7, 0x61,
    0x03, 0x04, 0xAE, 0x56, 0xBF, 0x38, 0x84, 0x00, 0x40, 0xA7, 0x0E, 0xFD,
    0xFF, 0x52, 0xFE, 0x03, 0x6F, 0x95, 0x30, 0xF1, 0x97, 0xFB, 0xC0, 0x85,
    0x60, 0xD6, 0x80, 0x25, 0xA9, 0x63, 0xBE, 0x03, 0x01, 0x4E, 0x38, 0xE2,
    0xF9, 0xA2, 0x34, 0xFF, 0xBB, 0x3E, 0x03, 0x44, 0x78, 0x00, 0x90, 0xCB,
    0x88, 0x11, 0x3A, 0x94, 0x65, 0xC0, 0x7C, 0x63, 0x87, 0xF0, 0x3C, 0xAF,
    0xD6, 0x25, 0xE4, 0x8B, 0x38, 0x0A, 0xAC, 0x72, 0x21, 0xD4, 0xF8, 0x07,
])

COND = {
    "EQ": 0x0,
    "NE": 0x1,
    "CS": 0x2,
    "HS": 0x2,
    "CC": 0x3,
    "LO": 0x3,
    "MI": 0x4,
    "PL": 0x5,
    "VS": 0x6,
    "VC": 0x7,
    "HI": 0x8,
    "LS": 0x9,
    "GE": 0xA,
    "LT": 0xB,
    "GT": 0xC,
    "LE": 0xD,
    "AL": 0xE,
}

SHIFT = {
    "LSL": 0x0,
    "LSR": 0x1,
    "ASR": 0x2,
    "ROR": 0x3,
}

OPCODE = {
    "AND": 0x0,
    "EOR": 0x1,
    "SUB": 0x2,
    "RSB": 0x3,
    "ADD": 0x4,
    "ADC": 0x5,
    "SBC": 0x6,
    "RSC": 0x7,
    "TST": 0x8,
    "TEQ": 0x9,
    "CMP": 0xA,
    "CMN": 0xB,
    "ORR": 0xC,
    "MOV": 0xD,
    "BIC": 0xE,
    "MVN": 0xF,
}

REG_DISPCNT = 0x04000000
REG_SOUND1CNT_L = 0x04000060
REG_SOUND1CNT_H = 0x04000062
REG_SOUND1CNT_X = 0x04000064
REG_SOUND2CNT_L = 0x04000068
REG_SOUND2CNT_H = 0x0400006C
REG_SOUND3CNT_L = 0x04000070
REG_SOUND3CNT_H = 0x04000072
REG_SOUND3CNT_X = 0x04000074
REG_SOUNDCNT_L = 0x04000080
REG_SOUNDCNT_H = 0x04000082
REG_SOUNDCNT_X = 0x04000084
REG_WAVE_RAM0 = 0x04000090
REG_WAVE_RAM1 = 0x04000094
REG_WAVE_RAM2 = 0x04000098
REG_WAVE_RAM3 = 0x0400009C
REG_VCOUNT = 0x04000006
REG_KEYINPUT = 0x04000130
VRAM = 0x06000000

DISPCNT_MODE3_BG2 = 0x00000403
SCREEN_WIDTH = 240
SCREEN_HEIGHT = 160
PIXEL_COUNT = SCREEN_WIDTH * SCREEN_HEIGHT
ROW_STRIDE_BYTES = SCREEN_WIDTH * 2
SQUARE_SIZE = 12
MOVE_STEP = 4
DOT1_INIT_X = 162
DOT2_INIT_X = 58
DOT1_INIT_Y = 70
DOT2_INIT_Y = 70
MAX_X = SCREEN_WIDTH - SQUARE_SIZE
MAX_Y = SCREEN_HEIGHT - SQUARE_SIZE
VIS_FRAME_RESET = 128
VIS_PHASE_1 = 32
VIS_PHASE_2 = 64
VIS_PHASE_3 = 96
SPHERE_HALO_1_SIZE = 34
SPHERE_HALO_2_SIZE = 24
SPHERE_CORE_SIZE = 14
SPHERE_HALO_1_X = (SCREEN_WIDTH // 2) - (SPHERE_HALO_1_SIZE // 2)
SPHERE_HALO_1_Y = (SCREEN_HEIGHT // 2) - (SPHERE_HALO_1_SIZE // 2)
SPHERE_HALO_2_X = (SCREEN_WIDTH // 2) - (SPHERE_HALO_2_SIZE // 2)
SPHERE_HALO_2_Y = (SCREEN_HEIGHT // 2) - (SPHERE_HALO_2_SIZE // 2)
SPHERE_CORE_X = (SCREEN_WIDTH // 2) - (SPHERE_CORE_SIZE // 2)
SPHERE_CORE_Y = (SCREEN_HEIGHT // 2) - (SPHERE_CORE_SIZE // 2)
DOT1_COLOR = 0x01E0
DOT2_COLOR = 0x7C7F
BG_COLOR = 0x2943
SPHERE_HALO_1_COLOR = 0x252B
SPHERE_HALO_2_COLOR = 0x4E73
SPHERE_CORE_COLOR = 0x7F7C
VIS_BG_COLOR = 0x1083
VIS_OUTER_COLOR = 0x4A53
VIS_MID_COLOR = 0x3678
VIS_INNER_COLOR = 0x5A80
VIS_GOOSE_BODY_COLOR = 0x7A60
VIS_GOOSE_HEAD_COLOR = 0x7F2B
VIS_GOOSE_BEAK_COLOR = 0x16BF
VIS_GOOSE_FOOT_COLOR = 0x1E97
VIS_FRAME_COLOR = 0x56B6
VIS_BEACON_COLOR = 0x16D8
VIS_ORBIT_COLOR = 0x7B7F
VIS_POND_COLOR = 0x3292
DOT1_COLOR_0 = 0x01E0
DOT1_COLOR_1 = 0x03E0
DOT1_COLOR_2 = 0x3FE0
DOT1_COLOR_3 = 0x7FE0
DOT2_COLOR_0 = 0x4018
DOT2_COLOR_1 = 0x7C1F
DOT2_COLOR_2 = 0x7C7F
DOT2_COLOR_3 = 0x7FFF

KEY_A = 0x0001
KEY_B = 0x0002
KEY_SELECT = 0x0004
KEY_START = 0x0008
KEY_RIGHT = 0x0010
KEY_LEFT = 0x0020
KEY_UP = 0x0040
KEY_DOWN = 0x0080

Y_BAND_1 = MAX_Y // 4
Y_BAND_2 = MAX_Y // 2
Y_BAND_3 = (MAX_Y * 3) // 4
X_BAND_1 = MAX_X // 6
X_BAND_2 = (MAX_X * 2) // 6
X_BAND_3 = (MAX_X * 3) // 6
X_BAND_4 = (MAX_X * 4) // 6
X_BAND_5 = (MAX_X * 5) // 6

SOUNDCNT_L_CH13_BOTH = 0x5533
SOUNDCNT_H_DMG_50 = 0x0000
SOUNDCNT_X_MASTER_ENABLE = 0x0080
SOUND1_SWEEP_OFF = 0x0008
SOUND3_WRITE_BANK0 = 0x0040
SOUND3_PLAY_BANK0 = 0x0080

VOICE_CTL_0 = 0x3040
VOICE_CTL_1 = 0x4040
VOICE_CTL_2 = 0x5080
VOICE_CTL_3 = 0x6080

NOTE_C2 = 44
NOTE_D2 = 263
NOTE_E2 = 457
NOTE_G2 = 711
NOTE_A2 = 856
NOTE_C3 = 1046
NOTE_D3 = 1155
NOTE_E3 = 1253
NOTE_G3 = 1379
NOTE_A3 = 1452
NOTE_C4 = 1547
NOTE_D4 = 1602
NOTE_E4 = 1650
NOTE_G4 = 1714
NOTE_A4 = 1750
NOTE_C5 = 1798
NOTE_D5 = 1825
NOTE_E5 = 1849
NOTE_G5 = 1881
NOTE_A5 = 1899
NOTE_C6 = 1923
NOTE_D6 = 1936
NOTE_E6 = 1949
NOTE_G6 = 1964

SOUND1_FREQ_INIT = NOTE_E3
SOUND3_FREQ_INIT = NOTE_C4

SOUND3_LEVEL_0 = 0x2000
SOUND3_LEVEL_1 = 0x4000
SOUND3_LEVEL_2 = 0x8000
SOUND3_LEVEL_3 = 0x4000

PITCH_SHIFT_0 = 0
PITCH_SHIFT_1 = 96
PITCH_SHIFT_2 = 192
PITCH_SHIFT_3 = 288

WAVE_WORD_0 = 0xFEEDCB98
WAVE_WORD_1 = 0x9BCDEEFF
WAVE_WORD_2 = 0x12234578
WAVE_WORD_3 = 0x75432211


def u32(value: int) -> bytes:
    return struct.pack("<I", value & 0xFFFFFFFF)


def rol32(value: int, amount: int) -> int:
    amount %= 32
    return ((value << amount) | (value >> (32 - amount))) & 0xFFFFFFFF


def ror32(value: int, amount: int) -> int:
    amount %= 32
    return ((value >> amount) | (value << (32 - amount))) & 0xFFFFFFFF


def encode_arm_immediate(value: int) -> tuple[int, int]:
    value &= 0xFFFFFFFF
    for rotate in range(16):
        imm8 = rol32(value, rotate * 2) & 0xFF
        if ror32(imm8, rotate * 2) == value:
            return rotate, imm8
    raise ValueError(f"Immediate is not encodable in ARM format: {value:#010x}")


def reg_operand(rm: int, shift_imm: int = 0, shift_type: str = "LSL") -> int:
    return ((shift_imm & 0x1F) << 7) | (SHIFT[shift_type] << 5) | (rm & 0xF)


def encode_dp_imm(opcode: str, rd: int, rn: int, imm: int, *, cond: str = "AL", set_flags: bool = False) -> int:
    rotate, imm8 = encode_arm_immediate(imm)
    return (
        (COND[cond] << 28)
        | (1 << 25)
        | (OPCODE[opcode] << 21)
        | (int(set_flags) << 20)
        | ((rn & 0xF) << 16)
        | ((rd & 0xF) << 12)
        | (rotate << 8)
        | imm8
    )


def encode_dp_reg(
    opcode: str,
    rd: int,
    rn: int,
    rm: int,
    *,
    cond: str = "AL",
    set_flags: bool = False,
    shift_imm: int = 0,
    shift_type: str = "LSL",
) -> int:
    return (
        (COND[cond] << 28)
        | (OPCODE[opcode] << 21)
        | (int(set_flags) << 20)
        | ((rn & 0xF) << 16)
        | ((rd & 0xF) << 12)
        | reg_operand(rm, shift_imm=shift_imm, shift_type=shift_type)
    )


def encode_ldr_str(rd: int, rn: int, offset: int, *, load: bool, cond: str = "AL") -> int:
    if not 0 <= offset <= 0xFFF:
        raise ValueError(f"Word offset out of range: {offset}")
    return (
        (COND[cond] << 28)
        | (0b01 << 26)
        | (1 << 24)
        | (1 << 23)
        | (int(load) << 20)
        | ((rn & 0xF) << 16)
        | ((rd & 0xF) << 12)
        | offset
    )


def encode_halfword(rd: int, rn: int, offset: int, *, load: bool, cond: str = "AL") -> int:
    if not 0 <= offset <= 0xFF:
        raise ValueError(f"Halfword offset out of range: {offset}")
    return (
        (COND[cond] << 28)
        | (1 << 24)
        | (1 << 23)
        | (1 << 22)
        | (int(load) << 20)
        | ((rn & 0xF) << 16)
        | ((rd & 0xF) << 12)
        | (((offset >> 4) & 0xF) << 8)
        | 0xB0
        | (offset & 0xF)
    )


def encode_mul(rd: int, rm: int, rs: int, *, cond: str = "AL") -> int:
    return (
        (COND[cond] << 28)
        | ((rd & 0xF) << 16)
        | ((rs & 0xF) << 8)
        | 0x90
        | (rm & 0xF)
    )


def encode_branch(pc: int, target: int, *, link: bool, cond: str = "AL") -> int:
    offset = target - (pc + 8)
    if offset % 4 != 0:
        raise ValueError(f"Branch target is not word-aligned: pc={pc:#x}, target={target:#x}")
    imm24 = offset >> 2
    if not -(1 << 23) <= imm24 < (1 << 23):
        raise ValueError(f"Branch target out of range: pc={pc:#x}, target={target:#x}")
    return (COND[cond] << 28) | (0b101 << 25) | (int(link) << 24) | (imm24 & 0x00FFFFFF)


class Assembler:
    def __init__(self) -> None:
        self.items: list[tuple[str, object]] = []

    def label(self, name: str) -> None:
        self.items.append(("label", name))

    def instr(self, op: str, *args: object, **kwargs: object) -> None:
        self.items.append(("instr", (op, args, kwargs)))

    def word(self, value: int, *, label: str | None = None) -> None:
        if label is not None:
            self.label(label)
        self.items.append(("word", value))

    def assemble(self) -> bytes:
        labels: dict[str, int] = {}
        pc = 0
        for kind, payload in self.items:
            if kind == "label":
                labels[str(payload)] = pc
            else:
                pc += 4

        out = bytearray()
        pc = 0
        for kind, payload in self.items:
            if kind == "label":
                continue
            if kind == "word":
                out.extend(u32(int(payload)))
                pc += 4
                continue

            op, args, kwargs = payload
            cond = str(kwargs.get("cond", "AL")).upper()

            if op == "ldr_lit":
                rd, label = args
                target = labels[str(label)]
                offset = target - (pc + 8)
                if not 0 <= offset <= 0xFFF:
                    raise ValueError(f"Literal pool too far away for {label}: {offset}")
                word = encode_ldr_str(int(rd), 15, offset, load=True, cond=cond)
            elif op == "ldr":
                rd, rn, offset = args
                word = encode_ldr_str(int(rd), int(rn), int(offset), load=True, cond=cond)
            elif op == "str":
                rd, rn, offset = args
                word = encode_ldr_str(int(rd), int(rn), int(offset), load=False, cond=cond)
            elif op == "ldrh":
                rd, rn, offset = args
                word = encode_halfword(int(rd), int(rn), int(offset), load=True, cond=cond)
            elif op == "strh":
                rd, rn, offset = args
                word = encode_halfword(int(rd), int(rn), int(offset), load=False, cond=cond)
            elif op == "mov_imm":
                rd, imm = args
                word = encode_dp_imm("MOV", int(rd), 0, int(imm), cond=cond)
            elif op == "mov_reg":
                rd, rm = args
                word = encode_dp_reg("MOV", int(rd), 0, int(rm), cond=cond)
            elif op == "add_imm":
                rd, rn, imm = args
                word = encode_dp_imm("ADD", int(rd), int(rn), int(imm), cond=cond)
            elif op == "add_reg":
                rd, rn, rm = args
                word = encode_dp_reg("ADD", int(rd), int(rn), int(rm), cond=cond)
            elif op == "add_reg_lsl":
                rd, rn, rm, shift_imm = args
                word = encode_dp_reg(
                    "ADD",
                    int(rd),
                    int(rn),
                    int(rm),
                    cond=cond,
                    shift_imm=int(shift_imm),
                    shift_type="LSL",
                )
            elif op == "sub_imm":
                rd, rn, imm = args
                word = encode_dp_imm(
                    "SUB",
                    int(rd),
                    int(rn),
                    int(imm),
                    cond=cond,
                    set_flags=bool(kwargs.get("set_flags", False)),
                )
            elif op == "sub_reg":
                rd, rn, rm = args
                word = encode_dp_reg("SUB", int(rd), int(rn), int(rm), cond=cond)
            elif op == "cmp_imm":
                rn, imm = args
                word = encode_dp_imm("CMP", 0, int(rn), int(imm), cond=cond, set_flags=True)
            elif op == "tst_imm":
                rn, imm = args
                word = encode_dp_imm("TST", 0, int(rn), int(imm), cond=cond, set_flags=True)
            elif op == "orr_imm":
                rd, rn, imm = args
                word = encode_dp_imm("ORR", int(rd), int(rn), int(imm), cond=cond)
            elif op == "mul":
                rd, rm, rs = args
                word = encode_mul(int(rd), int(rm), int(rs), cond=cond)
            elif op == "b":
                (label,) = args
                word = encode_branch(pc, labels[str(label)], link=False, cond=cond)
            elif op == "bl":
                (label,) = args
                word = encode_branch(pc, labels[str(label)], link=True, cond=cond)
            else:
                raise ValueError(f"Unknown assembler op: {op}")

            out.extend(u32(word))
            pc += 4

        return bytes(out)


def build_program() -> bytes:
    asm = Assembler()

    asm.label("start")
    asm.instr("ldr_lit", 0, "lit_reg_dispcnt")
    asm.instr("ldr_lit", 1, "lit_dispcnt_mode3_bg2")
    asm.instr("str", 1, 0, 0)
    asm.instr("ldr_lit", 11, "lit_vram")
    asm.instr("mov_imm", 9, SCREEN_WIDTH)
    asm.instr("mov_imm", 10, SQUARE_SIZE)
    asm.instr("mov_imm", 3, 0)
    asm.instr("mov_imm", 4, DOT1_INIT_X)
    asm.instr("mov_imm", 5, DOT1_INIT_Y)
    asm.instr("mov_imm", 6, DOT2_INIT_X)
    asm.instr("mov_imm", 7, DOT2_INIT_Y)
    asm.instr("bl", "init_audio")
    asm.instr("mov_reg", 0, 11)
    asm.instr("ldr_lit", 1, "lit_vis_bg_color")
    asm.instr("bl", "fill_screen")
    asm.instr("bl", "animate_visualizer")
    asm.instr("bl", "draw_visualizer")

    asm.label("frame_loop")
    asm.instr("bl", "wait_vblank")
    asm.instr("add_imm", 3, 3, 1)
    asm.instr("cmp_imm", 3, VIS_FRAME_RESET)
    asm.instr("mov_imm", 3, 0, cond="GE")
    asm.instr("mov_reg", 0, 11)
    asm.instr("ldr_lit", 1, "lit_vis_bg_color")
    asm.instr("bl", "fill_screen")
    asm.instr("bl", "animate_visualizer")
    asm.instr("bl", "draw_visualizer")
    asm.instr("mov_reg", 0, 4)
    asm.instr("mov_reg", 1, 5)
    asm.instr("bl", "update_voice1")
    asm.instr("mov_reg", 0, 6)
    asm.instr("mov_reg", 1, 7)
    asm.instr("bl", "update_voice2")
    asm.instr("b", "frame_loop")

    asm.label("wait_vblank")
    asm.instr("ldr_lit", 0, "lit_reg_vcount")
    asm.label("wait_vblank_clear")
    asm.instr("ldrh", 1, 0, 0)
    asm.instr("cmp_imm", 1, 160)
    asm.instr("b", "wait_vblank_clear", cond="GE")
    asm.label("wait_vblank_start")
    asm.instr("ldrh", 1, 0, 0)
    asm.instr("cmp_imm", 1, 160)
    asm.instr("b", "wait_vblank_start", cond="LT")
    asm.instr("mov_reg", 15, 14)

    asm.label("animate_visualizer")
    asm.instr("cmp_imm", 3, VIS_PHASE_1)
    asm.instr("b", "anim_phase_0", cond="LT")
    asm.instr("cmp_imm", 3, VIS_PHASE_2)
    asm.instr("b", "anim_phase_1", cond="LT")
    asm.instr("cmp_imm", 3, VIS_PHASE_3)
    asm.instr("b", "anim_phase_2", cond="LT")
    asm.instr("b", "anim_phase_3")

    asm.label("anim_phase_0")
    asm.instr("mov_imm", 4, 162)
    asm.instr("mov_imm", 5, 70)
    asm.instr("mov_imm", 6, 58)
    asm.instr("mov_imm", 7, 70)
    asm.instr("mov_reg", 15, 14)

    asm.label("anim_phase_1")
    asm.instr("mov_imm", 4, 120)
    asm.instr("mov_imm", 5, 112)
    asm.instr("mov_imm", 6, 100)
    asm.instr("mov_imm", 7, 28)
    asm.instr("mov_reg", 15, 14)

    asm.label("anim_phase_2")
    asm.instr("mov_imm", 4, 58)
    asm.instr("mov_imm", 5, 70)
    asm.instr("mov_imm", 6, 162)
    asm.instr("mov_imm", 7, 70)
    asm.instr("mov_reg", 15, 14)

    asm.label("anim_phase_3")
    asm.instr("mov_imm", 4, 100)
    asm.instr("mov_imm", 5, 28)
    asm.instr("mov_imm", 6, 120)
    asm.instr("mov_imm", 7, 112)
    asm.instr("mov_reg", 15, 14)

    asm.label("draw_visualizer")
    asm.instr("bl", "draw_workbook_frame")
    asm.instr("bl", "draw_sheet_beacons")
    asm.instr("bl", "draw_breathing_cube")
    asm.instr("bl", "draw_goose_core")
    asm.instr("bl", "draw_orbit_motes")
    asm.instr("mov_imm", 10, SQUARE_SIZE)
    asm.instr("mov_reg", 0, 4)
    asm.instr("mov_reg", 1, 5)
    asm.instr("bl", "color_dot1_from_y")
    asm.instr("bl", "draw_square")
    asm.instr("mov_reg", 0, 6)
    asm.instr("mov_reg", 1, 7)
    asm.instr("bl", "color_dot2_from_y")
    asm.instr("bl", "draw_square")
    asm.instr("mov_reg", 15, 14)

    asm.label("draw_workbook_frame")
    asm.instr("mov_imm", 10, 220)
    asm.instr("mov_imm", 0, 10)
    asm.instr("mov_imm", 1, 10)
    asm.instr("ldr_lit", 2, "lit_vis_frame_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, 208)
    asm.instr("mov_imm", 0, 16)
    asm.instr("mov_imm", 1, 16)
    asm.instr("ldr_lit", 2, "lit_vis_bg_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, 44)
    asm.instr("mov_imm", 0, 18)
    asm.instr("mov_imm", 1, 118)
    asm.instr("ldr_lit", 2, "lit_vis_pond_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_reg", 15, 14)

    asm.label("draw_sheet_beacons")
    asm.instr("mov_imm", 10, 12)
    asm.instr("mov_imm", 0, 30)
    asm.instr("mov_imm", 1, 22)
    asm.instr("ldr_lit", 2, "lit_vis_beacon_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, 12)
    asm.instr("mov_imm", 0, 68)
    asm.instr("mov_imm", 1, 22)
    asm.instr("ldr_lit", 2, "lit_vis_beacon_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, 18)
    asm.instr("mov_imm", 0, 111)
    asm.instr("mov_imm", 1, 19)
    asm.instr("ldr_lit", 2, "lit_vis_orbit_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, 12)
    asm.instr("mov_imm", 0, 160)
    asm.instr("mov_imm", 1, 22)
    asm.instr("ldr_lit", 2, "lit_vis_beacon_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, 12)
    asm.instr("mov_imm", 0, 198)
    asm.instr("mov_imm", 1, 22)
    asm.instr("ldr_lit", 2, "lit_vis_beacon_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_reg", 15, 14)

    asm.label("draw_breathing_cube")
    asm.instr("cmp_imm", 3, VIS_PHASE_2)
    asm.instr("b", "cube_open", cond="LT")
    asm.instr("b", "cube_closed")

    asm.label("cube_open")
    asm.instr("mov_imm", 10, 82)
    asm.instr("mov_imm", 0, 79)
    asm.instr("mov_imm", 1, 39)
    asm.instr("ldr_lit", 2, "lit_vis_outer_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, 54)
    asm.instr("mov_imm", 0, 93)
    asm.instr("mov_imm", 1, 53)
    asm.instr("ldr_lit", 2, "lit_vis_mid_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, 28)
    asm.instr("mov_imm", 0, 106)
    asm.instr("mov_imm", 1, 66)
    asm.instr("ldr_lit", 2, "lit_vis_inner_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_reg", 15, 14)

    asm.label("cube_closed")
    asm.instr("mov_imm", 10, 74)
    asm.instr("mov_imm", 0, 83)
    asm.instr("mov_imm", 1, 43)
    asm.instr("ldr_lit", 2, "lit_vis_outer_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, 48)
    asm.instr("mov_imm", 0, 96)
    asm.instr("mov_imm", 1, 56)
    asm.instr("ldr_lit", 2, "lit_vis_mid_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, 24)
    asm.instr("mov_imm", 0, 108)
    asm.instr("mov_imm", 1, 68)
    asm.instr("ldr_lit", 2, "lit_vis_inner_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_reg", 15, 14)

    asm.label("draw_goose_core")
    asm.instr("mov_imm", 10, 18)
    asm.instr("mov_imm", 0, 106)
    asm.instr("mov_imm", 1, 76)
    asm.instr("ldr_lit", 2, "lit_vis_goose_body_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, 10)
    asm.instr("mov_imm", 0, 126)
    asm.instr("mov_imm", 1, 64)
    asm.instr("ldr_lit", 2, "lit_vis_goose_head_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, 6)
    asm.instr("mov_imm", 0, 136)
    asm.instr("mov_imm", 1, 66)
    asm.instr("ldr_lit", 2, "lit_vis_goose_beak_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, 6)
    asm.instr("mov_imm", 0, 100)
    asm.instr("mov_imm", 1, 80)
    asm.instr("ldr_lit", 2, "lit_vis_goose_body_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, 4)
    asm.instr("mov_imm", 0, 112)
    asm.instr("mov_imm", 1, 94)
    asm.instr("ldr_lit", 2, "lit_vis_goose_foot_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, 4)
    asm.instr("mov_imm", 0, 124)
    asm.instr("mov_imm", 1, 94)
    asm.instr("ldr_lit", 2, "lit_vis_goose_foot_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_reg", 15, 14)

    asm.label("draw_orbit_motes")
    asm.instr("cmp_imm", 3, VIS_PHASE_1)
    asm.instr("b", "orbit_phase_0", cond="LT")
    asm.instr("cmp_imm", 3, VIS_PHASE_2)
    asm.instr("b", "orbit_phase_1", cond="LT")
    asm.instr("cmp_imm", 3, VIS_PHASE_3)
    asm.instr("b", "orbit_phase_2", cond="LT")
    asm.instr("b", "orbit_phase_3")

    asm.label("orbit_phase_0")
    asm.instr("mov_imm", 10, 8)
    asm.instr("mov_imm", 0, 64)
    asm.instr("mov_imm", 1, 50)
    asm.instr("ldr_lit", 2, "lit_vis_orbit_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, 8)
    asm.instr("mov_imm", 0, 168)
    asm.instr("mov_imm", 1, 102)
    asm.instr("ldr_lit", 2, "lit_vis_orbit_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_reg", 15, 14)

    asm.label("orbit_phase_1")
    asm.instr("mov_imm", 10, 8)
    asm.instr("mov_imm", 0, 92)
    asm.instr("mov_imm", 1, 34)
    asm.instr("ldr_lit", 2, "lit_vis_orbit_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, 8)
    asm.instr("mov_imm", 0, 140)
    asm.instr("mov_imm", 1, 118)
    asm.instr("ldr_lit", 2, "lit_vis_orbit_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_reg", 15, 14)

    asm.label("orbit_phase_2")
    asm.instr("mov_imm", 10, 8)
    asm.instr("mov_imm", 0, 168)
    asm.instr("mov_imm", 1, 50)
    asm.instr("ldr_lit", 2, "lit_vis_orbit_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, 8)
    asm.instr("mov_imm", 0, 64)
    asm.instr("mov_imm", 1, 102)
    asm.instr("ldr_lit", 2, "lit_vis_orbit_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_reg", 15, 14)

    asm.label("orbit_phase_3")
    asm.instr("mov_imm", 10, 8)
    asm.instr("mov_imm", 0, 140)
    asm.instr("mov_imm", 1, 34)
    asm.instr("ldr_lit", 2, "lit_vis_orbit_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, 8)
    asm.instr("mov_imm", 0, 92)
    asm.instr("mov_imm", 1, 118)
    asm.instr("ldr_lit", 2, "lit_vis_orbit_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_reg", 15, 14)

    asm.label("init_audio")
    asm.instr("ldr_lit", 0, "lit_reg_soundcnt_x")
    asm.instr("ldr_lit", 1, "lit_soundcnt_x_master_enable")
    asm.instr("strh", 1, 0, 0)
    asm.instr("ldr_lit", 0, "lit_reg_soundcnt_h")
    asm.instr("ldr_lit", 1, "lit_soundcnt_h_dmg_50")
    asm.instr("strh", 1, 0, 0)
    asm.instr("ldr_lit", 0, "lit_reg_soundcnt_l")
    asm.instr("ldr_lit", 1, "lit_soundcnt_l_ch13_both")
    asm.instr("strh", 1, 0, 0)
    asm.instr("ldr_lit", 0, "lit_reg_sound1cnt_l")
    asm.instr("ldr_lit", 1, "lit_sound1_sweep_off")
    asm.instr("strh", 1, 0, 0)
    asm.instr("ldr_lit", 0, "lit_reg_sound1cnt_h")
    asm.instr("ldr_lit", 1, "lit_voice_ctl_1")
    asm.instr("strh", 1, 0, 0)
    asm.instr("ldr_lit", 0, "lit_reg_sound1cnt_x")
    asm.instr("ldr_lit", 1, "lit_sound1_freq_init")
    asm.instr("orr_imm", 1, 1, 0x8000)
    asm.instr("strh", 1, 0, 0)

    asm.instr("ldr_lit", 0, "lit_reg_sound3cnt_l")
    asm.instr("ldr_lit", 1, "lit_sound3_write_bank0")
    asm.instr("strh", 1, 0, 0)
    asm.instr("ldr_lit", 0, "lit_reg_wave_ram0")
    asm.instr("ldr_lit", 1, "lit_wave_word_0")
    asm.instr("str", 1, 0, 0)
    asm.instr("ldr_lit", 0, "lit_reg_wave_ram1")
    asm.instr("ldr_lit", 1, "lit_wave_word_1")
    asm.instr("str", 1, 0, 0)
    asm.instr("ldr_lit", 0, "lit_reg_wave_ram2")
    asm.instr("ldr_lit", 1, "lit_wave_word_2")
    asm.instr("str", 1, 0, 0)
    asm.instr("ldr_lit", 0, "lit_reg_wave_ram3")
    asm.instr("ldr_lit", 1, "lit_wave_word_3")
    asm.instr("str", 1, 0, 0)
    asm.instr("ldr_lit", 0, "lit_reg_sound3cnt_l")
    asm.instr("ldr_lit", 1, "lit_sound3_play_bank0")
    asm.instr("strh", 1, 0, 0)
    asm.instr("ldr_lit", 0, "lit_reg_sound3cnt_h")
    asm.instr("ldr_lit", 1, "lit_sound3_level_1")
    asm.instr("strh", 1, 0, 0)
    asm.instr("ldr_lit", 0, "lit_reg_sound3cnt_x")
    asm.instr("ldr_lit", 1, "lit_sound3_freq_init")
    asm.instr("orr_imm", 1, 1, 0x8000)
    asm.instr("strh", 1, 0, 0)
    asm.instr("mov_reg", 15, 14)

    asm.label("update_voice1")
    asm.instr("ldr_lit", 2, "lit_voice_ctl_1")
    asm.instr("ldr_lit", 3, "lit_reg_sound1cnt_h")
    asm.instr("strh", 2, 3, 0)
    asm.instr("cmp_imm", 1, Y_BAND_1)
    asm.instr("b", "voice1_band_0", cond="LT")
    asm.instr("cmp_imm", 1, Y_BAND_2)
    asm.instr("b", "voice1_band_1", cond="LT")
    asm.instr("cmp_imm", 1, Y_BAND_3)
    asm.instr("b", "voice1_band_2", cond="LT")
    asm.instr("b", "voice1_band_3")

    asm.label("voice1_band_0")
    asm.instr("cmp_imm", 0, X_BAND_1)
    asm.instr("b", "voice1_band_0_note_0", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_2)
    asm.instr("b", "voice1_band_0_note_1", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_3)
    asm.instr("b", "voice1_band_0_note_2", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_4)
    asm.instr("b", "voice1_band_0_note_3", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_5)
    asm.instr("b", "voice1_band_0_note_4", cond="LT")
    asm.instr("ldr_lit", 3, "lit_note_c3")
    asm.instr("b", "voice1_note_done")
    asm.label("voice1_band_0_note_0")
    asm.instr("ldr_lit", 3, "lit_note_c2")
    asm.instr("b", "voice1_note_done")
    asm.label("voice1_band_0_note_1")
    asm.instr("ldr_lit", 3, "lit_note_d2")
    asm.instr("b", "voice1_note_done")
    asm.label("voice1_band_0_note_2")
    asm.instr("ldr_lit", 3, "lit_note_e2")
    asm.instr("b", "voice1_note_done")
    asm.label("voice1_band_0_note_3")
    asm.instr("ldr_lit", 3, "lit_note_g2")
    asm.instr("b", "voice1_note_done")
    asm.label("voice1_band_0_note_4")
    asm.instr("ldr_lit", 3, "lit_note_a2")
    asm.instr("b", "voice1_note_done")

    asm.label("voice1_band_1")
    asm.instr("cmp_imm", 0, X_BAND_1)
    asm.instr("b", "voice1_band_1_note_0", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_2)
    asm.instr("b", "voice1_band_1_note_1", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_3)
    asm.instr("b", "voice1_band_1_note_2", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_4)
    asm.instr("b", "voice1_band_1_note_3", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_5)
    asm.instr("b", "voice1_band_1_note_4", cond="LT")
    asm.instr("ldr_lit", 3, "lit_note_c4")
    asm.instr("b", "voice1_note_done")
    asm.label("voice1_band_1_note_0")
    asm.instr("ldr_lit", 3, "lit_note_c3")
    asm.instr("b", "voice1_note_done")
    asm.label("voice1_band_1_note_1")
    asm.instr("ldr_lit", 3, "lit_note_d3")
    asm.instr("b", "voice1_note_done")
    asm.label("voice1_band_1_note_2")
    asm.instr("ldr_lit", 3, "lit_note_e3")
    asm.instr("b", "voice1_note_done")
    asm.label("voice1_band_1_note_3")
    asm.instr("ldr_lit", 3, "lit_note_g3")
    asm.instr("b", "voice1_note_done")
    asm.label("voice1_band_1_note_4")
    asm.instr("ldr_lit", 3, "lit_note_a3")
    asm.instr("b", "voice1_note_done")

    asm.label("voice1_band_2")
    asm.instr("cmp_imm", 0, X_BAND_1)
    asm.instr("b", "voice1_band_2_note_0", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_2)
    asm.instr("b", "voice1_band_2_note_1", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_3)
    asm.instr("b", "voice1_band_2_note_2", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_4)
    asm.instr("b", "voice1_band_2_note_3", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_5)
    asm.instr("b", "voice1_band_2_note_4", cond="LT")
    asm.instr("ldr_lit", 3, "lit_note_c5")
    asm.instr("b", "voice1_note_done")
    asm.label("voice1_band_2_note_0")
    asm.instr("ldr_lit", 3, "lit_note_c4")
    asm.instr("b", "voice1_note_done")
    asm.label("voice1_band_2_note_1")
    asm.instr("ldr_lit", 3, "lit_note_d4")
    asm.instr("b", "voice1_note_done")
    asm.label("voice1_band_2_note_2")
    asm.instr("ldr_lit", 3, "lit_note_e4")
    asm.instr("b", "voice1_note_done")
    asm.label("voice1_band_2_note_3")
    asm.instr("ldr_lit", 3, "lit_note_g4")
    asm.instr("b", "voice1_note_done")
    asm.label("voice1_band_2_note_4")
    asm.instr("ldr_lit", 3, "lit_note_a4")
    asm.instr("b", "voice1_note_done")

    asm.label("voice1_band_3")
    asm.instr("cmp_imm", 0, X_BAND_1)
    asm.instr("b", "voice1_band_3_note_0", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_2)
    asm.instr("b", "voice1_band_3_note_1", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_3)
    asm.instr("b", "voice1_band_3_note_2", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_4)
    asm.instr("b", "voice1_band_3_note_3", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_5)
    asm.instr("b", "voice1_band_3_note_4", cond="LT")
    asm.instr("ldr_lit", 3, "lit_note_c6")
    asm.instr("b", "voice1_note_done")
    asm.label("voice1_band_3_note_0")
    asm.instr("ldr_lit", 3, "lit_note_c5")
    asm.instr("b", "voice1_note_done")
    asm.label("voice1_band_3_note_1")
    asm.instr("ldr_lit", 3, "lit_note_d5")
    asm.instr("b", "voice1_note_done")
    asm.label("voice1_band_3_note_2")
    asm.instr("ldr_lit", 3, "lit_note_e5")
    asm.instr("b", "voice1_note_done")
    asm.label("voice1_band_3_note_3")
    asm.instr("ldr_lit", 3, "lit_note_g5")
    asm.instr("b", "voice1_note_done")
    asm.label("voice1_band_3_note_4")
    asm.instr("ldr_lit", 3, "lit_note_a5")

    asm.label("voice1_note_done")
    asm.instr("ldr_lit", 12, "lit_reg_sound1cnt_x")
    asm.instr("strh", 3, 12, 0)
    asm.instr("mov_reg", 15, 14)

    asm.label("update_voice2")
    asm.instr("ldr_lit", 2, "lit_sound3_level_1")
    asm.instr("ldr_lit", 3, "lit_reg_sound3cnt_h")
    asm.instr("strh", 2, 3, 0)
    asm.instr("cmp_imm", 1, Y_BAND_1)
    asm.instr("b", "voice2_band_0", cond="LT")
    asm.instr("cmp_imm", 1, Y_BAND_2)
    asm.instr("b", "voice2_band_1", cond="LT")
    asm.instr("cmp_imm", 1, Y_BAND_3)
    asm.instr("b", "voice2_band_2", cond="LT")
    asm.instr("b", "voice2_band_3")

    asm.label("voice2_band_0")
    asm.instr("cmp_imm", 0, X_BAND_1)
    asm.instr("b", "voice2_band_0_note_0", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_2)
    asm.instr("b", "voice2_band_0_note_1", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_3)
    asm.instr("b", "voice2_band_0_note_2", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_4)
    asm.instr("b", "voice2_band_0_note_3", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_5)
    asm.instr("b", "voice2_band_0_note_4", cond="LT")
    asm.instr("ldr_lit", 3, "lit_note_g3")
    asm.instr("b", "voice2_note_done")
    asm.label("voice2_band_0_note_0")
    asm.instr("ldr_lit", 3, "lit_note_g2")
    asm.instr("b", "voice2_note_done")
    asm.label("voice2_band_0_note_1")
    asm.instr("ldr_lit", 3, "lit_note_a2")
    asm.instr("b", "voice2_note_done")
    asm.label("voice2_band_0_note_2")
    asm.instr("ldr_lit", 3, "lit_note_c3")
    asm.instr("b", "voice2_note_done")
    asm.label("voice2_band_0_note_3")
    asm.instr("ldr_lit", 3, "lit_note_d3")
    asm.instr("b", "voice2_note_done")
    asm.label("voice2_band_0_note_4")
    asm.instr("ldr_lit", 3, "lit_note_e3")
    asm.instr("b", "voice2_note_done")

    asm.label("voice2_band_1")
    asm.instr("cmp_imm", 0, X_BAND_1)
    asm.instr("b", "voice2_band_1_note_0", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_2)
    asm.instr("b", "voice2_band_1_note_1", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_3)
    asm.instr("b", "voice2_band_1_note_2", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_4)
    asm.instr("b", "voice2_band_1_note_3", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_5)
    asm.instr("b", "voice2_band_1_note_4", cond="LT")
    asm.instr("ldr_lit", 3, "lit_note_g4")
    asm.instr("b", "voice2_note_done")
    asm.label("voice2_band_1_note_0")
    asm.instr("ldr_lit", 3, "lit_note_g3")
    asm.instr("b", "voice2_note_done")
    asm.label("voice2_band_1_note_1")
    asm.instr("ldr_lit", 3, "lit_note_a3")
    asm.instr("b", "voice2_note_done")
    asm.label("voice2_band_1_note_2")
    asm.instr("ldr_lit", 3, "lit_note_c4")
    asm.instr("b", "voice2_note_done")
    asm.label("voice2_band_1_note_3")
    asm.instr("ldr_lit", 3, "lit_note_d4")
    asm.instr("b", "voice2_note_done")
    asm.label("voice2_band_1_note_4")
    asm.instr("ldr_lit", 3, "lit_note_e4")
    asm.instr("b", "voice2_note_done")

    asm.label("voice2_band_2")
    asm.instr("cmp_imm", 0, X_BAND_1)
    asm.instr("b", "voice2_band_2_note_0", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_2)
    asm.instr("b", "voice2_band_2_note_1", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_3)
    asm.instr("b", "voice2_band_2_note_2", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_4)
    asm.instr("b", "voice2_band_2_note_3", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_5)
    asm.instr("b", "voice2_band_2_note_4", cond="LT")
    asm.instr("ldr_lit", 3, "lit_note_g5")
    asm.instr("b", "voice2_note_done")
    asm.label("voice2_band_2_note_0")
    asm.instr("ldr_lit", 3, "lit_note_g4")
    asm.instr("b", "voice2_note_done")
    asm.label("voice2_band_2_note_1")
    asm.instr("ldr_lit", 3, "lit_note_a4")
    asm.instr("b", "voice2_note_done")
    asm.label("voice2_band_2_note_2")
    asm.instr("ldr_lit", 3, "lit_note_c5")
    asm.instr("b", "voice2_note_done")
    asm.label("voice2_band_2_note_3")
    asm.instr("ldr_lit", 3, "lit_note_d5")
    asm.instr("b", "voice2_note_done")
    asm.label("voice2_band_2_note_4")
    asm.instr("ldr_lit", 3, "lit_note_e5")
    asm.instr("b", "voice2_note_done")

    asm.label("voice2_band_3")
    asm.instr("cmp_imm", 0, X_BAND_1)
    asm.instr("b", "voice2_band_3_note_0", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_2)
    asm.instr("b", "voice2_band_3_note_1", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_3)
    asm.instr("b", "voice2_band_3_note_2", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_4)
    asm.instr("b", "voice2_band_3_note_3", cond="LT")
    asm.instr("cmp_imm", 0, X_BAND_5)
    asm.instr("b", "voice2_band_3_note_4", cond="LT")
    asm.instr("ldr_lit", 3, "lit_note_g6")
    asm.instr("b", "voice2_note_done")
    asm.label("voice2_band_3_note_0")
    asm.instr("ldr_lit", 3, "lit_note_g5")
    asm.instr("b", "voice2_note_done")
    asm.label("voice2_band_3_note_1")
    asm.instr("ldr_lit", 3, "lit_note_a5")
    asm.instr("b", "voice2_note_done")
    asm.label("voice2_band_3_note_2")
    asm.instr("ldr_lit", 3, "lit_note_c6")
    asm.instr("b", "voice2_note_done")
    asm.label("voice2_band_3_note_3")
    asm.instr("ldr_lit", 3, "lit_note_d6")
    asm.instr("b", "voice2_note_done")
    asm.label("voice2_band_3_note_4")
    asm.instr("ldr_lit", 3, "lit_note_e6")

    asm.label("voice2_note_done")
    asm.instr("ldr_lit", 12, "lit_reg_sound3cnt_x")
    asm.instr("strh", 3, 12, 0)
    asm.instr("mov_reg", 15, 14)

    asm.label("color_dot1_from_y")
    asm.instr("cmp_imm", 1, Y_BAND_1)
    asm.instr("b", "color1_band_0", cond="LT")
    asm.instr("cmp_imm", 1, Y_BAND_2)
    asm.instr("b", "color1_band_1", cond="LT")
    asm.instr("cmp_imm", 1, Y_BAND_3)
    asm.instr("b", "color1_band_2", cond="LT")
    asm.instr("ldr_lit", 2, "lit_dot1_color_3")
    asm.instr("mov_reg", 15, 14)
    asm.label("color1_band_0")
    asm.instr("ldr_lit", 2, "lit_dot1_color_0")
    asm.instr("mov_reg", 15, 14)
    asm.label("color1_band_1")
    asm.instr("ldr_lit", 2, "lit_dot1_color_1")
    asm.instr("mov_reg", 15, 14)
    asm.label("color1_band_2")
    asm.instr("ldr_lit", 2, "lit_dot1_color_2")
    asm.instr("mov_reg", 15, 14)

    asm.label("color_dot2_from_y")
    asm.instr("cmp_imm", 1, Y_BAND_1)
    asm.instr("b", "color2_band_0", cond="LT")
    asm.instr("cmp_imm", 1, Y_BAND_2)
    asm.instr("b", "color2_band_1", cond="LT")
    asm.instr("cmp_imm", 1, Y_BAND_3)
    asm.instr("b", "color2_band_2", cond="LT")
    asm.instr("ldr_lit", 2, "lit_dot2_color_3")
    asm.instr("mov_reg", 15, 14)
    asm.label("color2_band_0")
    asm.instr("ldr_lit", 2, "lit_dot2_color_0")
    asm.instr("mov_reg", 15, 14)
    asm.label("color2_band_1")
    asm.instr("ldr_lit", 2, "lit_dot2_color_1")
    asm.instr("mov_reg", 15, 14)
    asm.label("color2_band_2")
    asm.instr("ldr_lit", 2, "lit_dot2_color_2")
    asm.instr("mov_reg", 15, 14)

    asm.label("fill_screen")
    asm.instr("mov_imm", 2, PIXEL_COUNT)
    asm.label("fill_loop")
    asm.instr("strh", 1, 0, 0)
    asm.instr("add_imm", 0, 0, 2)
    asm.instr("sub_imm", 2, 2, 1, set_flags=True)
    asm.instr("b", "fill_loop", cond="NE")
    asm.instr("mov_reg", 15, 14)

    asm.label("draw_pixel_sphere")
    asm.instr("mov_imm", 10, SPHERE_HALO_1_SIZE)
    asm.instr("mov_imm", 0, SPHERE_HALO_1_X)
    asm.instr("mov_imm", 1, SPHERE_HALO_1_Y)
    asm.instr("ldr_lit", 2, "lit_sphere_halo_1_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, SPHERE_HALO_2_SIZE)
    asm.instr("mov_imm", 0, SPHERE_HALO_2_X)
    asm.instr("mov_imm", 1, SPHERE_HALO_2_Y)
    asm.instr("ldr_lit", 2, "lit_sphere_halo_2_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_imm", 10, SPHERE_CORE_SIZE)
    asm.instr("mov_imm", 0, SPHERE_CORE_X)
    asm.instr("mov_imm", 1, SPHERE_CORE_Y)
    asm.instr("ldr_lit", 2, "lit_sphere_core_color")
    asm.instr("bl", "draw_square")
    asm.instr("mov_reg", 15, 14)

    asm.label("draw_square")
    asm.instr("mul", 12, 1, 9)
    asm.instr("add_reg", 12, 12, 0)
    asm.instr("add_reg_lsl", 0, 11, 12, 1)
    asm.instr("mov_reg", 3, 10)
    asm.label("draw_row")
    asm.instr("mov_reg", 12, 10)
    asm.instr("mov_reg", 1, 0)
    asm.label("draw_col")
    asm.instr("strh", 2, 1, 0)
    asm.instr("add_imm", 1, 1, 2)
    asm.instr("sub_imm", 12, 12, 1, set_flags=True)
    asm.instr("b", "draw_col", cond="NE")
    asm.instr("add_imm", 0, 0, ROW_STRIDE_BYTES)
    asm.instr("sub_imm", 3, 3, 1, set_flags=True)
    asm.instr("b", "draw_row", cond="NE")
    asm.instr("mov_reg", 15, 14)

    asm.word(REG_DISPCNT, label="lit_reg_dispcnt")
    asm.word(REG_SOUND1CNT_L, label="lit_reg_sound1cnt_l")
    asm.word(REG_SOUND1CNT_H, label="lit_reg_sound1cnt_h")
    asm.word(REG_SOUND1CNT_X, label="lit_reg_sound1cnt_x")
    asm.word(REG_SOUND2CNT_L, label="lit_reg_sound2cnt_l")
    asm.word(REG_SOUND2CNT_H, label="lit_reg_sound2cnt_h")
    asm.word(REG_SOUND3CNT_L, label="lit_reg_sound3cnt_l")
    asm.word(REG_SOUND3CNT_H, label="lit_reg_sound3cnt_h")
    asm.word(REG_SOUND3CNT_X, label="lit_reg_sound3cnt_x")
    asm.word(REG_SOUNDCNT_L, label="lit_reg_soundcnt_l")
    asm.word(REG_SOUNDCNT_H, label="lit_reg_soundcnt_h")
    asm.word(REG_SOUNDCNT_X, label="lit_reg_soundcnt_x")
    asm.word(REG_WAVE_RAM0, label="lit_reg_wave_ram0")
    asm.word(REG_WAVE_RAM1, label="lit_reg_wave_ram1")
    asm.word(REG_WAVE_RAM2, label="lit_reg_wave_ram2")
    asm.word(REG_WAVE_RAM3, label="lit_reg_wave_ram3")
    asm.word(DISPCNT_MODE3_BG2, label="lit_dispcnt_mode3_bg2")
    asm.word(VRAM, label="lit_vram")
    asm.word(BG_COLOR, label="lit_bg_color")
    asm.word(VIS_BG_COLOR, label="lit_vis_bg_color")
    asm.word(VIS_OUTER_COLOR, label="lit_vis_outer_color")
    asm.word(VIS_MID_COLOR, label="lit_vis_mid_color")
    asm.word(VIS_INNER_COLOR, label="lit_vis_inner_color")
    asm.word(VIS_GOOSE_BODY_COLOR, label="lit_vis_goose_body_color")
    asm.word(VIS_GOOSE_HEAD_COLOR, label="lit_vis_goose_head_color")
    asm.word(VIS_GOOSE_BEAK_COLOR, label="lit_vis_goose_beak_color")
    asm.word(VIS_GOOSE_FOOT_COLOR, label="lit_vis_goose_foot_color")
    asm.word(VIS_FRAME_COLOR, label="lit_vis_frame_color")
    asm.word(VIS_BEACON_COLOR, label="lit_vis_beacon_color")
    asm.word(VIS_ORBIT_COLOR, label="lit_vis_orbit_color")
    asm.word(VIS_POND_COLOR, label="lit_vis_pond_color")
    asm.word(SPHERE_HALO_1_COLOR, label="lit_sphere_halo_1_color")
    asm.word(SPHERE_HALO_2_COLOR, label="lit_sphere_halo_2_color")
    asm.word(SPHERE_CORE_COLOR, label="lit_sphere_core_color")
    asm.word(DOT1_COLOR, label="lit_dot1_color")
    asm.word(DOT2_COLOR, label="lit_dot2_color")
    asm.word(DOT1_COLOR_0, label="lit_dot1_color_0")
    asm.word(DOT1_COLOR_1, label="lit_dot1_color_1")
    asm.word(DOT1_COLOR_2, label="lit_dot1_color_2")
    asm.word(DOT1_COLOR_3, label="lit_dot1_color_3")
    asm.word(DOT2_COLOR_0, label="lit_dot2_color_0")
    asm.word(DOT2_COLOR_1, label="lit_dot2_color_1")
    asm.word(DOT2_COLOR_2, label="lit_dot2_color_2")
    asm.word(DOT2_COLOR_3, label="lit_dot2_color_3")
    asm.word(REG_KEYINPUT, label="lit_reg_keyinput")
    asm.word(REG_VCOUNT, label="lit_reg_vcount")
    asm.word(SOUNDCNT_L_CH13_BOTH, label="lit_soundcnt_l_ch13_both")
    asm.word(SOUNDCNT_H_DMG_50, label="lit_soundcnt_h_dmg_50")
    asm.word(SOUNDCNT_X_MASTER_ENABLE, label="lit_soundcnt_x_master_enable")
    asm.word(SOUND1_SWEEP_OFF, label="lit_sound1_sweep_off")
    asm.word(SOUND3_WRITE_BANK0, label="lit_sound3_write_bank0")
    asm.word(SOUND3_PLAY_BANK0, label="lit_sound3_play_bank0")
    asm.word(VOICE_CTL_0, label="lit_voice_ctl_0")
    asm.word(VOICE_CTL_1, label="lit_voice_ctl_1")
    asm.word(VOICE_CTL_2, label="lit_voice_ctl_2")
    asm.word(VOICE_CTL_3, label="lit_voice_ctl_3")
    asm.word(SOUND1_FREQ_INIT, label="lit_sound1_freq_init")
    asm.word(SOUND3_FREQ_INIT, label="lit_sound3_freq_init")
    asm.word(SOUND3_LEVEL_0, label="lit_sound3_level_0")
    asm.word(SOUND3_LEVEL_1, label="lit_sound3_level_1")
    asm.word(SOUND3_LEVEL_2, label="lit_sound3_level_2")
    asm.word(SOUND3_LEVEL_3, label="lit_sound3_level_3")
    asm.word(NOTE_C2, label="lit_note_c2")
    asm.word(NOTE_D2, label="lit_note_d2")
    asm.word(NOTE_E2, label="lit_note_e2")
    asm.word(NOTE_G2, label="lit_note_g2")
    asm.word(NOTE_A2, label="lit_note_a2")
    asm.word(NOTE_C3, label="lit_note_c3")
    asm.word(NOTE_D3, label="lit_note_d3")
    asm.word(NOTE_E3, label="lit_note_e3")
    asm.word(NOTE_G3, label="lit_note_g3")
    asm.word(NOTE_A3, label="lit_note_a3")
    asm.word(NOTE_C4, label="lit_note_c4")
    asm.word(NOTE_D4, label="lit_note_d4")
    asm.word(NOTE_E4, label="lit_note_e4")
    asm.word(NOTE_G4, label="lit_note_g4")
    asm.word(NOTE_A4, label="lit_note_a4")
    asm.word(NOTE_C5, label="lit_note_c5")
    asm.word(NOTE_D5, label="lit_note_d5")
    asm.word(NOTE_E5, label="lit_note_e5")
    asm.word(NOTE_G5, label="lit_note_g5")
    asm.word(NOTE_A5, label="lit_note_a5")
    asm.word(NOTE_C6, label="lit_note_c6")
    asm.word(NOTE_D6, label="lit_note_d6")
    asm.word(NOTE_E6, label="lit_note_e6")
    asm.word(NOTE_G6, label="lit_note_g6")
    asm.word(WAVE_WORD_0, label="lit_wave_word_0")
    asm.word(WAVE_WORD_1, label="lit_wave_word_1")
    asm.word(WAVE_WORD_2, label="lit_wave_word_2")
    asm.word(WAVE_WORD_3, label="lit_wave_word_3")

    return asm.assemble()


def build_rom() -> bytes:
    program = build_program()
    rom = bytearray(max(0x200, 0xC0 + len(program)))

    rom[0:4] = u32(0xEA00002E)
    rom[4:0xA0] = NINTENDO_LOGO

    rom[0xA0:0xAC] = b"GOOSCUBEV2  "
    rom[0xAC:0xB0] = b"GV52"
    rom[0xB0:0xB2] = b"01"
    rom[0xB2] = 0x96
    rom[0xBC] = 0x00

    rom[0xC0:0xC0 + len(program)] = program

    checksum = (-(0x19 + sum(rom[0xA0:0xBD])) & 0xFF)
    rom[0xBD] = checksum
    return bytes(rom)


def main() -> None:
    out_path = Path(__file__).with_name("goose_cube_visualizer_055ad7_v2.gba")
    fallback_path = out_path.with_name("goose_cube_visualizer_055ad7_v2.next.gba")
    temp_path = out_path.with_suffix(".tmp")
    temp_path.write_bytes(build_rom())
    try:
        temp_path.replace(out_path)
        if fallback_path.exists():
            fallback_path.unlink()
        print(f"Wrote {out_path}")
    except PermissionError:
        temp_path.replace(fallback_path)
        print(f"Wrote {fallback_path} (primary ROM was locked by another process)")


if __name__ == "__main__":
    main()
