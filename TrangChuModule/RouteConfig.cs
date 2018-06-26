using DotNetNuke.Web.Mvc.Routing;

namespace TrangChuModule
{
    public class RouteConfig : IMvcRouteMapper
    {
        public void RegisterRoutes(IMapRoute mapRouteManager)
        {
            mapRouteManager.MapRoute("Home", "Home", "{controller}/{action}", new[]
                {"TrangChuModule.Controllers"});
        }
    }

}