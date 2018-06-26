using System;
using System.Web.Mvc;
using DotNetNuke.Entities.Modules;
using DotNetNuke.Common;
using DotNetNuke.Security.Membership;
using DotNetNuke.Entities.Users;
using DotNetNuke.Entities.Tabs;
using DotNetNuke.Entities.Portals;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Text;
using Module.Framework.UltimateClient;
using System.Net;

namespace TrangChuModule.Controllers
{
    public class TrangChuController : BaseController
    {
        // GET: TrangChu
        public ActionResult Index()
        {
          return View();
        }

        public JsonResult GetWorkList()
        {
            using (MotCuaService = new MotCuaServiceClient())
            {
                var userId = User.UserID;
                var data = MotCuaService.MotCua_WorkList_CountByTrangThaiHoSoIDId_UserID(userId);
                if (data.StatusCode == HttpStatusCode.OK)
                {
                    return Json(data.Data, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(null, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetModule(string module)
        {
            if (string.IsNullOrEmpty(module))
                return Json(null, JsonRequestBehavior.AllowGet);
            var mc = new ModuleController();
            var existMods = mc.GetModulesByDefinition(PortalSettings.PortalId, module);
            if (existMods == null)
                return Json(null, JsonRequestBehavior.AllowGet);
            foreach (object obj in existMods)
            {
                if (obj != null)
                {
                    var pi = obj.GetType().GetProperty("ModuleID");
                    if (pi != null)
                    {
                        var moduleId = (int)pi.GetValue(obj, null);
                        var tabidInfo = obj.GetType().GetProperty("TabID");
                        if (tabidInfo != null)
                        {
                            var tabId = (int)tabidInfo.GetValue(obj, null);
                            var tabidstring = Globals.NavigateURL(tabId);
                            return Json(new { ModuleID = moduleId, TabID = tabidstring }, JsonRequestBehavior.AllowGet);
                        }
                    }
                }
            }
            return Json(null, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Login()
        {
            return View();
        }

        public ActionResult DangNhap(string userName, string password)
        {
            var results = "0";
            var KhachHangID = "";
            try
            {
                var loginStatus = UserLoginStatus.LOGIN_FAILURE;
                var objUserInfo = UserController.ValidateUser(PortalSettings.PortalId, userName,
                    password, "DNN", "", PortalSettings.PortalName, Request.UserHostAddress, ref loginStatus);
                if (loginStatus == UserLoginStatus.LOGIN_SUCCESS || loginStatus == UserLoginStatus.LOGIN_SUPERUSER)
                {
                    UserController.UserLogin(PortalSettings.PortalId, objUserInfo, PortalSettings.PortalName, Request.UserHostAddress, true);
                    results = "1";
                }
                return Json(new { results, UserPortal = KhachHangID }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                results = "0";
                return Json(new { results, UserPortal = KhachHangID }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult LoadUserInfo()
        {
            var results = "0";
            var userPortal = "0";
            string displayName = "";
            try
            {
                var userId = User.UserID;
                if (userId > 0)
                {
                    var userInfo = UserController.GetUserById(PortalSettings.PortalId, userId);
                    displayName = userInfo.DisplayName;
                    results = "1";
                    userPortal = userId.ToString();
                }
                return Json(new { results, UserPortal = userPortal, DisplayName = displayName }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                results = "0";
                Console.WriteLine(ex);
                return Json(new { results, UserPortal = userPortal, DisplayName = displayName }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult MenuDesklist(string tabId, string tabIdParent)
        {
            string listPage = string.Empty;
            try
            {
                int portalId = PortalController.Instance.GetCurrentPortalSettings().PortalId;
                var tabs = TabController.GetTabsByParent(-1, portalId);

                int curTabId = -9;
                int curTabIdParent = -9;
                if (!string.IsNullOrEmpty(tabId))
                {
                    curTabId = int.Parse(tabId);
                }
                if (!string.IsNullOrEmpty(tabIdParent))
                {
                    curTabIdParent = int.Parse(tabIdParent);
                }
                listPage = BindMenu(curTabId, curTabIdParent, tabs);

                return Json(new { listPage }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);

                return Json(new { result = listPage }, JsonRequestBehavior.AllowGet);
            }
        }
        public string BindSubMenu(List<TabInfo> subtabs, UserInfo user, int portalId)
        {
            string listPage = "";
            try
            {
                foreach (var i in subtabs)
                {
                    var getPermissionSub = i.TabPermissions.ToList();
                    int checkPermissionSub = 0;
                    foreach (var permissionsub in getPermissionSub)
                    {
                        if (permissionsub.RoleName == "All Users")
                        {
                            checkPermissionSub = 1;
                            break;
                        }
                        if (user != null)
                        {
                            foreach (var role in user.Roles)
                            {
                                if (permissionsub.RoleName == role)
                                {
                                    checkPermissionSub = 1;
                                    break;
                                }
                            }
                        }
                    }
                    if (i.IsVisible && checkPermissionSub == 1)
                    {
                        var subtabs2 = TabController.GetTabsByParent(i.TabID, portalId);
                        if (subtabs2.Count > 0)
                        {
                            listPage = listPage + "<li class='TopMenuChild' id='subTopMenuli_" + i.TabID + "'>" +
                                       "<a id='subTopMenua_" + i.TabID + "' class='subTopMenu_" + i.TabID + "'" +
                                       " TabName='" + ConvertToUnSign(i.TabName) + "' TabID='"
                                       + i.TabID + "'>" + i.TabName + "  ▾</a><ul>";


                            listPage = listPage + BindSubMenu(subtabs2, user, portalId);
                            listPage = listPage + "</ul></li>";
                        }
                        else
                        {
                            listPage = listPage + "<li class='menu_home' id='subTopMenuli_"
                                       + i.TabID + "'><a id='subTopMenua_" + i.TabID +
                                       "' class='subTopMenu_" + i.TabID + "' TabName='"
                                       + ConvertToUnSign(i.TabName) + "' TabID='" +
                                       i.TabID + "' href='" + i.FullUrl + "'>" + i.TabName + "</a></li>";
                        }
                    }
                }
                return listPage;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);

                return "";
            }
        }
        public string BindMenu(int curTabId, int curTabIdParent, List<TabInfo> tabs)
        {
            var listPage = "";
            try
            {
                int portalId = PortalController.Instance.GetCurrentPortalSettings().PortalId;
                var currentUser = UserController.Instance.GetCurrentUserInfo();
                int userId = currentUser.UserID;
                var user = UserController.GetUserById(portalId, userId);

                foreach (var t in tabs)
                {
                    var getPermission = t.TabPermissions.ToList();
                    int checkPermission = 0;
                    foreach (var permission in getPermission)
                    {
                        if (permission.RoleName == "All Users")
                        {
                            checkPermission = 1;
                            break;
                        }
                        if (user != null)
                        {
                            foreach (var role in user.Roles)
                            {
                                if (permission.RoleName == role)
                                {
                                    checkPermission = 1;
                                    break;
                                }
                            }
                        }
                    }
                    if (t.IsVisible && checkPermission == 1 && !t.IsDeleted)
                    {
                        var subtabs = TabController.GetTabsByParent(t.TabID, portalId);
                        if (subtabs.Count > 0)
                        {
                            if (curTabId == t.TabID || curTabIdParent == t.TabID)
                            {
                                listPage = listPage + "<li id='TopMenuli_" + t.TabID + "' class='dropdown active' >" + t.TabName +
                                           "<span class='caret'></span><ul class='dropdown-menu'>";

                            }
                            else
                            {
                                listPage = listPage + "<li id='TopMenuli_" + t.TabID + "' class='dropdown' >" + t.TabName +
                                           "<span class='caret'></span><ul class='dropdown-menu'>";

                            }
                            listPage = listPage + BindSubMenu(subtabs, user, portalId);
                            listPage = listPage + "</ul></li>";
                        }
                        else

                        {
                            if (t.Content == "Home") continue;
                            if (curTabId == t.TabID || curTabIdParent == t.TabID)
                            {
                                listPage = listPage + "<li class='active cursor-pointer' id='TopMenuli_"
                                           + t.TabID + "'>"
                                           + "<a class='nopadding-all' href='" + t.FullUrl + "'> " + t.Content + "  </a>"
                                           + "</li>";
                            }
                            else
                            {
                                listPage = listPage + "<li class='cursor-pointer' id='TopMenuli_"
                                           + t.TabID + "'>"
                                           + "<a class='nopadding-all' href='" + t.FullUrl + "'> " + t.Content + "  </a>"
                                           + "</li>";
                            }
                        }
                    }

                }
                return listPage;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return "";
            }
        }
        public static string ConvertToUnSign(string s)
        {
            try
            {
                Regex regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
                string temp = s.Normalize(NormalizationForm.FormD);
                temp = regex.Replace(temp, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D');
                return temp.Replace(" ", "");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return "";
            }
        }
    }
}