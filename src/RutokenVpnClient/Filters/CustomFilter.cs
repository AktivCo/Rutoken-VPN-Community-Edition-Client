using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc.Filters;

namespace RutokenVpnClient.Filters
{
    public class CustomFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            var process = Process.GetCurrentProcess();
            process.Kill();
        }
    }
}
