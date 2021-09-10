
const fs = require('fs');
const request = require('request');
const https = require('https');

/**
 * ConfigurationProvider
 */
class ConfigurationProvider {

    _resources;

    constructor(resources) {
        this._resources = resources;
    }



    getConfig = (path) => {

        try {
            var result = JSON.parse(fs.readFileSync(path, 'utf8'));
            return result;
        }
        catch (err) {
            return null;
        }
    }

    saveConfig = (path, data) => {
        console.log('saving config');
        fs.writeFileSync(path, data);
    }

    deleteConfig = (path) => {
        fs.unlinkSync(path);
    }

    checkConfigValidity = (config, properties) => {
        if (config === null || config === undefined) {
            return false;
        }
        if (Object.getOwnPropertyNames(config).length === 0) {
            return false;
        }

        ///checking for props names and props length
        for (var i = 0; i < properties.length; i++) {

            /* eslint-disable no-prototype-builtins */
            if (!config.hasOwnProperty(properties[i]) || config[properties[i]].length === 0) {
                return false;
            }
        }

        return true;

    }

    register = (updateServer, productGuid, version) => {
        var promise = new Promise((resolve) => {
            try {

                var url = 'https://' + updateServer + '/api/update/init?pg=' + productGuid + '&version=' + version;

                var agentOptions = {
                    host: updateServer,
                    port: '443',
                    path: '/',
                    rejectUnauthorized: false
                }


                var agent = new https.Agent(agentOptions);


                request({
                    url: url,
                    method: 'GET',
                    agent: agent
                }, (error, response, body) => {
                    console.log(body);
                    if (!error && response.statusCode == 200) {

                        resolve(body)
                    }
                    console.log(error);
                })
            }
            catch (err) {
                resolve(null);
            }

        });

        return promise;

    }

    checkUpdate = (updateServer, productGuid, clientGuid) => {

        var promise = new Promise((resolve) => {

            try {

                var url = 'https://' + updateServer + '/api/update/check/' + productGuid + '/' + clientGuid;

                var agentOptions = {
                    host: updateServer,
                    port: '443',
                    path: '/',
                    rejectUnauthorized: false
                }

                var agent = new https.Agent(agentOptions);

                request({
                    url: url,
                    method: 'GET',
                    agent: agent
                },
                    (error, response, body) => {
                        if (!error && response.statusCode == 200) {
                            resolve(body)
                        }
                        else {
                            resolve(null);
                        }
                    })
            }
            catch (err) {
                resolve(null);
            }

        });

        return promise;

    }

    //public module fields
    downloadUpdate = (downloadInfo) => {

        var promise = new Promise((resolve) => {
            try {
                var agentOptions = {
                    host: downloadInfo.updateServer,
                    port: '443',
                    path: '/',
                    rejectUnauthorized: false
                }

                var agent = new https.Agent(agentOptions);


                request({
                    url: downloadInfo.link,
                    method: 'GET',
                    agent: agent
                })
                    .on('response', (res) => {

                        if (res.statusCode === 200) {

                            var file = fs.createWriteStream(downloadInfo.path);
                            var t = res.pipe(file);

                            t.on('error', () => {
                                resolve(false);
                            });
                            t.on('finish', () => {

                                file.close();
                                setTimeout(() => resolve(true), 1000);

                            });
                        }
                        else {
                            resolve(false);
                        }
                    });
            }
            catch (err) {
                resolve(false);
            }
        });

        return promise;
    }

    getVpnServerConfig = () => {

        return this.getConfig(this._resources.vpnServerConfig);


    }

    getSettingsConfig = () => {

        var result = this.getConfig(this._resources.settingsConfig);
        if (result === null) {
            var model = {
                autoupdate: true
            }
            this.saveConfig(this._resources.settingsConfig, JSON.stringify(model, null, 4));
            result = model;
        }
        return result;


    }

    getVpnServerAddress = () => {

        var config = this.getVpnServerConfig();

        var networkModel = {
            ip: null,
            port: null
        };

        try {
            if (config !== null) {
                for (var i = 0, len = config.length; i < len; i++) {
                    if (config[i].includes('remote ')) {
                        var tmpStr = config[i].split(' ');

                        for (var j = 0, l = tmpStr.length; j < l; j++) {
                            if (/^[A-Za-z0-9.-]{1,30}[^\s.]$/.test(tmpStr[j])) {
                                networkModel.ip = tmpStr[j];
                            }
                        }
                    }
                    if (config[i].includes('port ')) {
                        var str = config[i].split(' ');
                        networkModel.port = str[1];
                    }
                }
            }
        }
        catch (err) {
            console.log(networkModel);
        }

        if (networkModel.ip === null) {
            networkModel = null;
        }
        else
            if (networkModel.port === null) {
                networkModel.port = 1194;
            }

        return networkModel;


    }


    saveVpnServerConfig = (data) => {
        console.log('saving vpn server config');
        this.saveConfig(this._resources.vpnServerConfig, data)
    };

    saveSettingsConfig = (data) => {
        console.log('saving vpn server config');
        this.saveConfig(this._resources.settingsConfig, data)
    };

    deleteVpnServerConfig = () => this.deleteConfig(this._resources.vpnServerConfig);

}

module.exports = { ConfigurationProvider };
