namespace RutokenVpnClient.Domain.Interfaces

{
    public interface IOpenVpnEnvironmentInstaller
    {
        /// <summary>
        /// Installation of the openvpn package
        /// </summary>
        /// <param name="folderPath">Path to folder with installer</param>
        void InstallOpenVpnPackage(string folderPath);
        /// <summary>
        /// Installation of the RutokenDriversPackage
        /// </summary>
        /// <param name="folderPath">Path to folder with installer</param>
        void InstallRutokenDriversPackage(string folderPath);
    }
}