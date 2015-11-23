using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RutokenVpnClient.Domain.Interfaces;

namespace RutokenVpnClient.Domain.Providers
{
    public class WndPkcsIdsProvider : PkcsIdsProvider
    {
        private const string RUTOKEN_DRIVERS_PATH = @"C:\\Windows\\System32\\rtPKCS11ECP.dll";
        public override string RutokenDriversPath
        {
            get { return RUTOKEN_DRIVERS_PATH; }
        }
    }
}
