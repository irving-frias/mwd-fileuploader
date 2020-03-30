using System.Web.Http;
using Umbraco.Web;
using Umbraco.Web.Models;
using Umbraco.Web.WebApi;
using System.ComponentModel.DataAnnotations;
using Umbraco.Core.Services;
using Umbraco.Core;
using Michel.Models;
using System.Collections;
using System.Collections.Generic;
using System;


public class CreateFolderController : UmbracoApiController
{
  [HttpPost]
    public string[] SetFolder(CreateFolderModel model)
    {
        // another way to get POST params in a FormData
        // var file_name = Request.Form["Name"];

        if (ApplicationContext.Current != null)
        {
            var ms = ApplicationContext.Current.Services.MediaService;
            //Use the MediaService to create a new Media object (-1 is Id of root Media object, "Folder" is the MediaType)
            var mediaMap = ms.CreateMedia(model.FolderName, -1, "Folder");
            //Use the MediaService to Save the new Media object
            ms.Save(mediaMap);
        }
        return new string[] { model.FolderName };
    }
}
