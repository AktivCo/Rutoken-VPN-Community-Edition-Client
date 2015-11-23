using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using RutokenVpnClient.Domain.Models;

namespace RutokenVpnClient.Domain.Interfaces
{
    public interface IPkcsIdsProvider
    {
        List<PkcsIdModel> GetPkcsIdsModels();
        string RutokenDriversPath { get; }
       
    }
}