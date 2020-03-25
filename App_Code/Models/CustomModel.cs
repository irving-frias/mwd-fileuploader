using Umbraco.Core.Models;
using Umbraco.Web;
using Umbraco.Web.Models;

/**
* Just for testing
*
*/
namespace Michel.Models
{
    public class CustomModel: RenderModel
    {
        public int tomala = 5;
        public int Page = 0;
        public CustomModel(IPublishedContent content) : base(content)
        { }

        public string HelloWorld() 
        { 
           return "Hello World!";
        }
   }
}