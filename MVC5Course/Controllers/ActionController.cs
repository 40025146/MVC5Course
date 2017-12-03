using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MVC5Course.Controllers
{
    public class ActionController : baseController
    {
        // GET: Action
        public ActionResult Index()
        {
            var data = repo.FindAll_TOP10();
            ViewData.Model = data;

            ViewBag.h1_title = "First GG.";
            return View();
        }
        
    }
}