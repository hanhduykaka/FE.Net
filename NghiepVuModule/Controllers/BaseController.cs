using DotNetNuke.Web.Mvc.Framework.Controllers;
using DotNetNuke.Entities.Tabs;
using DotNetNuke.Entities.Portals;
using Module.Framework.UltimateClient;
using System.Collections.Generic;
using NghiepVuModule.Models;
using Core.Common.Utilities;

namespace NghiepVuModule.Controllers
{
    public class BaseController : DnnController
    {
        protected DBMasterServiceClient DbMasterService;
        protected MotCuaServiceClient MotCuaService;
        protected HoSoServiceClient HoSoService;
        protected NganhYServiceClient NganhYService;
        protected NganhDuocServiceClient NganhDuocService;
        protected readonly List<HoSoPartialModel> LstHoSoPartialModel = new List<HoSoPartialModel>();

        public BaseController()
        {
            TabInfo curTab = PortalController.Instance.GetCurrentPortalSettings().ActiveTab;
            ViewBag.curTabID = curTab.TabID;
            ViewBag.curTabIDParent = curTab.ParentId;
            ViewBag.PathUploadFile = AppSetting.PathFileUpload;
        }

    }
}