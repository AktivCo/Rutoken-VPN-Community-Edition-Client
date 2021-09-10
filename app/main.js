const { app, BrowserWindow, Tray, Menu, shell } = require('electron')
const path = require('path')
const fs = require('fs');


const { ConnectionProvider } = require('./providers/connectionProvider');

let usbDetect = require('usb-detection');

const isOpenSource = true;

const resources = {
    driverPath: process.platform === 'darwin' ? path.join(__dirname, 'executables', 'librtpkcs11ecp.dylib') : path.join(__dirname, 'executables', 'rtPKCS11ECP.dll'),
    openvpnPath: path.join(__dirname, 'executables', 'openvpn'),
    clientConfig: process.platform === 'darwin' ? path.join(__dirname, 'clientvpn.ovpn') : path.join(app.getPath('userData'), 'clientvpn.ovpn'),
    vpnServerConfig: process.platform === 'darwin' ? path.join(__dirname, 'vpnserverconfig.json') : path.join(app.getPath('userData'), 'vpnserverconfig.json'),
    logServicePath: path.join(__dirname, 'log.txt'),

    settingsConfig: process.platform === 'darwin' ? path.join(__dirname, 'settingsConfig.json') : path.join(app.getPath('userData'), 'settingsConfig.json'),

    icons: path.join(__dirname, 'public', 'img'),

    tapUpScriptPath: path.join(__dirname, 'updateScripts', 'tap-up.sh'),
    tapDownScriptPath: path.join(__dirname, 'updateScripts', 'tap-down.sh'),
    dnsSettingsPath: path.join(__dirname, 'updateScripts', 'dns-settings'),


    currentDir: process.platform === 'darwin' ? path.dirname(path.dirname(path.dirname(process.execPath))) : path.dirname(process.execPath),
    logPath: process.platform === 'darwin' ? path.join(__dirname, 'log.txt') : path.join(app.getPath('userData'), 'log.txt'),

}

const trayIcons = {
    init: __dirname + (process.platform === 'win' ? '\\tray\\ico\\unactive.ico' : '/tray/png/unactive.png'),
    connecting: __dirname + (process.platform === 'win' ? '\\tray\\ico\\connecting.ico' : '/tray/png/connecting.png'),
    connected: __dirname + (process.platform === 'win' ? '\\tray\\ico\\active.ico' : '/tray/png/active.png'),
    disconnected: __dirname + (process.platform === 'win' ? '\\tray\\ico\\disconnected.ico' : '/tray/png/disconnected.png')
}

class Main {
    static forceQuit;
    static mainWindow;
    static application;
    static BrowserWindow;
    static _connectionProvider;

    static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }

    static onClose(evt) {
        if (Main.mainWindow) {
            evt.preventDefault();
            if (process.platform !== 'darwin') {
                Main.mainWindow.minimize();
                Main.mainWindow.setSkipTaskbar(true);
            } else {
                Main.mainWindow.hide();
                Main.application.dock.hide();
            }
        }
    }
    static onReady() {



        if (Main.mainWindow) {
            Main.mainWindow.setSkipTaskbar(false);
            Main.mainWindow.focus();
            return;
        }


        Main.mainWindow =
            new Main.BrowserWindow({
                height: 630,
                width: 492,
                title: 'RutokenVpnClient',
                webPreferences: {
                    nodeIntegration: true
                },

                resizable: false
            });

        console.log(__dirname)
        Main.mainWindow
            .loadURL('file://' + __dirname + '/index.html');

        Main.mainWindow.setSkipTaskbar(false);



        Main.mainWindow.webContents.on('new-window', (event, url) => {
            event.preventDefault();

            shell.openExternal(url);
        });

        Main.mainWindow.focus();

        Main.mainWindow.setMenu(null);

        if (Main.application.dock) {
            Main.application.dock.show();
        }


        const menuTemplate =
            [
                {
                    label: 'Рутокен VPN CE клиент',
                    click: () => {
                        Main.mainWindow.restore();
                        Main.mainWindow.focus();
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Закрыть',
                    click: Main.quit

                }
            ];

        const contextMenu = Menu.buildFromTemplate(menuTemplate);


        let applicationIcon = new Tray(trayIcons.init);

        applicationIcon.on('double-click', function () {
            Main.mainWindow.restore();
            Main.mainWindow.focus();
        });

        applicationIcon.setToolTip('Рутокен VPN CE клиент');
        applicationIcon.setContextMenu(contextMenu);


        let iconManager =
        {
            setIcon: (iconName) => {
                applicationIcon.setImage(trayIcons[iconName]);
            },
            getIconPath: (iconName) => {
                return trayIcons[iconName];
            }
        }


        Main._connectionProvider = new ConnectionProvider(resources, Main.mainWindow.webContents, iconManager, isOpenSource, Main.quit);
        Main._connectionProvider.start();

        if (Main.application.dock) {
            Main.application.dock.hide();
        }

        Main.mainWindow.on('close', Main.onClose);

    }

    static quit() {

        usbDetect.stopMonitoring();
        Main.mainWindow = null;
        app.quit();
    }

    static beforeQuit(evt) {

        if (!Main.forceQuit && Main._connectionProvider) {
            evt.preventDefault();
            Main._connectionProvider.killer()
                .then(() => {
                    console.log('Success stop');
                    Main.forceQuit = !Main.forceQuit;
                    setTimeout(Main.quit, 200);

                })
                .catch(() => {
                    console.log('Unsuccess startup stop. Message: ');
                    Main.forceQuit = !Main.forceQuit;
                    setTimeout(Main.quit, 200);
                })


        }
    }

    static main(app, browserWindow) {

        Main.BrowserWindow = browserWindow;
        Main.application = app;

        let lock = app.requestSingleInstanceLock();

        app.on('second-instance', () => {
            if (Main.mainWindow) {
                if (Main.mainWindow.isMinimized()) { Main.mainWindow.restore(); }
                Main.mainWindow.focus();
            }
        });

        if (!lock) {
            console.log('closing app cause of the second instance');
            app.quit();
        }

        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('before-quit', Main.beforeQuit);
        Main.application.on('ready', Main.onReady);
    }


}


Main.main(app, BrowserWindow);
