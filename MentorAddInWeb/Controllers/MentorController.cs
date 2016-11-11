using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MentorAddInWeb.Controllers
{
    public class MentorController : Controller
    {
        // GET: Mentor
        public ActionResult Index()
        {
            var jsLanguage = ConfigurationManager.AppSettings.Get("webpages:scripting");
            if (string.IsNullOrEmpty(jsLanguage))
                jsLanguage = "JQuery";
            
            return View(string.Format("Index{0}", jsLanguage));
        }
    }
}