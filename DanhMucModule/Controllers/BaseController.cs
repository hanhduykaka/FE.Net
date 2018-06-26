using DotNetNuke.Entities.Portals;
using DotNetNuke.Entities.Tabs;
using DotNetNuke.Web.Mvc.Framework.Controllers;

namespace DanhMucModule.Controllers
{
    public class BaseController : DnnController
    {
        // GET: TrangChu
        public BaseController()
        {
            TabInfo curTab = PortalController.Instance.GetCurrentPortalSettings().ActiveTab;
            ViewBag.curTabID = curTab.TabID;
            ViewBag.curTabIDParent = curTab.ParentId;
        }

    }
}