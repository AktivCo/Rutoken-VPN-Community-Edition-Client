using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.PlatformAbstractions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RutokenVpnClient.Domain.Interfaces;
using RutokenVpnClient.Domain.Models;
using RutokenVpnClient.Domain.Providers;

namespace RutokenVpnClient.ConsoleApp
{
    public class Program
    {

        private readonly IApplicationEnvironment _appEnvironment;
        private readonly OpenVpnProvider _openVpnProvider;
        private readonly IPkcsIdsProvider _pkcsIdsProvider;
        private readonly IOpenVpnEnvironmentChecker _openVpnEnvironmentProvider;
        private WndOpenVpnEnvironmentInstaller _openVpnInstaller;

        public Program(IApplicationEnvironment appEnvironment)
        {
            _appEnvironment = appEnvironment;
            _openVpnProvider = new OpenVpnProvider();
            _pkcsIdsProvider = new WndPkcsIdsProvider();
            _openVpnEnvironmentProvider = new WndOpenVpnEnvironmentChecker();
            _openVpnInstaller = new WndOpenVpnEnvironmentInstaller();
        }

        public void Main(string [] args)
        {

            //WriteToConsoleOpenVpnProcessinfo();
            _creatorTimer = new Timer(CreatorLoop, null, 0, 10);

        }

      
        private Timer _creatorTimer;
        

        private void CreatorLoop(object state)
        {
            Console.WriteLine("In CreatorLoop...");
            /*
                ... Work here
            */

            // Reenable timer
            Console.WriteLine("Exiting...");

            // now we reset the timer's start time, so it'll fire again
            //   there's no chance of reentrancy, except for actually
            //   exiting the method (and there's no danger even if that
            //   happens because it's safe at this point).
            _creatorTimer.Change(10, 0);
        }




        private void WriteToConsoleOpenVpnProcessinfo()
        {
            Console.WriteLine(_openVpnProvider.IsOpenVpnProcessStarted());
            _pkcsIdsProvider.GetPkcsIdsModels().ForEach(c => Console.WriteLine(c.UserName
                ));

            
            Console.WriteLine(_openVpnProvider.IsOpenVpnProcessStarted());

        }

        private void GenerateConf()
        {
            var path = Path.Combine(_appEnvironment.ApplicationBasePath, "ClientConf", "clientVpn.ovpn");

            var jPath = Path.Combine(_appEnvironment.ApplicationBasePath, "ClientConf", "vpnServerConfiguration.json");

            var vpnServerConfigurationModel =
                    JsonConvert.DeserializeObject<VpnServerConfigModel>(File.ReadAllText(jPath));


            _openVpnProvider.GenerateOvpnConfig(path, _pkcsIdsProvider.GetPkcsIdsModels()[0].PkcsId, _pkcsIdsProvider.RutokenDriversPath, vpnServerConfigurationModel);


        }
    }
}
