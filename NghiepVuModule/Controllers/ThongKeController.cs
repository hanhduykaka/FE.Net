using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DotNetNuke.Web.Mvc.Framework.Controllers;

namespace NghiepVuModule.Controllers
{
    public class ThongKeController : BaseController
    {
        // GET: ThongKe
        public ActionResult Index()
        {
            return View();
        }
    }
}