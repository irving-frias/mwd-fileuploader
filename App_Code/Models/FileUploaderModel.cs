using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Umbraco.Core.Models;
using Umbraco.Core.Services;
using Umbraco.Web;
using Umbraco.Web.Models;
using System.Linq;

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

                var result = umbracoHelper.TagQuery.GetMediaByTag(tag).Where(x => x.Parent.Id == 1068);

                return result ?? new IPublishedContent[0];
            }

            else
            {
                return umbracoHelper.TypedMedia(1068).Children;
            }
        }
    }
}