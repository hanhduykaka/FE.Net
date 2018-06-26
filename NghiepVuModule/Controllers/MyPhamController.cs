using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DotNetNuke.Web.Mvc.Framework.Controllers;

namespace NghiepVuModule.Controllers
{
    public class MyPhamController : BaseController
    {
        // GET: MyPham
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult QuangCaoMyPham()
        {
            return View();
        }
        public ActionResult PhieuCongBoSanPham()
        {
            return View();
        }
        public ActionResult GiayChungNhanLuuHanh()
        {
            return View();
        }
    }
}