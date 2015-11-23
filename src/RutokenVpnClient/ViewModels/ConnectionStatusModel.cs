using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using RutokenVpnClient.Domain.Models;

namespace RutokenVpnClient.ViewModels
{
    
    public class ConnectionStatusModel
    {
        [JsonProperty(PropertyName = "isEnvReady")]
        public bool IsEnvReady { get; set; }
        
        [JsonProperty(PropertyName = "isConnectionHasInitiated")]
        public bool IsConnectionHasInitiated { get; set; }

        [JsonProperty(PropertyName = "enterPin")]
        public bool EnterPin { get; set; }

        [JsonProperty(PropertyName = "loading")]
        public bool Loading { get; set; }
        [JsonProperty(PropertyName = "pkcsIds")]
        public List<PkcsIdModel> PkcsIds { get; set; }

        [JsonProperty(PropertyName = "vpnServerConfiguration")]
        public VpnServerConfigModel VpnServerConfiguration { get; set; }

    }
}
