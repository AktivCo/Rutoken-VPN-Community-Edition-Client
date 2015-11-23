using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Builder;

namespace RutokenVpnClient.Code
{
    public static class BuilderExtensions
    {
        public static IApplicationBuilder UseVpnServerConfigMiddleware(this IApplicationBuilder app)
        {
            return app.UseMiddleware<VpnServerConfigMiddleware>();
        }
        
    }
}
