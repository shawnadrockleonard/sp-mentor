using Microsoft.ApplicationInsights.Extensibility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.DataContracts;

namespace MentorAddInWeb.Common.Http
{
    public class TelemetryInitializer : IContextInitializer
    {
        public void Initialize(TelemetryContext context)
        {
            context.InstrumentationKey = ConfigSettings.TelemetryAppKey;
            context.Properties["TelemetryVersion"] = ConfigSettings.TelemetryVersion;
        }
    }
}