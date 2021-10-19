Рутокен VPN Клиент Community Edition (далее "Рутокен VPN Клиент CE" или Клиент) представляет собой клиентское решение, предназначенное для подключения к серверу Рутокен VPN CE. Продукт базируется на программном продукте OpenVPN, который реализует технологию VPN для создания зашифрованных каналов.

Использование Рутокен VPN Клиент CE (совместно с Рутокен VPN CE) позволяет достичь следующих целей:
<ul>
<li>	обеспечить защищенное подключение к сети компании;</li>
<li>	внедрить двухфакторную аутентификацию, где в качестве фактора владения используются криптографические токены и смарт-карты Рутокен ЭЦП;</li>
</ul>
Помимо Рутокен VPN Клиент CE также существует версия продукта - <a href="https://www.rutoken.ru/support/download/rutoken-vpn/">Рутокен VPN Клиент</a>, позволяющая взаимодействовать с коммерческой версией сервера <a href="https://www.rutoken.ru/products/all/rutoken-vpn/">Рутокен VPN</a>. Рутокен VPN Клиент CE отличается от версии Рутокен VPN Клиент тем, что:
<ul>
<li>    не предоставляется возможность использования шифрования с использованием криптографических алгоритмов ГОСТ Р 34.10-2012 и ГОСТ Р 34.12-2015;</li>
<li>    нет возможности запускать клиент без наличия прав администратора системы;</li>
<li>    не предоставляется возможность создания установочного файла;</li>
</ul>

********************************************************************************

Клиент предназначен для работы в ОС Windows 10/8.1/8/7. Для работы сервиса требуется:
<ul>
<li>	установленный распространяемый компонент Microsoft Visual C++ 2015 Update 3 RC;</li>
<li>	OpenVPN;</li>
</ul>
При необходимости использовать Рутокен VPN Клиент CE в прочих версиях ОС Windows или других операционных системах, может потребоваться адаптация продукта и/или механизма настройки окружения и установки.

Настройка окружения для сборки и установки Рутокен VPN Клиент CE описана в файле <a href="https://github.com/AktivCo/Rutoken-VPN-Community-Edition-Client/blob/pubilc/INSTALL.md">**INSTALL.md**</a>.


********************************************************************************

Руководство для разработчика вы можете найти в файле "Developer Guide.pdf"

********************************************************************************

Описание и исходный код сервера Рутокен VPN CE вы можете найти по ссылке - https://github.com/AktivCo/Rutoken-VPN-Community-Edition-Server