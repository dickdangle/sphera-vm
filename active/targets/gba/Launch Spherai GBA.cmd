@echo off
setlocal

for %%I in ("%~dp0.") do set "GBA_DIR=%%~fI"
if exist "%GBA_DIR%\spherai_audio_seed.next.gba" (
    for %%I in ("%GBA_DIR%\spherai_audio_seed.next.gba") do set "ROM=%%~fI"
) else (
    for %%I in ("%GBA_DIR%\spherai_audio_seed.gba") do set "ROM=%%~fI"
)
for %%I in ("%GBA_DIR%\..\..\mGBA-0.10.5-win32\mGBA.exe") do set "EMULATOR=%%~fI"

if not exist "%ROM%" (
    echo ROM not found:
    echo %ROM%
    pause
    exit /b 1
)

if not exist "%EMULATOR%" (
    echo mGBA not found:
    echo %EMULATOR%
    pause
    exit /b 1
)

start "" "%EMULATOR%" "%ROM%"
