using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVC5Course.Models;

namespace MVC5Course.ActionFilter
{
    public class ShareDataAttribute:ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            filterContext.Controller.ViewBag.Message = "Your application description page.";
            
            base.OnActionExecuting(filterContext);
        }
    }
    public class LocalAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
           
            base.OnActionExecuting(filterContext);
        }
        public override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            if (filterContext.RequestContext.HttpContext.Request.IsLocal)
            {
                filterContext.Result = new RedirectResult("/");
            }
            base.OnResultExecuting(filterContext);
        }
        
    }
    public  class AuthAttribute : AuthorizeAttribute
    {
        public override void OnAuthorization(AuthorizationContext filterContext)
        {

            base.OnAuthorization(filterContext);
        }
    }
    public class MyDropdownAttribute: ActionFilterAttribute
    {
        public override void OnResultExecuted(ResultExecutedContext filterContext)
        {
            
            base.OnResultExecuted(filterContext);
        }
        public override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            ProductRepository repo = RepositoryHelper.GetProductRepository();
            var price_list = repo.Get不重複price();
            string selected = "";
            if (filterContext.Controller.ViewBag.Id != null)
            {
                Product item = repo.Find(filterContext.Controller.ViewBag.Id);
                if (item != null)
                {
                    selected = item.Price.ToString();
                }
            }

            filterContext.Controller.ViewBag.Price = new SelectList(price_list, "Value", "Text");
            base.OnResultExecuting(filterContext);
        }
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            
            
            base.OnActionExecuting(filterContext);
        }
    }
}