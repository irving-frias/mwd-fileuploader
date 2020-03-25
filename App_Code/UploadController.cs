using System.Web;
using System.Web.Mvc;
using Umbraco.Web.Mvc;
using Umbraco.Core.Models;
using System.Text;
using System;
using System.IO;

namespace UploadController
{
    public class UploadController : SurfaceController
    {
        [HttpPost]
        [ValidateAntiForgeryToken]
        public void CreateFile(FileStream file, string[] tags, string Name)
        {

            if (ModelState.IsValid)
            {
                StringBuilder fileNames = new StringBuilder();

                //var idOfYourContent = -1;
                fileNames.Append("<ul>");
                var ms = Services.MediaService;

                //You can do something with the files here like save them to disk or upload them into the Umbraco Media section
                fileNames.Append("<li>");
                fileNames.Append(file);
                fileNames.Append("</li>");

                if (file != null && file.Length > 0)
                {
                    // 1086 is the id of the Files folder where the files will be uploaded.
                    var mediaImage = ms.CreateMedia(Name, 1054, "CustomFile");
                    var optionalTagGroup = "default";

                    mediaImage.SetValue("umbracoFile", Name, file);
                    TagCacheStorageType storageType = TagCacheStorageType.Json;

                    file.Close();
                    ms.Save(mediaImage);

                    var mediaId = mediaImage.Id;
                    IMedia content = ms.GetById(mediaId);

                    if (tags.Length > 0)
                    {
                        content.SetTags(storageType, "tags", tags, true, optionalTagGroup);
                    }

                    ms.Save(content);

                }

                fileNames.Append("</ul>");
                TempData["FileNames"] = fileNames.ToString();
            }
        }
    }
}