
const { PkcsIdsProvider } = require('./pkcsIdsProvider');
const { LogProvider } = require('./logProvider');
const { ConfigurationProvider } = require('./configProvider');
const { OpenVpnProvider } = require('./openVpnProvider');
const { ConnectionStatus } = require('./connectionStatus');
const { serviceConnection } = require('./serviceConnection');

const { spawn } = require('child_process');
const { Tail } = require('tail');


const ipc = require('electron').ipcMain;

let usbDetect = require('usb-detection');


let pty = undefined;

try {
    pty = require('child_pty');
} catch (er) {
    pty = undefined;
}

/**
 * ConnectionProvider
 */
class ConnectionProvider {

    _configProvider;
    _logProvider;
    _openVpnProvider;
    _pkcsIdsProvider;

    _resources;

    _status = ConnectionStatus.CertificatesList;

    _tail = null;

    _pkcsIds = null;
    _vpnProc = null;
    _vpnProcService = false;
    _updateModel = null;
    _settingsModel = null;
    _contents = null;
    _appIcon = null;
    _quit = null;


    constructor(resources, contents, appIcon, isOpenSource, quit) {

        this.IS_OPEN_SOURCE = isOpenSource;

        this._resources = resources;
        this._openVpnProvider = new OpenVpnProvider(resources);
        this._configProvider = new ConfigurationProvider(resources);
        this._logProvider = new LogProvider(resources.logPath);
        this._pkcsIdsProvider = new PkcsIdsProvider(resources);

        this._contents = contents;
        this._appIcon = appIcon;
        this._quit = quit;
    }

    start = () => {

        this._logProvider.init();

        ipc.on('connection', (event) => {
            this.getPkcsIds();
            event.returnValue = null;


            this._contents.send('setSettingsModel', this._configProvider.getSettingsConfig());
            usbDetect.startMonitoring();
            usbDetect.on('add', () => setTimeout(() => this.getPkcsIds(), 1000));
            usbDetect.on('change', () => setTimeout(() => this.getPkcsIds(), 1000));

        });



        ipc.on('startVpn', (event, pkcsId, networkModel) => {

            console.log(pkcsId, networkModel);

            this._status = ConnectionStatus.Loading;

            this.sendVpnStatus();
            this.startVpn(pkcsId);

        });

        ipc.on('getCurrentConnectionStatus', () => this.sendVpnStatus());

        ipc.on('stopVpn', () => {
            this._status = ConnectionStatus.Loading;
            this.sendVpnStatus();

            this.killer().then(() => {
                this._appIcon.setIcon('init');

                this.sendVpnStatus();

            });

        });


        ipc.on('sendPin', (event, pin) => {

            this._status = ConnectionStatus.LoadingAfterPin;
            this._appIcon.setIcon('connecting');
            this.sendVpnStatus();

            if (this._vpnProcService) {
                serviceConnection(function (client) {
                    client.write('send:' + pin + '\n');
                })
            }
            else {
                this._vpnProc.stdin.write(pin + '\n');
            }
        });

        ipc.on('startUpdate', () => {

            var args = undefined;
            var prog = undefined;

            this._appIcon.setIcon('init');

            this._status = ConnectionStatus.Update;
            this.sendVpnStatus();

            this._configProvider.downloadUpdate(this._updateModel.downloadInfo)
                .then(data => {
                    if (data === true) {
                        console.log('updating');
                        var options = {
                            detached: true,
                            stdio: ['ignore', 'ignore', 'ignore']
                        }

                        if (process.platform === 'darwin') {
                            prog = '/bin/bash';
                            this._resources.updateFilePath = this._resources.updateFilePath.replace(' ', '*');
                            args = [
                                this._resources.updateScriptPath,
                                this._resources.updateFilePath,
                                this._resources.currentDir
                            ];
                        }
                        else {
                            prog = 'updateScript.bat';
                            args = [this._resources.currentDir];
                            options.cwd = this._resources.updateScriptFolder;

                        }

                        if (args !== undefined && prog !== undefined) {
                            spawn(prog, args, options).unref();

                            console.log('startingUpdate');
                            this._quit();
                        }
                    }
                    else {
                        this._status = ConnectionStatus.ErrorUpdateFailed;
                        this.sendVpnStatus();
                    }
                });



        });

        ipc.on('setStatusToInit', () => {

            this._status = ConnectionStatus.CertificatesList;

            this.killer().then(() => {
                this._appIcon.setIcon('init');
                this.sendVpnStatus();
            });
        });

        ipc.on('saveConfig', (data) => {

            this._status = ConnectionStatus.CertificatesList;

            this._configProvider.saveVpnServerConfig(JSON.stringify(data, null, 4));

            this.killer().then(() => this.sendVpnStatus());


        });
        ipc.on('saveSettings', (data) => {

            this.sendVpnStatus();

            this._configProvider.saveSettingsConfig(JSON.stringify(data, null, 4));
            this._contents.send('setSettingsModel', this._configProvider.getSettingsConfig());

        });


        ipc.on('deleteConfig', () => {

            this._status = ConnectionStatus.NoConfigurationFile;
            this._configProvider.deleteVpnServerConfig();

            this.killer().then(() => {
                this._appIcon.setIcon('init');
                this.sendVpnStatus();
            });
        });

    }

