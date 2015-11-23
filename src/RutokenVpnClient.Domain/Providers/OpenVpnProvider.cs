using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using RutokenVpnClient.Domain.Models;

namespace RutokenVpnClient.Domain.Providers
{
    
    public class OpenVpnProvider
    {
        /// <summary>
        /// Сведения о запущенных OpenVpn процессах в системе
        /// </summary>
        /// <returns></returns>
        public bool IsOpenVpnProcessStarted()
        {
            Process[] pname = Process.GetProcessesByName("openvpn");
            if (pname.Length == 0)
                return false;
            return true;
        }

        public void StopAllVpnProcesses()
        {
            if (IsOpenVpnProcessStarted())
            {
                Process.GetProcessesByName("openvpn")
                       .ToList()
                       .ForEach(p =>
                       {
                           if (!p.HasExited)
                               p.Kill();
                       });
            }
                
        }

        /// <summary>
        /// Генерация клиентского конфигурационного файла OpenVpn
        /// </summary>
        /// <param name="path">Путь для генерации файла</param>
        /// <param name="pkcsId">PkcsID в формате OpenVpn</param>
        /// <param name="pkcsProviderPath">Путь до драйвера Pkcs провайдера</param>
        /// <param name="vpnServerConfigurationModel">Конфигурация сервера Vpn</param>
        public void GenerateOvpnConfig(string path, string pkcsId,  string pkcsProviderPath, VpnServerConfigModel vpnServerConfigurationModel)
        {
            if (System.IO.File.Exists(path))
                System.IO.File.Delete(path);
            using (StreamWriter w = File.AppendText(path))
            {
                
                w.WriteLine("client");
                w.WriteLine("dev tun");
                w.WriteLine("proto udp");
                w.WriteLine(string.Format("remote {0} 1194", vpnServerConfigurationModel.Server));
                w.WriteLine("persist-key");
                w.WriteLine("persist-tun");
                w.WriteLine("ping-restart 60");
                w.WriteLine("ping 10");
                w.WriteLine(string.Format("pkcs11-providers {0}", pkcsProviderPath));
                w.WriteLine(string.Format("pkcs11-id {0}", pkcsId));
                w.WriteLine("verb 3");
                w.WriteLine("<ca>");
                //var caLength = ca.Length / 60;
                var ca = vpnServerConfigurationModel.Ca;

                w.WriteLine(ca.Substring(0, 27));
                var caCertSubstring = ca.Substring(27, 780 - 52);
                for (int i = 0, caLength = caCertSubstring.Length; i < caLength; i += 50)
                {
                    if ((i + 50) < caLength)
                        w.WriteLine(caCertSubstring.Substring(i, 50));
                    else
                        w.WriteLine(caCertSubstring.Substring(i));
                }
                w.WriteLine(ca.Substring(ca.Length - 25, 25));
                w.WriteLine("</ca>");
            }
        }

        
    }

    
}
