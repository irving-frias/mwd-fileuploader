using System;
using System.Collections.Generic;
using System.IO;
using System.Web.Mvc;
using Umbraco.Web.Mvc;

namespace UpdateController
{
    public class UpdateController : SurfaceController
    {
        [HttpPost]
        public ActionResult UpdateFile()
        {
            var tags = Request.Form["Tags"];
            string[] tagsArray = { };
            var file_name = Request.Form["Name"];
            if (tags.Length > 0)
            {
                tagsArray = tags.Split(',');
            }
            var UploadPath = Server.MapPath("~/App_Data/uploads");
            string path = Path.Combine(UploadPath, file_name);

            using (FileStream FS = new FileStream(path, FileMode.Open))
            {
                // merge each file chunk back into one contiguous file stream
                UploadController.UploadController UC = new UploadController.UploadController();
                UC.CreateFile(FS, tagsArray, file_name);
                // Removes file from temp folder.
                System.IO.File.Delete(path);
            }
            return Json(new { success = true, file = file_name });
            //return new HttpResponseMessage(HttpStatusCode.OK) {
            //    Content = new StringContent("File uploaded.")
            //  };
        }
    }
}