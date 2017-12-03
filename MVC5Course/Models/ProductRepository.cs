using System;
using System.Linq;
using System.Collections.Generic;
	
namespace MVC5Course.Models
{   
	public  class ProductRepository : EFRepository<Product>, IProductRepository
	{
        public override IQueryable<Product> All()
        {
            return base.All().Where(p=> p.IsDeleted==false);
        }
        public override void Delete(Product entity)
        {
            entity.IsDeleted = true;

        }
        public IQueryable<Product> FindAll()
        {
            var data = this.All();
            return data;
        }
        public IQueryable<Product> FindAll_TOP10()
        {
            var data = this.All();
            return data.Take(10);
        }

        public Product Find(int id)
        {
            var data = this.All().FirstOrDefault(p => p.ProductId == id);
            return data;
        }
        

	}

	public  interface IProductRepository : IRepository<Product>
	{
        
	}
}