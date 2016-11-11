using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MentorAddInWeb.Data.Context
{
    public partial class PfeContext
    {
        /// <summary>
        /// Seeds the specified context.
        /// </summary>
        /// <param name="context">The context.</param>
        internal virtual void SeedData(PfeContext context)
        {
            var seedTime = DateTime.Now.ToUniversalTime();


        }
    }
}