using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MVC5Course.Models.DataTypes
{
    public class 身分證字號DataTypeAttribute : DataTypeAttribute
    {
        public 身分證字號DataTypeAttribute() : base(DataType.Text)
        {

        }

         public override bool IsValid(object value)
        {
            if (value == null)
            {
                return true;
            }
            string str = (string)value;
            if (str.Contains("will"))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}