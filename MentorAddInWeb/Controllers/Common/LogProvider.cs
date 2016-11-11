using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace MentorAddInWeb.Common
{
    public static class LogProvider
    {
        public static void LogInformation(string fmt, params object[] args)
        {
            Trace.TraceInformation(fmt, args);
        }

        public static void LogWarning(string fmt, params object[] args)
        {
            Trace.TraceWarning(fmt, args);
        }

        public static void LogError(Exception ex, string fmt, params object[] args)
        {
            var msg = string.Format("Exception: {0}", ex.Message);
            Trace.TraceError(msg);
            Trace.TraceError(fmt, args);
        }
    }
}