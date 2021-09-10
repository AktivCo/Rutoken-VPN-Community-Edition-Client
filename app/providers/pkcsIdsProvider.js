const child_process = require('child_process');


let spawn = child_process.spawn;
let jsesc = require('jsesc');

/**
 * PkcsIdsProvider
 */
class PkcsIdsProvider {

    _resources;

    constructor(resources) {
        this._resources = resources;
    }

    _months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];

    formatDate = (date) => {
        var yyyy = date.getFullYear();

        var dd = date.getDate();
        let mm = date.getMonth() + 1;

        if (dd < 10) {
            dd = `0${dd}`;
        }
        if (mm < 10) {
            mm = `0${mm}`;
        }
        return `${dd}.${mm}.${yyyy}`;
    };

    formatDateString = (dateString) => {
        var position = 0;

        if (dateString[dateString.length - 1] === 'r') {
            position = 2;
        }

        var isExpiring = false;
        var isDisabled = false;

        var dateStart = new Date(parseInt(dateString.slice(0, dateString.length - position)));
        var dateEnd = new Date(dateStart.getFullYear() + 2, dateStart.getMonth(), dateStart.getDate());

        var todayDate = new Date();
        var certDate = this.formatDate(dateStart) + ' - ' + this.formatDate(dateEnd);
        var dateDiff = Math.round((dateEnd - todayDate) / (1000 * 60 * 60 * 24));

        console.log(dateDiff);

        if (dateDiff <= 30) {
            isExpiring = true;
        }
        if (dateDiff < 1) {
            isExpiring = false;
            isDisabled = true;
        }

        return {
            certDate: certDate,
            isExpiring: isExpiring,
            isDisabled: isDisabled
        }

    }

    getPkcsString = () => {

        var promise = new Promise((resolve) => {
            var out = [];
            var temp = [];
            var proc = spawn(this._resources.openvpnPath, ['--show-pkcs11-ids', this._resources.driverPath]);

            proc.stdout.on('data', (data) => {
                var result = jsesc(data.toString());
                temp.push(result.split('\\n'));
            });

            proc.on('close', () => {
                for (var i = 0, tempLen = temp.length; i < tempLen; i++) {
                    for (var j = 0, itemLen = temp[i].length; j < itemLen; j++) {
                        out.push(temp[i][j]);
                    }
                }
                var t = out.join().split('Certificate');
                t.splice(0, 1);

                resolve(t);
            });

        });

        return promise;
    }

    getPkcsIdsModels = (lines) => {

        var pkcsIdsModel = [];

        for (var i = 0; i < lines.length; i++) {
            var c = lines[i].split(',');

            var serializedId = null;
            var usersDates = null;

            for (var j = 0, len = c.length; j < len; j++) {
                var line = c[j];
                
                if (line.indexOf('Serialized') > -1) {
                    var st = line.split(':');
                    var str = st[1].trim();
                    serializedId = str;
                }
                if (line.indexOf('rutokenVpnClient') > -1) {
                    var start = line.indexOf('CN=') + 3;
                    var tmpString = line.substring(start, line.length);

                    var split = tmpString.split('_');
                    usersDates = [split.slice(0, -2).join('_')].concat(split.slice(-2));
                

                }
            }

            if (serializedId != null && usersDates != null) {
                var certDates = this.formatDateString(usersDates[1]);

                pkcsIdsModel.push({
                    userName: decodeURIComponent(JSON.parse('"' + usersDates[0].replace(/"/g, '\\"') + '"')),
                    certDate: certDates.certDate,
                    isExpiring: certDates.isExpiring,
                    isDisabled: certDates.isDisabled,
                    pkcsId: '\'' + serializedId + '\'',
                    selected: false
                });
            }

        }

        return pkcsIdsModel;

    }

    GetPkcsIdsModels = () => {
        var promise = new Promise((resolve) => {
            this.getPkcsString()
                .then((data) => resolve(this.getPkcsIdsModels(data)));
        });

        return promise;
    }
}
module.exports = { PkcsIdsProvider };