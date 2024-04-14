@echo off

setlocal EnableExtensions DisableDelayedExpansion

set "DesktopFolder="
for /F "skip=1 tokens=1,2*" %%I in ('%SystemRoot%\System32\reg.exe QUERY "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders" /v Desktop 2^>nul') do if /I "%%I" == "Desktop" if not "%%~K" == "" if "%%J" == "REG_SZ" (set "DesktopFolder=%%~K") else if "%%J" == "REG_EXPAND_SZ" call set "DesktopFolder=%%~K"
if not defined DesktopFolder for /F "skip=1 tokens=1,2*" %%I in ('%SystemRoot%\System32\reg.exe QUERY "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders" /v Desktop 2^>nul') do if /I "%%I" == "Desktop" if not "%%~K" == "" if "%%J" == "REG_SZ" (set "DesktopFolder=%%~K") else if "%%J" == "REG_EXPAND_SZ" call set "DesktopFolder=%%~K"
if not defined DesktopFolder set "DesktopFolder=\"
if "%DesktopFolder:~-1%" == "\" set "DesktopFolder=%DesktopFolder:~0,-1%"
if not defined DesktopFolder set "DesktopFolder=%UserProfile%\Desktop"



copy ".\dist\chat-v2-win32-x64\chat-v2.exe" "%DesktopFolder%"

endlocal