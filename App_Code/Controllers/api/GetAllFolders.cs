using System;
using System.Collections;
using System.Web.Http;
using Umbraco.Web;
using Umbraco.Web.WebApi;
using MWD.Models;
using System.Collections.Generic;

public class GetAllFoldersController : UmbracoApiController
{

    [HttpGet]
    public List<GenericContentModel> GetCurrentFolders()
    {
        try
        {
            var umbracoHelper = new UmbracoHelper(UmbracoContext.Current);
            var list = umbracoHelper.TypedMediaAtRoot();
            List<GenericContentModel> folders = new List<GenericContentModel>();
            foreach (var item in list)
            {
                GenericContentModel model = new GenericContentModel();
                model.ContentName = item.Name;
                model.ContentId = item.Id;
                folders.Add(model);
            }
            return folders;
        }
        catch (Exception e)
        {
            throw new HttpResponseException(System.Net.HttpStatusCode.InternalServerError);
        }
    }
}
