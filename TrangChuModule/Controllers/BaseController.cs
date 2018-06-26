using DotNetNuke.Web.Mvc.Framework.Controllers;
using DotNetNuke.Entities.Tabs;
using DotNetNuke.Entities.Portals;
using Module.Framework.UltimateClient;

namespace TrangChuModule.Controllers
{
    public class BaseController : DnnController
    {
        // GET: TrangChu
        protected DBMasterServiceClient DbMasterService;
        protected MotCuaServiceClient MotCuaService;
        protected NganhYServiceClient NganhYService;
        public BaseController()
        {
            TabInfo curTab = PortalController.Instance.GetCurrentPortalSettings().ActiveTab;
            ViewBag.curTabID = curTab.TabID;
            ViewBag.curTabIDParent = curTab.ParentId;
        }

    }
}