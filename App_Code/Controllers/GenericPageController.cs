using System.Web.Mvc;
using Michel.Models;
using Umbraco.Web.Models;
using Umbraco.Web.Mvc;

/**
* Just for testing
*
*/
namespace Michel.Controllers
{
    public class GenericPageController : RenderMvcController
    {

        public ActionResult Index(RenderModel model, int page = 1)
        {
            var customModel = new CustomModel(model.Content) { Page = page };
            return CurrentTemplate(customModel);
        }
    }
}