using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.PlatformAbstractions;
using RutokenVpnClient.Code;
using RutokenVpnClient.Domain.Interfaces;
using RutokenVpnClient.Domain.Providers;
using RutokenVpnClient.Filters;

namespace RutokenVpnClient
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddMvc().AddMvcOptions(options =>
            {
                options.Filters.Add(new CustomFilter());
            });


            services.AddSignalR();
            services.AddScoped<OpenVpnProvider>();
            services.AddScoped<IPkcsIdsProvider, WndPkcsIdsProvider>();
            services.AddScoped<IOpenVpnEnvironmentChecker, WndOpenVpnEnvironmentChecker>();
            services.AddScoped<IOpenVpnEnvironmentInstaller, WndOpenVpnEnvironmentInstaller>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IApplicationEnvironment env, IHostingEnvironment hosting)
        {
            app.UseVpnServerConfigMiddleware();
            app.UseDeveloperExceptionPage();
            app.UseMvcWithDefaultRoute();
            app.UseSignalR();
            app.UseStaticFiles();
        }

        // Entry point for the application.
        public static void Main(string[] args) => WebApplication.Run<Startup>(args);
    }

    public class HomeController : Controller 
    {
        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }
    }
}
