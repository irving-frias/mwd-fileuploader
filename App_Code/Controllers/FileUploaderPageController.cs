using System.Web.Mvc;
using Michel.Models;
using Umbraco.Web.Models;
using Umbraco.Web.Mvc;

namespace Michel.Controllers
{
    public class FileUploaderPageController : RenderMvcController
    {

        public ActionResult Index(RenderModel model, int page = 1)
        {
            var customModel = new FileUploaderModel(model.Content);
            return CurrentTemplate(customModel);
        }
    }
}