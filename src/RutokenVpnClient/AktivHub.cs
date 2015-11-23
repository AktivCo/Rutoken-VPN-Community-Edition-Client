using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Microsoft.Dnx.Runtime;
using Microsoft.Extensions.PlatformAbstractions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RutokenVpnClient.Domain.Providers;
using RutokenVpnClient.Domain.Interfaces;
using RutokenVpnClient.Domain.Models;
using RutokenVpnClient.ViewModels;

namespace RutokenVpnClient
{
    [HubName("aktivHub")]
    public class AktivHub : Hub
    {

        private readonly IApplicationEnvironment _appEnvironment;
        private readonly OpenVpnProvider _openVpnProvider;
        private readonly IPkcsIdsProvider _pkcsIdsProvider;
        private readonly IOpenVpnEnvironmentChecker  _openVpnEnvironmentChecker;
        private readonly IOpenVpnEnvironmentInstaller _openVpnEnvironmentInstaller;
        private readonly VpnServerConfigModel _vpnServerConfiguration;

        //статические члены для мониторинга состояния
        private static Process _vpnProcess;
        private static bool _isConnectionHasInitiated;
        private static bool _enterPin;
        private static bool _loading;


        //инжектим сервисы
        public AktivHub(
            IApplicationEnvironment appEnvironment,
            OpenVpnProvider openVpnProvider, 
            IPkcsIdsProvider pkcsIdsProvider,
            IOpenVpnEnvironmentChecker openVpnEnvironmentChecker,
            IOpenVpnEnvironmentInstaller openVpnEnvironmentInstaller)
        {
            
            _appEnvironment = appEnvironment;
            _openVpnProvider = openVpnProvider;
            _pkcsIdsProvider = pkcsIdsProvider;
            _openVpnEnvironmentChecker = openVpnEnvironmentChecker;
            _openVpnEnvironmentInstaller = openVpnEnvironmentInstaller;

            var jPath = Path.Combine(_appEnvironment.ApplicationBasePath, "ClientConf", "vpnServerConfig.json");
            _vpnServerConfiguration = JsonConvert.DeserializeObject<VpnServerConfigModel>(File.ReadAllText(jPath));

            Task.Run(() => new Timer(TokenChecker, null, 0, 2000));

        }

        public override Task OnReconnected()
        {
            SendVpnStaus("");
            return base.OnReconnected();
        }
       
        public override Task OnConnected()
        {
            SendVpnStaus("");
            return base.OnConnected();
        }

        public void InstallEnvironment(string x)
        {
            _loading = true;
            SendVpnStaus("");

            var path = Path.Combine(_appEnvironment.ApplicationBasePath, "OvpnPackages");

            if (!Directory.Exists(path))
                Directory.CreateDirectory(Path.Combine(path));

            _openVpnEnvironmentInstaller.InstallOpenVpnPackage(path);
            _openVpnEnvironmentInstaller.InstallRutokenDriversPackage(path);
            _loading = false;
            SendVpnStaus("");
        }

        public void StartVpn(int pkcsId)
        {
            _loading = true;
            SendVpnStaus("");
            ProcessLauncher(pkcsId);
        }

        public void StopVpn(string x)
        {
            _loading = true;
            SendVpnStaus("");
            _vpnProcess.Kill();
            _openVpnProvider.StopAllVpnProcesses();
            _isConnectionHasInitiated = false;
            _loading = false;
            SendVpnStaus("");
        }
        

        public void SendPin(string pin)
        {
            //_pin = pin;
            _loading = true;
            SendVpnStaus("");
            _vpnProcess.StandardInput.WriteLine(pin);
            //_enterPin = false;
            //
        }

        
        private void SendVpnStaus(string x)
        {
            Clients.All.vpnStatus(GetConnectionStatus());
        }
        
