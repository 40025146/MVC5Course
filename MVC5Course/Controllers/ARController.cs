using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MVC5Course.Controllers
{
    public class ARController : baseController
    {
        // GET: AR
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult PartialViewTest()
        {
            return PartialView("Index");
        }
        public ActionResult ContentResult()
        {
            //不要用
            return Content("我好帥");
        }
        public ActionResult ContentResult_better()
        {
            return PartialView("JsAlertRedirect", "檢視成功");
        }
        public ActionResult FileResult(string dl)
        {
            if (string.IsNullOrEmpty(dl))
            {
                return File(
                Server.MapPath("~/App_Data/9Pb5JF1.jpg"), "image/jpeg"
                );
            }
            else
            {
                return File(
                Server.MapPath("~/App_Data/9Pb5JF1.jpg"), "image/jpeg", "大熊被閃.jpg"
                );
            }

        }

        public ActionResult JsonTest()
        {
            var data = from p in repo.All()
                       select new
                       {
                           p.ProductName
                       };

            return Json(data.Take(20), JsonRequestBehavior.AllowGet);
        }
        public ActionResult RedirectTest1()
        {

            return RedirectToRoute(new {
                controller="Home",
                action="About",
                id=1
            });
        }
    }
}