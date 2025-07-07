using DocumentFormat.OpenXml.Office2010.ExcelAc;
using System.Collections.Generic;

namespace WebMVC.Models
{
    public class ConsultaProductoSekure
    {
        public ProductDetail productDetail { get; set; }
    }
   
    public class ProductDetail
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string PolicyTypeName { get; set; }
        public string InsuranceCompanyName { get; set; }
        public string ProductCover{ get; set; }
       
    }
}
