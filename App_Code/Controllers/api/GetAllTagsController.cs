using System;
using System.Collections;
using System.Web.Http;
using Umbraco.Web;
using Umbraco.Web.WebApi;

public class GetAllTagsController : UmbracoApiController
{

    // Function that obtains all the media tags.
    [HttpGet]
    public IEnumerable GetCurrentTags()
    {

        try
        {
            var umbracoHelper = new UmbracoHelper(UmbracoContext.Current);
            var tags = umbracoHelper.TagQuery.GetAllMediaTags();

            return tags;

        }
        catch (Exception e)
        {

            return new string[] { "Something gone wrong", e.Message };
        }

    }

    // Function that deletes Media with certain tag name. This function is only for emergency, not for normal use.
    [HttpGet]
    public IEnumerable DeleteNo()
    {
        var umbracoHelper = new UmbracoHelper(UmbracoContext.Current);
        var asd = ApplicationContext.Services.MediaService;
        var result = umbracoHelper.TagQuery.GetMediaByTag("Wireframe");

        foreach (var media in result)
        {
            asd.Delete(asd.GetById(media.Id));
        }

        return new string[] { "" };

    }

}
