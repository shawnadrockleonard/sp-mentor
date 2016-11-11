using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace MentorAddInWeb.Data.Context
{
    /// <summary>
    /// 
    /// </summary>
    public class PfeContextInitializer : CreateDatabaseIfNotExists<PfeContext>
    {
        /// <summary>
        /// This should check if the db is empty an initialize it
        /// </summary>
        /// <param name="context"></param>
        public override void InitializeDatabase(PfeContext context)
        {
            base.InitializeDatabase(context);
        }

        /// <summary>
        /// Seeds the specified context.
        /// </summary>
        /// <param name="context">The context.</param>
        protected override void Seed(PfeContext context)
        {
            context.SeedData(context);
            base.Seed(context);
        }
    }
}