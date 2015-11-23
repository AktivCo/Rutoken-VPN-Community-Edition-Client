using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using RutokenVpnClient.Domain.Interfaces;

namespace RutokenVpnClient.Domain.Providers
{
    public class WndOpenVpnEnvironmentInstaller : IOpenVpnEnvironmentInstaller
    {
       

        public void InstallOpenVpnPackage(string folderPath)
        {
            var filePath = Path.Combine(folderPath, "openvpn-install-windows.exe");

            if (!File.Exists(filePath))
            {
                var uri = "https://swupdate.openvpn.org/community/releases/openvpn-install-2.3.8-I601-i686.exe";
                Downloader(uri, filePath);
            }

            Installer(filePath, @"/S /SELECT_OPENVPNGUI=0 /SELECT_SERVICE=0 /SELECT_SHORTCUTS=0");
        }

        public void InstallRutokenDriversPackage(string folderPath)
        {
            
            var filePathx86 = Path.Combine(folderPath, "rutokenDriversx86.msi");
            var filePathx64 = Path.Combine(folderPath, "rutokenDriversx64.msi");
            if (!(File.Exists(filePathx64) || File.Exists(filePathx86)))
            {
                var urix86 = "http://www.rutoken.ru/support/download/get/?fid=4";
                var urix64 = "http://www.rutoken.ru/support/download/get/?fid=5";
                Downloader(urix86, filePathx86);
                Downloader(urix64, filePathx64);
            }
            try
            {
                Installer("msiexec", string.Format("/i \"{0}\" /quiet /q /norestart", filePathx86));
            }
            catch
            {
                Installer("msiexec", string.Format("/i \"{0}\" /quiet /q /norestart", filePathx64));
            }
            

        }

        private void Installer(string executable, string args)
        {

            using (var process = new Process())
            {
                process.StartInfo.UseShellExecute = false;
                process.StartInfo.RedirectStandardOutput = true;
                process.StartInfo.RedirectStandardError = true;
                process.StartInfo.FileName = executable;
                process.StartInfo.Arguments = args;
                // Redirects the standard input so that commands can be sent to the shell.
                // Runs the specified command and exits the shell immediately.

                process.Start();
                process.BeginOutputReadLine();
                // Send a directory command and an exit command to the shell
                process.WaitForExit();
            }

        }

        private async void Downloader(string uri, string filePath)
        {
            using (var client = new HttpClient())
            {
                var stream = client.GetAsync(uri);
                var result = await stream.Result.Content.ReadAsStreamAsync();
                using (FileStream fileStream = File.Create(filePath, (int)result.Length))
                {
                    byte[] bytesInStream = new byte[result.Length];

                    result.Read(bytesInStream, 0, bytesInStream.Length);
                    // Use write method to write to the file specified above
                    fileStream.Write(bytesInStream, 0, bytesInStream.Length);
                }
            }
        }
    }
}
