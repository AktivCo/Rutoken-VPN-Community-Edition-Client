@echo off

echo "%0"
echo "%1"

SET MY_PATH=%1
SET MY_PATH
SET MY_PATH=%MY_PATH:"=%
SET MY_PATH

SET CURRENT_PATH=%0
SET CURRENT_PATH
set CURRENT_PATH=%CURRENT_PATH:updateScript.bat=update.exe%
set CURRENT_PATH


start "" /wait ""%CURRENT_PATH%""  /S /D=%MY_PATH%
start "" "%MY_PATH%\rutokenvpnclient.exe"