    getPkcsIds = () => {
        console.log('detect')
        this._pkcsIdsProvider.GetPkcsIdsModels()
            .then((data) => {
                console.log('trying get pkcs');

                this._pkcsIds = data;

                if (data.length === 0) {
                    if (this._vpnProcService) {
                        this._appIcon.setIcon('init');
                    }
                    this.killer();
                } else {
                    this._pkcsIds[0].selected = true;

                }

                this.sendVpnStatus();


            });
    }

    sendVpnStatus = () => {
        console.log('status', this._status);

        try {
            /* eslint-disable no-empty */
            if (this._status === ConnectionStatus.Update || this._status === ConnectionStatus.ErrorUpdateFailed) {

            }
            else {
                if (this._pkcsIds.length === 0) {
                    this._status = ConnectionStatus.NoConfigurationFile;
                }
                else {
                    /* eslint-disable no-self-assign */
                    this._status === ConnectionStatus.NoConfigurationFile ?
                        this._status = ConnectionStatus.CertificatesList : this._status = this._status;
                }

                if (this._status < 3 && this._configProvider.getVpnServerAddress() === null) {
                    this._status = ConnectionStatus.NoDeviceOrNoCertificates;
                }
            }


            this._contents.send('vpnStatus', {
                status: this._status,
                pkcsIds: this._pkcsIds,
                statusInfo: this.getStatusInfo()

            });

            console.log('status', this._status);


        }
        catch (err) {
            console.log(err);
        }

    }

    getStatusInfo = () => {

        var icons = this._appIcon;
        var statusId = this._status;

        switch (true) {

            case (statusId === ConnectionStatus.LoadingAfterPin):
                return {
                    text: 'попытка соединения',
                    path: icons.getIconPath('connecting'),
                    color: '#F7931E'
                }
            case (statusId === ConnectionStatus.StopConnection):
                return {
                    text: 'соединение установлено',
                    path: icons.getIconPath('connected'),
                    color: '#39B54A'
                }
            case (statusId > 10):
                return {
                    text: 'ошибка',
                    path: icons.getIconPath('disconnected'),
                    color: '#DD2233'
                }
            default:
                return {
                    text: 'ожидание',
                    path: icons.getIconPath('init'),
                    color: '#999999'
                }

        }
    };

    startVpn = (id) => {
        this._status = ConnectionStatus.Loading;

        this.sendVpnStatus();

        this._openVpnProvider.CreateVpnConfig(this._configProvider.getVpnServerConfig(), this._pkcsIds[id].pkcsId);





        // //init openvpn connection 
        if (process.platform !== 'darwin') {
            if(!this.IS_OPEN_SOURCE) {

                const file = this._resources.logServicePath;

                this._tail = new Tail(file);
        
                this._tail.watch();
        
                this._tail.on('line', data => {
                    this.processOutputDataHandler(data);
                });

                serviceConnection((client) => {
                    this._vpnProcService = true;
                    console.log('connected to server!');
    
                    let command = 'start:' + '"' + this._resources.openvpnPath + '"' + ' --config ' + '"' + this._resources.clientConfig + '"' + '\n';
                    client.write(command);
                })
                    .catch(() => {
                        this._tail.unwatch();
                        this._status = ConnectionStatus.CertificatesList;
                        this.sendVpnStatus();
    
                    });
            }
            else {
                this._vpnProc = spawn(this._resources.openvpnPath, ['--config', this._resources.clientConfig]);
                this._vpnProc.stderr.on('data', this.processOutputDataHandler);
                this._vpnProc.stdout.on('data', this.processOutputDataHandler);
            }



        }
        else {
            this._vpnProc = pty.spawn(this._resources.openvpnPath, ['--config', this._resources.clientConfig]);

            this._vpnProc.stdout.on('data', this.processOutputDataHandler);
        }


    }


