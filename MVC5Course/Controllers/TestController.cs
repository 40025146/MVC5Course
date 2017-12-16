using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVC5Course.Models;
using System.Data.Entity;
using System.Net;
using Omu.ValueInjecter;
namespace MVC5Course.Controllers
{
    public class TestController : BaseController
    {
        
        public ActionResult Index()
        {
            var data = repo.All();
            return View(data.Take(10));
        }
        
        [HttpPost]
        public ActionResult Create(Product data)
        {
            if (ModelState.IsValid)
            {
                repo.Add(data);
                repo.UnitOfWork.Commit();
                return RedirectToAction("Index");
            }
            return View(data);
        }
        
        [HttpPost]
        public ActionResult Edit(int? id ,Product data)
        {
            if (ModelState.IsValid)
            {
                //容易被串改
                //db.Entry(data).State = EntityState.Modified;
                var item = repo.Find((int)id);

                item.InjectFrom(data);
                item.IsDeleted = false;
                repo.UnitOfWork.Commit();
                TempData["ProductItem"] = item;
                return RedirectToAction("Index");
            }
            return View(data);
        }
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Product product = repo.Find((int)id);
            if (product == null)
            {
                return HttpNotFound();
            }
            repo.Delete(product);
            repo.UnitOfWork.Commit();
            return RedirectToAction("Index");
        }
        
        

        public ActionResult EditList()
        {
            var data = repo.All().ToList().Take(10);
            return View(data);
        }
        [HttpPost]
        public ActionResult EditList(Object data)
        {

            return RedirectToAction("Index");
        }
    }
}