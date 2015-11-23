using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Http;
using Microsoft.Dnx.Runtime;
using Microsoft.Extensions.PlatformAbstractions;

namespace RutokenVpnClient
{
    public class VpnServerConfigMiddleware
    {
        private RequestDelegate _next;
        private IApplicationEnvironment _env;

        public VpnServerConfigMiddleware(RequestDelegate next, IApplicationEnvironment env)
        {
            _next = next;
            _env = env;
        }

        public async Task Invoke(HttpContext context)
        {
            if (!Directory.Exists(Path.Combine(_env.ApplicationBasePath, "ClientConf")))
                Directory.CreateDirectory(Path.Combine(_env.ApplicationBasePath, "ClientConf"));

            var jPath = Path.Combine(_env.ApplicationBasePath, "ClientConf", "vpnServerConfig.json");
            var loadPath =
                Path.Combine(
                    Path.GetPathRoot(_env.ApplicationBasePath),
                    "config",
                    "vpnServerConfig.json");
            if (!File.Exists(loadPath))
            {
                await context.Response
                    .WriteAsync(
                        string.Format(
                            "Configuration file {0} has not been found . Please, save file to continue",
                            loadPath));

            }
            else
            {
                if (File.Exists(jPath))
                    File.Delete(jPath);
                File.Copy(loadPath, jPath);
                await _next.Invoke(context);
            }
        



        }
    }

}
