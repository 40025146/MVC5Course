namespace MVC5Course.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using DataTypes;
    using ActionFilter;
    [MetadataType(typeof(ProductMetaData))]
    public partial class Product : IValidatableObject
    {
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if(this.Stock <10 && this.Price > 1000)
            {
                yield return new ValidationResult("stock <10 && price>1000 ", new string[]{ "stock","price"});
            }
        }
    }

    public partial class ProductMetaData
    {
        [Required]
        public int ProductId { get; set; }
        
        [StringLength(80,MinimumLength =1, ErrorMessage="欄位長度不得大於 80 個字元")]
        //[身分證字號DataType]
        public string ProductName { get; set; }
        
        public Nullable<decimal> Price { get; set; }
        public Nullable<bool> Active { get; set; }
        public Nullable<decimal> Stock { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
    
        public virtual ICollection<OrderLine> OrderLine { get; set; }
    }
}
