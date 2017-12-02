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
    public class TestController : Controller
    {
        // GET: Test
        FabricsEntities db = new FabricsEntities();
        public ActionResult Index()
        {
            var data = from p in db.Product
                       select p;
            return View(data.ToList().Take(10));
        }
        public ActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Create(Product data)
        {
            if (ModelState.IsValid)
            {
                db.Product.Add(data);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(data);
        }
        public ActionResult Edit(int id)
        {
            var item=db.Product.Find(id);
            
            return View(item);
        }
        [HttpPost]
        public ActionResult Edit(int? id ,Product data)
        {
            if (ModelState.IsValid)
            {
                //容易被串改
                //db.Entry(data).State = EntityState.Modified;
                var item = db.Product.Find(id);
                item.InjectFrom(data);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(data);
        }
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Product product = db.Product.Find(id);
            if (product == null)
            {
                return HttpNotFound();
            }
            return View(product);
        }
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int? id)
        {
            Product product = db.Product.Find(id);
            if (product== null)
            {
                return RedirectToAction("Index");
            }
            db.OrderLine.RemoveRange(product.OrderLine.ToList());
            db.Product.Remove(product);
            db.SaveChanges();
            
            return RedirectToAction("Index");
        }
        public ActionResult Details(int id)
        {
            var item = db.Product.Find(id);

            return View(item);
        }

    }
}