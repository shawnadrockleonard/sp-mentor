using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity.Infrastructure.Interception;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace MentorAddInWeb.Data.Context
{
    public class PfeContextInterceptor : IDbCommandInterceptor
    {
        public void NonQueryExecuting(DbCommand command, DbCommandInterceptionContext<int> interceptionContext)
        {
            LogIfNonAsync(command, interceptionContext);
        }

        public void NonQueryExecuted(DbCommand command, DbCommandInterceptionContext<int> interceptionContext)
        {
            LogIfError(command, interceptionContext);
        }

        public void ReaderExecuting(DbCommand command, DbCommandInterceptionContext<DbDataReader> interceptionContext)
        {
            LogIfNonAsync(command, interceptionContext);
        }

        public void ReaderExecuted(DbCommand command, DbCommandInterceptionContext<DbDataReader> interceptionContext)
        {
            LogIfError(command, interceptionContext);
        }

        public void ScalarExecuting(DbCommand command, DbCommandInterceptionContext<object> interceptionContext)
        {
            LogIfNonAsync(command, interceptionContext);
        }

        public void ScalarExecuted(DbCommand command, DbCommandInterceptionContext<object> interceptionContext)
        {
            LogIfError(command, interceptionContext);
        }

        /// <summary>
        /// Will write the parameter names and values to the log file
        /// </summary>
        /// <param name="command"></param>
        [Conditional("DEBUG")]
        [DebuggerStepThrough]
        private void LogParametersIfNonAsync(DbCommand command)
        {
            if (command.Parameters != null)
            {
                var idx = command.Parameters.Count;
                for (var i = 0; i < idx; i++)
                {
                    var prm = command.Parameters[i];
                    Trace.TraceInformation("Parameter:{0} with ParameterValue:{1}", prm.ParameterName, prm.Value);
                }
            }
        }

        private void LogIfNonAsync<TResult>(DbCommand command, DbCommandInterceptionContext<TResult> interceptionContext)
        {
            if (!interceptionContext.IsAsync)
            {
                Trace.TraceInformation("Non-async command used: {0}", command.CommandText);
                LogParametersIfNonAsync(command);
            }
        }

        private void LogIfError<TResult>(DbCommand command, DbCommandInterceptionContext<TResult> interceptionContext)
        {
            if (interceptionContext.Exception != null)
            {
                Trace.TraceInformation("Command {0} failed with exception {1} and Stack:\r\n{2}", command.CommandText,
                    interceptionContext.Exception.Message, interceptionContext.Exception.StackTrace);
                LogParametersIfNonAsync(command);
            }
        }
    }
}

