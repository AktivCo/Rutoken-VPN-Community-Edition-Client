using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace RutokenVpnClient.Domain.Models
{
    public class VpnServerConfigModel
    {
        [JsonProperty(PropertyName = "server")]
        public string Server { get; set; }

        [JsonProperty(PropertyName = "ca")]
        public string Ca { get; set; }

        [JsonProperty(PropertyName = "companyName")]
        public string CompanyName { get; set; }
        
    }
}
