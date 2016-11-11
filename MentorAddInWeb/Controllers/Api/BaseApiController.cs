using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace MentorAddInWeb.ApiControllers
{
    public class BaseApiController : ApiController
    {
        /// <summary>
        /// base user name of identified user
        /// </summary>
        internal string LoginIdentity
        {
            get
            {
                var identityName = string.Empty;

                if (this.User != null && this.User.Identity.IsAuthenticated)
                {
                    var fqUserName = this.User.Identity.Name;

                    if (string.Equals(this.User.Identity.AuthenticationType, "Windows"))
                    {
                        var pindex = fqUserName.IndexOf(@"\");
                        if (pindex > 0)
                        {
                            identityName = fqUserName.Substring(pindex + 1);
                        }
                    }
                    else
                    {
                        identityName = fqUserName;
                    }
                }

                return identityName;
            }
        }
    }
}