    processOutputDataHandler = (output) => {

        var data = output.toString().toUpperCase();
        console.log(data);
        this._logProvider.log(data);

        try {
            this._contents.send('succesOut', data);
        }
        catch (err) {
            console.log(err);
        }


        if (data !== '') {
            if (data.includes('PEER CONNECTION INITIATED')) {
                this._status = ConnectionStatus.StopConnection;
                this.sendVpnStatus();
                return;
            }
            if (data.includes('INITIALIZATION SEQUENCE COMPLETED')) {

                this._appIcon.setIcon('connected');

                this._status = ConnectionStatus.StopConnection;

                this.sendVpnStatus();
                return;
            }
            if (data.includes('CKR_PIN_LOCKED') || data.includes('CKR_PIN_INCORRECT') || data.includes('TLS KEY NEGOTIATION FAILED')
                || data.includes('EXITING DUE TO FATAL ERROR') || data.includes('PROCESS EXITING')
                || data.includes('OPTIONS ERROR') || data.includes('WARNING: YOUR CERTIFICATE IS NOT YET VALID!')) {



                if (data.includes('CKR_PIN_LOCKED')) {
                    this._contents.send('errorOut', 'Произошла ошибка: Токен заблокирован.');  //статус : 11  
                    this._status = ConnectionStatus.ErrorTokenBlocked;
                }
                if (data.includes('CKR_PIN_INCORRECT')) {
                    this._contents.send('errorOut', 'Произошла ошибка: Неверный PIN-код.');    //статус : 12
                    this._status = ConnectionStatus.ErrorPinInvalid;
                }
                if (data.includes('OPTIONS ERROR')) {
                    this._contents.send('errorOut', 'Произошла ошибка: Неверный конфигурационный файл.'); //статус : 13
                    this._status = ConnectionStatus.ErrorConfigurationFileInvalid;
                }
                if (data.includes('WARNING: YOUR CERTIFICATE IS NOT YET VALID!')) {
                    this._contents.send('errorOut', 'Произошла ошибка: Проверьте настройки времени компьютера.'); //статус : 14
                    this._status = ConnectionStatus.ErrorTimeInvalid;
                }
                if (data.includes('EXITING DUE TO FATAL ERROR') || data.includes('TLS KEY NEGOTIATION FAILED')) {

                    this._contents.send('errorOut', 'Произошла ошибка: Соединение разорвано.'); //статус : 15
                    this._status = ConnectionStatus.ErrorConnectionFailed;
                }


                this.killer().then(() => {
                    this._appIcon.setIcon('disconnected');
                    this.sendVpnStatus();
                });

                return;
            }

            if (data.includes('PASSWORD')) {

                //force user enter TOKEN pin
                this._status = ConnectionStatus.EnterPin;
                this.sendVpnStatus();

                return;
            }


        }
    }
    killer = () => {

        return new Promise((resolve, reject) => {

            console.log('vpnproc: ' + this._vpnProcService);
            if (this._vpnProcService) {
                serviceConnection(function (client) {
                    client.write('stop' + '\n');

                })
                    .then(() => {
                        this._status = ConnectionStatus.CertificatesList;
                        this._vpnProcService = false;
                        this._tail.unwatch();
                        resolve();
                    })
                    .catch(() => {
                        reject();
                    });

            }
            else if (this._vpnProc != null) {
                console.log('killing openvpn. current status is: ' + this._status);

                this._vpnProc.kill();

                this._vpnProc.on('exit', (code) => {

                    console.log('openvpn process  with code ' + code);
                    if (this._status < 10) {
                        this._status = ConnectionStatus.CertificatesList;
                    }
                    this._vpnProc = null;
                    resolve();

                });

                this._vpnProc.on('error', (code) => console.log('openvpn eroor  with code ' + code));
            }
            else {
                this._status = ConnectionStatus.CertificatesList;
                resolve();
            }

        });

    }

}

module.exports = { ConnectionProvider };
