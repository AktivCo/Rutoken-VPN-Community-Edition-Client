
const fs = require('fs');

/**
 * OpenVpnProvider
 */
class OpenVpnProvider {

    _resources;

    constructor(resources) {
        this._resources = resources;
    }

    CreateVpnConfig = (vpnServerConfigurationModel, pkcsId) => {
        var resources = this._resources;
        var macOsXPushConfig = {
            dns: 'test',
            domain: 'test'
        }
        try {
            fs.unlinkSync(resources.clientConfig);
        } catch (err) {
            console.log('there is no config file');
        }

        for (var i = 0, len = vpnServerConfigurationModel.length; i < len; i++) {
            var str = vpnServerConfigurationModel[i];
            fs.appendFileSync(resources.clientConfig, str + '\r\n');


            // only for macosX
            if (str.includes('dhcp-option DNS')) {
                var dns = str.split(' ');
                macOsXPushConfig.dns = dns[2];

            }
            if (str.includes('dhcp-option DOMAIN')) {
                var domain = str.split(' ');
                macOsXPushConfig.domain = domain[2];
            }

        }

        /* eslint-disable quotes */
        fs.appendFileSync(resources.clientConfig, "pkcs11-providers '" + resources.driverPath.replace(/\\/g, "\\\\") + "'\r\n"); 
        fs.appendFileSync(resources.clientConfig, 'pkcs11-id ' + pkcsId.replace(/\\\\/g, '\\') + '\r\n');


        if (process.platform === 'darwin') {
            try {
                var result = fs.readFileSync(resources.dnsSettingsPath, 'utf8').split("\n");

                //vpndns=test
                //domain=test
                console.log(macOsXPushConfig);

                for (var ii = 0, length = result.length; ii < length; ii++) {
                    if (result[ii].includes('vpndns=')) {
                        result[ii] = 'vpndns=' + macOsXPushConfig.dns;
                    }                        
                    if (result[ii].includes('domain=')) {
                        result[ii] = 'domain=' + macOsXPushConfig.domain;
                    }                        
                }

                var s = result.join('\n');

                fs.writeFile(resources.dnsSettingsPath, s);

                fs.appendFileSync(resources.clientConfig, "up '" + resources.tapUpScriptPath.replace(/ /g, '\\ ') + "'\r\n");
                fs.appendFileSync(resources.clientConfig, "down '" + resources.tapDownScriptPath.replace(/ /g, '\\ ') + "'\r\n");
                fs.appendFileSync(resources.clientConfig, "script-security 2\r\n");

            }
            catch (err) {
                console.log(err);
            }


        }

    }
}

module.exports = { OpenVpnProvider };

