using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Text;
using System.Web;

namespace MentorAddInWeb.Data.Context
{
    public static class PfeContextExtensions
    {
        public static string ErrorDetails(this DbEntityValidationException ex)
        {
            var sb = new StringBuilder();
            foreach (DbEntityValidationResult result in ex.EntityValidationErrors)
            {
                sb.AppendLine(string.Format("An error occurred validating type {0}", result.Entry.Entity.GetType()));
                foreach (DbValidationError error in result.ValidationErrors)
                {
                    sb.AppendLine(string.Format("   {0}:{1}", error.PropertyName, error.ErrorMessage));
                }
            }
            return sb.ToString();
        }
    }
}