///статусы:


// 0.	Устройство не найдено или отсутствуют серты
// 1.	Нет конфигурации
// 2.	Выбор пользователя
// 3.	Ввод пароля
// 5.   loading вью загрузки
// 6.   loading вью загрузки после ввода пина
// 7.   установка обновления 
// остановить соединение
// 10.  Остановить соединениe

// статусы ошибок openvpn:
// 11.  Произошла ошибка: Токен заблокирован
// 12.  Произошла ошибка: Неверный PIN-код.
// 13.  Произошла ошибка: Неверный конфигурационный файл.
// 14.  Произошла ошибка: Проверьте настройки времени компьютера.
// 15.  Произошла ошибка: Соединение разорвано.

// обновления обновления

// 21.  Произошла ошибка: Не удалось установить обновление.

const ConnectionStatus = {

    NoDeviceOrNoCertificates : 0,
    NoConfigurationFile : 1,
    CertificatesList : 2,
    EnterPin : 3,
    Loading : 5,
    LoadingAfterPin : 6,
    Update : 7,

    StopConnection : 10,

    ErrorTokenBlocked : 11,
    ErrorPinInvalid : 12,
    ErrorConfigurationFileInvalid : 13,
    ErrorTimeInvalid : 14,
    ErrorConnectionFailed : 15,

    ErrorUpdateFailed : 21
}

module.exports = { ConnectionStatus };    
