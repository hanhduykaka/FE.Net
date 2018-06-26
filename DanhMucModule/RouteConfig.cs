using DotNetNuke.Web.Mvc.Routing;

namespace DanhMucModule
{
    public class RouteConfig : IMvcRouteMapper
    {
        public void RegisterRoutes(IMapRoute mapRouteManager)
        {
            mapRouteManager.MapRoute("DanhMuc", "DanhMuc", "{controller}/{action}", new[]
                {"DanhMucModule.Controllers"});
        }
    }
}