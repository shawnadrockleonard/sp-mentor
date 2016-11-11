using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Linq;
using System.Web;

namespace MentorAddInWeb.Common
{
    /// <summary>
    /// Easy way to obtain configuration settings
    /// </summary>
    public class ConfigSettings
    {
        internal static NameValueCollection LocalSettings { get; set; }

        /// <summary>
        /// Initialize the appsettings
        /// </summary>
        static ConfigSettings()
        {
            LocalSettings = ConfigurationManager.AppSettings;
        }

        /// <summary>
        /// The Telemetry unique id from the web.config file
        /// </summary>
        public static string TelemetryAppKey
        {
            get
            {
                return TryAndGetKey("ai:TelemetryKey");
            }
        }

        public static string TelemetryVersion
        {
            get
            {
                return TryAndGetKey("ai:TelemetryVersion");
            }
        }

        /// <summary>
        /// Initializes and retrieves the key
        /// </summary>
        /// <param name="keyName"></param>
        /// <returns></returns>
        private static string TryAndGetKey(string keyName)
        {
            if (LocalSettings == null)
                LocalSettings = ConfigurationManager.AppSettings;

            var keyValue = LocalSettings.Get(keyName);

            return keyValue;
        }
    }
}