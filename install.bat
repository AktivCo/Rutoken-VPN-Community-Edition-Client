@echo off

echo Checking if folder C:\Repositories\Rutoken-VPN-Community-Edition-Client\ exits...
IF NOT EXIST C:\Repositories\Rutoken-VPN-Community-Edition-Client\ (
  echo ERROR! Folder wasn't found
  pause
  exit /B
)

SET archive-files=app\ assets\ .eslintrc.js .gitattributes .gitignore config.json gulpfile.js package.json webpack.config.js
echo Checking if archive was unzipped...
for %%a in (%archive-files%) do (
  IF NOT EXIST C:\Repositories\Rutoken-VPN-Community-Edition-Client\%%a (
    echo ERROR! Archive file %%a wasn't found. 
    echo Extract archive to C:\Repositories\Rutoken-VPN-Community-Edition-Client folder.
    pause
    exit /B
  )
)

SET openvpn-files=liblzo2-2.dll libpkcs11-helper-1.dll openvpn.exe openvpn-gui.exe openvpnserv.exe vcruntime140.dll
echo Checking OpenVPN files...
for %%a in (%openvpn-files%) do (
  IF NOT EXIST C:\Repositories\Rutoken-VPN-Community-Edition-Client\app\executables\%%a (
    echo ERROR! OpenVPN file %%a wasn't found   
    echo Move files from C:\Program Files\OpenVPN\bin\ to C:\Repositories\Rutoken-VPN-Community-Edition-Client\app\executables\ folder.
    pause
    exit /B
  )
)

SET rutoken-files=rtPKCS11ECP.dll
echo Checking Rutoken files...
for %%a in (%rutoken-files%) do (
  IF NOT EXIST C:\Repositories\Rutoken-VPN-Community-Edition-Client\app\executables\%%a (
    echo ERROR! Rutoken file %%a wasn't found. 
    echo Move C:\Windows\System32\rtPKCS11ECP.dll file to C:\Repositories\Rutoken-VPN-Community-Edition-Client\app\executables\ folder.
    pause
    exit /B
  )
)

SET microsoft-dll=vcruntime140.dll
echo Checking Microsoft dll file...
for %%a in (%microsoft-dll%) do (
  IF NOT EXIST C:\Repositories\Rutoken-VPN-Community-Edition-Client\app\executables\%%a (
    echo ERROR! Microsoft dll file %%a wasn't found. 
    echo Move C:\Windows\System32\vcruntime140.dll file to C:\Repositories\Rutoken-VPN-Community-Edition-Client\app\executables\ folder.
    pause
    exit /B
  )
)

echo All checks passed!
echo Installing nody-gyp package...
call npm install -g node-gyp

cd C:\Repositories\Rutoken-VPN-Community-Edition-Client
echo Installing packages for client...
call npm install
echo Installing packages for frontend...
cd app
call npm install
cd ../
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
SET xCPU=x64)
if "%PROCESSOR_ARCHITECTURE%"=="x86" (
SET xCPU=x86)
echo Building rebuild-usb package...
call npm run rebuild-usb:%xCPU%
echo Building frontend...
call npm run webpack:front
echo Packing...
call npm run pack:win:%xCPU%
echo Almost done...
IF EXIST C:\Repositories\Rutoken-VPN-Community-Edition-Client\win\rutokenvpnclientce-win32-%xCPU%\rutokenvpnclientce.exe (
  echo SUCCESS! Opening folder with rutokenvpnclientce.exe ...
  %SystemRoot%\explorer.exe "C:\Repositories\Rutoken-VPN-Community-Edition-Client\win\rutokenvpnclientce-win32-%xCPU%\"
  pause
) ELSE (
echo\
echo\
echo Something went wrong. There's no rutokenvpnclientce.exe found
pause
)