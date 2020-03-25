using System.Web.Mvc;
using System.Web.Security;
using Umbraco.Web.Mvc;

/**
* Just for testing
*
*/
namespace Michel.Controllers
{
    public class MembersController : SurfaceController
    {
        [HttpPost]
        public ActionResult HandleLogin(string username, string password)
        {

            if (!Members.Login(username, password))
            {
                TempData["status"] = "Login failed";
            }
            return RedirectToCurrentUmbracoUrl();
        }

        [HttpPost]
        public ActionResult HandleSignOut()
        {   
            if (Members.IsLoggedIn()) {
                
                Members.Logout();

                TempData.Clear();
                Session.Clear();
                FormsAuthentication.SignOut();
                return RedirectToCurrentUmbracoPage();
            }

            return RedirectToCurrentUmbracoUrl();
        }
    }

}