        private void ProcessOutputDataHandler(object sendingProcess, DataReceivedEventArgs outLine)
        {
            Clients.All.succesOut(outLine.Data);
            if (!(string.IsNullOrEmpty(outLine.Data) || string.IsNullOrWhiteSpace(outLine.Data)))
            {
                
                if (outLine.Data.Contains("Peer Connection Initiated"))
                {
                    _enterPin = false;
                    _loading = true;
                    SendVpnStaus("");
                }

                if (outLine.Data.Contains("Initialization Sequence Completed"))
                {
                    _isConnectionHasInitiated = true;
                    _loading = false;
                    SendVpnStaus("");
                }

                if (outLine.Data.Contains("CKR_PIN_LOCKED") || outLine.Data.Contains("CKR_PIN_INCORRECT") || outLine.Data.Contains("SIGUSR1"))
                {
                    _vpnProcess.Kill();
                    _openVpnProvider.StopAllVpnProcesses();
                    _isConnectionHasInitiated = false;
                    _enterPin = false;
                    _loading = false;

                    if (outLine.Data.Contains("CKR_PIN_LOCKED"))
                    {
                        Clients.All.errorOut("Произошла ошибка: Токен заблокирован");
                    }
                    if (outLine.Data.Contains("CKR_PIN_INCORRECT"))
                    {
                        Clients.All.errorOut("Произошла ошибка: Аутентификация");
                    }
                    if (outLine.Data.Contains("SIGUSR1"))
                    {
                        Clients.All.errorOut("Произошла ошибка: Соединение было разорвано");
                    }
                    SendVpnStaus("");
                }
                
            }
        }

        private void ProcessErrorDataHandler(object sendingProcess, DataReceivedEventArgs outLine)
        {
            Clients.All.succesOut(outLine.Data);

            if (!(string.IsNullOrEmpty(outLine.Data) || string.IsNullOrWhiteSpace(outLine.Data)))
            {
                if (outLine.Data.Contains("Password"))
                {
                    _enterPin = true;
                    _loading = false;
                    SendVpnStaus("");
                }
            }


        }
        
        private void ProcessLauncher(int id)
        {
            var path = Path.Combine(_appEnvironment.ApplicationBasePath, "ClientConf", "clientVpn.ovpn");
            
            
            _openVpnProvider.GenerateOvpnConfig(path, _pkcsIdsProvider.GetPkcsIdsModels()[id].PkcsId, _pkcsIdsProvider.RutokenDriversPath, _vpnServerConfiguration);
            

            _vpnProcess = new Process();
            _vpnProcess.StartInfo.UseShellExecute = false;
            _vpnProcess.StartInfo.RedirectStandardOutput = true;
            _vpnProcess.StartInfo.RedirectStandardError = true;
            _vpnProcess.StartInfo.WorkingDirectory = _appEnvironment.ApplicationBasePath;
            _vpnProcess.StartInfo.FileName = "openvpn";
            _vpnProcess.StartInfo.Arguments = string.Format("--config \"{0}\"", path);
            // Redirects the standard input so that commands can be sent to the shell.
            _vpnProcess.StartInfo.RedirectStandardInput = true;
            // Runs the specified command and exits the shell immediately.
            _vpnProcess.OutputDataReceived += ProcessOutputDataHandler;
            _vpnProcess.ErrorDataReceived += ProcessErrorDataHandler;

            _vpnProcess.Start();
            //_hitCount = _vpnProcess.Id;
            _vpnProcess.StandardInput.Write("str");
            _vpnProcess.BeginOutputReadLine();
            _vpnProcess.BeginErrorReadLine();
            
            _vpnProcess.WaitForExit();
            // Send a directory command and an exit command to the shell

        }

        private ConnectionStatusModel GetConnectionStatus()
        {
            var model = new ConnectionStatusModel
            {
                IsEnvReady = _openVpnEnvironmentChecker.IsOpenVpnInstalled() && _openVpnEnvironmentChecker.IsRutokenDriversInstalled() && _openVpnEnvironmentChecker.IsTapDriversInstalled(),
                IsConnectionHasInitiated = _isConnectionHasInitiated,
                EnterPin = _enterPin,
                Loading = _loading,
                PkcsIds = _openVpnEnvironmentChecker.IsOpenVpnInstalled() ? _pkcsIdsProvider.GetPkcsIdsModels() : null,
                VpnServerConfiguration = _vpnServerConfiguration
            };
            return model;
        }

        private void TokenChecker(object cancelToken)
        {
            var jPath = Path.Combine(_appEnvironment.ApplicationBasePath, "project.json");
            if (!File.Exists(jPath))
            {
                if(_vpnProcess != null && !_vpnProcess.HasExited)
                    _vpnProcess.Kill();
                _openVpnProvider.StopAllVpnProcesses();
                _isConnectionHasInitiated = false;
                _enterPin = false;
                _loading = false;

                Clients.All.errorOut("Произошла ошибка: Токен недоступен");
                
                SendVpnStaus("");
            }
        }
    }

   
}
