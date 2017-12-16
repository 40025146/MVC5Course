using MVC5Course.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MVC5Course.Controllers
{
    public class BaseController : Controller
    {
        protected  ProductRepository repo = RepositoryHelper.GetProductRepository();
        // GET: base
      
        protected override void HandleUnknownAction(string actionName)
        {
            this.Redirect("/").ExecuteResult(this.ControllerContext);
        }

        public ActionResult Create()
        {
            return View();
        }
        public ActionResult Edit(int id)
        {
            var item = repo.Find(id);

            return View(item);
        }
        public ActionResult Details(int id)
        {
            var item = repo.Find(id);

            return View(item);
        }
    }
}