using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RutokenVpnClient.Domain.Interfaces;
using RutokenVpnClient.Domain.Models;
using RutokenVpnClient.Domain.Code;

namespace RutokenVpnClient.Domain.Interfaces
{
    public abstract class PkcsIdsProvider : IPkcsIdsProvider
    {
        public abstract string RutokenDriversPath { get; }
        

        public List<PkcsIdModel> GetPkcsIdsModels()
        {
            List<string> pkcsIDs = new List<string>();
            List<string> userNames = new List<string>();
            List<string> certDates = new List<string>();

            StringBuilder q = GetPkcsString();

            string[] delim = { Environment.NewLine, "\n" }; // "\n" added in case you manually appended a newline
            string[] lines = q.ToString().Split(delim, StringSplitOptions.None);
            foreach (string line in lines)
            {
                if (!(string.IsNullOrEmpty(line) && string.IsNullOrEmpty(line)))
                {
                    if (line.Contains("Serialized"))
                    {
                        var st = line.Split(':');
                        foreach (var c in st)
                            if (!c.Contains("Serialized"))
                                pkcsIDs.Add(string.Format("'{0}'", c.Trim()));
                    }

                    if (line.Contains("CN="))
                    {
                        var str = line;
                        var start = str.IndexOf("CN=", StringComparison.Ordinal) + 3;
                        var tmpString = str.Substring(start, str.Length - start);
                        var st = tmpString.Split('_');
                        userNames.Add(st[0]);
                        certDates.Add(st[1]);
                    }
                }
            }
            return GenerateObj(pkcsIDs, userNames, certDates);
        }

        
        public StringBuilder GetPkcsString()
        {
            using (var process = new Process())
            {

                process.StartInfo.UseShellExecute = false;
                process.StartInfo.RedirectStandardOutput = true;
                process.StartInfo.FileName = "openvpn";
                process.StartInfo.Arguments = string.Format(@"--show-pkcs11-ids {0}", RutokenDriversPath);
                // Redirects the standard input so that commands can be sent to the shell.
                // Runs the specified command and exits the shell immediately.
                //process.StartInfo.Arguments = @"/c ""dir""";
                
                process.Start();
                StringBuilder q = new StringBuilder();
                while (!process.HasExited)
                {
                    q.AppendLine(process.StandardOutput.ReadToEnd());
                }
                
                // Send a directory command and an exit command to the shell
                return q;
            }
        }

        private List<PkcsIdModel> GenerateObj(List<string> pkcsIDs, List<string> userNames, List<string> certDates)
        {

            var list = new List<PkcsIdModel>();
            if(certDates.Count == pkcsIDs.Count && pkcsIDs.Count == userNames.Count)
                for (int i = 0; i < userNames.Count; i++)
                    list.Add(new PkcsIdModel
                    {
                        UserName = userNames[i],
                        CertDate = new Func<string>(() =>
                        {
                            long msSinceEpoch = long.Parse(certDates[i]);
                            return (new DateTime(1970, 1, 1) + new TimeSpan(msSinceEpoch*10000)).ToViewString();

                        }).Invoke(),
                        PkcsId = pkcsIDs[i]
                    });
            return list;
        }
    }
}
