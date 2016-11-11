using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Infrastructure.Interception;
using System.Data.Entity.SqlServer;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Web;

namespace MentorAddInWeb.Data.Context
{
    public class PfeContextConfiguration : DbConfiguration
    {
        public PfeContextConfiguration()
        {
            this.SetExecutionStrategy("System.Data.SqlClient", () => SuspendExecutionStrategy
              ? (IDbExecutionStrategy)new DefaultExecutionStrategy()
              : new SqlAzureExecutionStrategy());
            SetDefaultConnectionFactory(new LocalDbConnectionFactory("mssqllocaldb"));
            AddInterceptor(new PfeContextInterceptor());
        }

        // SQLAzureExecutionStrategy does not work with manually initiated transactions.
        // This allows you to turn off the SQLAzureExecutionStrategy so that you can 
        // manually initiate a transaction.  Typically used by Integration tests
        public static bool SuspendExecutionStrategy
        {
            get
            {
                return (bool?)CallContext.LogicalGetData("SuspendExecutionStrategy") ?? false;
            }
            set
            {
                CallContext.LogicalSetData("SuspendExecutionStrategy", value);
            }
        }
    }
}