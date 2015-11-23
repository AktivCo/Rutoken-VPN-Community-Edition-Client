using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Win32;
using RutokenVpnClient.Domain.Interfaces;

namespace RutokenVpnClient.Domain.Providers
{
    public class WndOpenVpnEnvironmentChecker : IOpenVpnEnvironmentChecker
    {

        private const string RegistryKey = @"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall";


        public bool IsOpenVpnInstalled()
        {
            var result = GetInstalledApp("OpenVPN");
            return result;
        }
        
        public bool IsRutokenDriversInstalled()
        {
            var result = GetInstalledApp("Драйверы Рутокен");
            return result;
        }
        public bool IsTapDriversInstalled()
        {
            var result = GetInstalledApp("TAP-");
            return result;
        }


        public bool GetInstalledApp(string applicationName)
        {
            return GetInstalledPrograms().Any(c => c.Contains(applicationName));
        }
        
        private List<string> GetInstalledPrograms()
        {
            var result = new List<string>();
            result.AddRange(GetInstalledProgramsFromRegistry(RegistryView.Registry32));
            result.AddRange(GetInstalledProgramsFromRegistry(RegistryView.Registry64));
            return result;
        }

        private IEnumerable<string> GetInstalledProgramsFromRegistry(RegistryView registryView)
        {
            var result = new List<string>();

            using (RegistryKey key = Microsoft.Win32.RegistryKey.OpenBaseKey(RegistryHive.LocalMachine, registryView).OpenSubKey(RegistryKey))
            {
                foreach (string subkey_name in key.GetSubKeyNames())
                {
                    using (RegistryKey subkey = key.OpenSubKey(subkey_name))
                    {
                        if (IsProgramVisible(subkey))
                        {
                            result.Add((string)subkey.GetValue("DisplayName"));
                        }
                    }
                }
            }

            return result;
        }

        private bool IsProgramVisible(RegistryKey subkey)
        {
            var name = (string)subkey.GetValue("DisplayName");
            var releaseType = (string)subkey.GetValue("ReleaseType");
            //var unistallString = (string)subkey.GetValue("UninstallString");
            var systemComponent = subkey.GetValue("SystemComponent");
            var parentName = (string)subkey.GetValue("ParentDisplayName");

            return
                !String.IsNullOrEmpty(name)
                && String.IsNullOrEmpty(releaseType)
                && String.IsNullOrEmpty(parentName)
                && (systemComponent == null);


        }

        public void SaveToFile(string path)
        {
            var apps = GetInstalledPrograms();
            using (StreamWriter w = File.AppendText(path))
            {
                apps.ForEach(c => w.WriteLine(c));
            }
        }


    }
}
