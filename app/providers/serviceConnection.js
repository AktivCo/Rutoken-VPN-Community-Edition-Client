
const net = require('net');
const { dialog } = require('electron');


const SERVICE_PORT = 31345;


function serviceConnection(func) {
    const pr = new Promise((resolve, reject) =>{
        let client = net.connect({ port: SERVICE_PORT }, () => {
            func(client);
            resolve();
        });
    
        client.on('error', (err) => {
            console.log(err);

            dialog.showErrorBox(
                'Не удалось установить соединение.', 
                'Необходимая для работы приложения служба RutokenVpnService не запущена или не установлена.\n' +
                'Запустите службу или обратитесь к системному администратору.'
            );

            reject();
        });
    
        client.on('end', () => {
            console.log('disconnected from server');
        });
    });

    return pr;
}

module.exports = { serviceConnection };
