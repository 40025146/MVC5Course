using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVC5Course.ActionFilter;
namespace MVC5Course.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Controller = "Home";
            return View();
        }
        [ShareData]
        public ActionResult About()
        {
            return View();
        }
       [Local]
        public ActionResult Contact()
        {
            //ViewBag.Message = "Your contact page.";

            return View();
        }
        public ActionResult RazorView()
        {
          
            return View();
        }

        public ActionResult Metro_Index()
        {
            ViewBag.Controller = "Home";
            return View();
        }
    }
}