<h1>Инструкция по развертке окружение разработчика, сборке и запуску проекта</h1>

<h3>Как развернуть окружение разработчика на ОС Windows?</h3>

1. Создайте папку в которую скачаете репозиторий проекта: "C:\Repositories\Rutoken-VPN-Community-Edition-Client".
2. Скачайте в нее репозиторий одним из следующих способов:
    - Через любой GIT-клиент склонируйте <a href="https://github.com/AktivCo/Rutoken-VPN-Community-Edition-Client.git">репозиторий</a> в указанную выше локальную папку 
    - Или скачайте <a href="https://github.com/AktivCo/Rutoken-VPN-Community-Edition-Client/archive/refs/heads/pubilc.zip">ZIP-архив</a> и разархивируйте его в папку.
3. Скачайте и установите <a href="https://build.openvpn.net/downloads/releases/openvpn-install-2.4.3-I601.exe">OpenVPN 2.4.3</a>
4. Скачайте и установите <a href="https://www.rutoken.ru/support/download/windows/">драйвера Рутокен</a> для Windows
5. Скачайте и установите <a href="https://www.python.org/downloads/release/python-397/">Python 3.9.7</a>
    - При установке поставьте галочку напротив "Add Python 3.9 to PATH"
    - В конце установки нажмите "Disable path length limit"
6. Скачайте и установите <a href="https://nodejs.org/download/release/v10.13.0/">**Node.js**</a> версии 10.13.0. Вместе с ним установится **npm**.
    - При установке поставьте галочку напротив "Automatically install the necessary tools. Note that this will install Boxstarter and Chocolatey. The script will pop-up in a new window after the installation completes."
    - После установки **Node.js** откроется cmd-окно с автоматической установкой библиотек. Следуйте инструкциям указанным в данном окне для завершения установки.
7. Перезагрузите компьютер после окончания установки **Node.js** и дополнительных пакетов
8. Для успешной сборки проекта Рутокен VPN Клиент CE необходимо поместить требующиеся библиотеки в папку проекта. Для этого зайдите в папку "C:\Program Files\OpenVPN\bin" и скопируйте все ее содержимое в "C:\Repositories\Rutoken-VPN-Community-Edition-Client\app\executables".
9. Скопируйте DLL драйверов Рутокен в папку проекта. Для этого скопируйте файл "C:\Windows\System32\rtPKCS11ECP.dll" в папку "C:\Repositories\Rutoken-VPN-Community-Edition-Client\app\executables".
9. Скопируйте DLL инструментов сборки Visual Studio в папку проекта. Для этого скопируйте файл "C:\Windows\System32\vcruntime140.dll" в папку "C:\Repositories\Rutoken-VPN-Community-Edition-Client\app\executables".

<h3>Как автоматически собрать проект?</h3>

1. Перейдите в директорию проекта и запустите скрипт install.bat
2. Собранный проект будет размещен в подпапке /win/rutokenvpnclientce-win32-x64/

<h3>Как вручную собрать проект?</h3>

1. Запустите cmd
2. Выполните команду для установки пакета **node-gyp**:
```
npm install -g node-gyp
```
3. Перейдите в папку проекта
```
cd C:\Repositories\Rutoken-VPN-Community-Edition-Client
```
4. Установите необходимые пакеты для сборки проекта с помощью **npm**:
```
npm install
```
5. Установите необходимые пакеты для сборки **frontend'а** проекта с помощью **npm**:
```
cd app
npm install
```

6. Соберите пакет **usb-detection**, выполнив команду, учитывая **разрядность** ОС **Windows** для которой, вы хотите осуществить сборку:
```
cd ../
npm run rebuild-usb:x64
```
, где x64 - версия для 64-битной ОС.

x86 - версия для 32-битной ОС.

7. Установите необходимые пакеты для сборки **frontend'а** проекта с помощью **npm**:
```
cd app
npm install
```

8. Соберите **frontend** проекта:
```
npm run webpack:front
```

<h3>Как собрать приложение?</h3>

1. После выполнения шагов по сборке проекта выше, сделайте упаковку проекта, учитывая **разрядность** ОС **Windows** для которой, вы хотите осуществить сборку:
```
npm run pack:win:x64
```
, где x64 - версия для 64-битной ОС.

x86 - версия для 32-битной ОС.

2. Собранный проект будет расположен в подпапке **win** проекта.

<h3>Как запустить проект в режиме разработчика?</h3>

1. После выполнения шагов по сборке проекта необходимо запустить проект:
```
npm run start
```
2. После этого запустится приложение.

<h3>Как отладить приложение? </h3>

1. Для отладки **frontend'а** приложения добавьте в метод **onReady** класса **Main** файла **app\main.js** следующую строку:
```
Main.webContents.openDevTools();
```
2. Для отладки **backend'а**, основанного на библиотеке Electron необходимо выполнить действия из инструкции с официального сайта <a href="https://www.electronjs.org/docs/tutorial/debugging-main-process">Electron</a> 


<h3>Распространенные проблемы</h3>

1. В Рутокен VPN Клиенте CE не видно загруженный конфигурационный файл. Не видно сертификаты.

    - Используемая при сборке библиотека rtPKCS11ECP.dll оказалась не зарегистрированной в ОС Windows. Переустановите <a href="https://www.rutoken.ru/support/download/windows/">драйвера Рутокен</a>.

    - Заново скопируйте библиотеку из "C:\Windows\System32\rtPKCS11ECP.dll" в папку "C:\Repositories\Rutoken-VPN-Community-Edition-Client\app\executables".

    - Конфигурационный файл должен успешно прочитаться и в интерфейс выведутся доступные сертификаты.

2. Ошибки сборки приложения, связанные с node-gyp.

    - Переустановите <a href="https://github.com/nodejs/node-gyp#installation">node-gyp</a> для вашей ОС, учитывая архитектуру.

    - Настройте зависимость от <a href="https://github.com/nodejs/node-gyp#configuring-python-dependency">Python</a>.

    - Если вышеперечисленные шаги не помогли, то заново настройте окружение согласно <a href="https://github.com/Microsoft/nodejs-guidelines/blob/master/windows-environment.md#compiling-native-addon-modules">инструкции</a>.