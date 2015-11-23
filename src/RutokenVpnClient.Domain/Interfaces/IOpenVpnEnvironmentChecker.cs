using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RutokenVpnClient.Domain.Interfaces
{
    public interface IOpenVpnEnvironmentChecker
    {
        bool IsOpenVpnInstalled();
        bool IsRutokenDriversInstalled();
        bool IsTapDriversInstalled();
    }
}