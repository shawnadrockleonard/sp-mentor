using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MentorAddInWeb.Data.Context
{
    public class PfeContextException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="PfeContextException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="inner">The inner.</param>
        public PfeContextException(string message, Exception inner)
			: base(message, inner)
		{
        }
    }
}
