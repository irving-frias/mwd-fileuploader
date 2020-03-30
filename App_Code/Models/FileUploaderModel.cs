using System.Collections.Generic;
using Umbraco.Core.Models;
using Umbraco.Web;
using Umbraco.Web.Models;
using System.Linq;
using Umbraco.Core;

namespace Michel.Models
{
    public class FileUploaderModel : RenderModel
    {
        public FileUploaderModel(IPublishedContent content) : base(content)
        { }

        public IEnumerable<IPublishedContent> getContentByFolderAndTag(string tag)
        {

            var umbracoHelper = new UmbracoHelper(UmbracoContext.Current);

            if (!string.IsNullOrEmpty(tag))
            {

                var result = umbracoHelper.TagQuery.GetMediaByTag(tag).Where(x => x.ContentType.Alias == "customFile");

                return result ?? new IPublishedContent[0];
            }

            else
            {
                var content = umbracoHelper.TypedMediaAtRoot().Where(x => x.ContentType.Alias == "Folder");
                List<IPublishedContent> pc = new List<IPublishedContent>();

                foreach (var item in content)
                {
                    foreach (var child in item.Children)
                    {
                        pc.Add(child);
                    }

                }
                return pc;
            }
        }
    }
}