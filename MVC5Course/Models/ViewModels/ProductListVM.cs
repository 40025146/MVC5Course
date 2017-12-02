using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MVC5Course.Models.ViewModels
{
    public class ProductListVM
    {
        public int ProductId { get; set; }
        [Required(ErrorMessage = "請輸入產品名稱")]
        public string ProductName { get; set; }
        [Required(ErrorMessage = "請輸入產品價格")]
        [Range(0, 999, ErrorMessage = "商品金額必須0~999")]
        public Nullable<decimal> Price { get; set; }
    }
}