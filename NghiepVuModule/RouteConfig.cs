using DotNetNuke.Web.Mvc.Routing;

namespace NghiepVuModule
{
    public class RouteConfig : IMvcRouteMapper
    {
        public void RegisterRoutes(IMapRoute mapRouteManager)
        {
            mapRouteManager.MapRoute("NghiepVu", "NghiepVu", "{controller}/{action}", new[]
                {"NghiepVuModule.Controllers"});
        }
    }

}