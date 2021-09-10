const fs = require('fs');

/**
 * LogProvider
 */
class LogProvider {
    _path;

    constructor(path) {
        this._path = path;
    }

    init = () => {
        try {
            fs.unlinkSync(this._path);

        } catch (err) {
            console.log('there is no log file');
        }
    }

    log = (text) => {        
        /* eslint-disable quotes */
        fs.appendFileSync(this._path, text + "'\r\n");
    }
}

module.exports = { LogProvider };

