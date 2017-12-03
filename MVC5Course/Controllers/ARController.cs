using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MVC5Course.Controllers
{
    public class ARController : Controller
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
    }
}