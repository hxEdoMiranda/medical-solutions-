using System.Collections.Generic;
using System;
namespace WebMVC.Models
{
    public class Pharmacy
    {
        public string pharmacyName { get; set; }
        public string promotionText { get; set; }
        public string imagenPharmacy { get; set; }
        public object linkToBuyOrder { get; set; }
        public string country { get; set; }
        public int priority { get; set; }
        public BuyOrder buyOrder { get; set; }
    }

    public class BuyOrder
    {
        public object customer { get; set; }
        public object billing_address { get; set; }
        public List<Medicine> items { get; set; }
    }
    public class Medicine
    {
        public string productID { get; set; }
        public string productName { get; set; }
        public string price { get; set; }
        public string price_Without_discount { get; set; }
        public string discount_amount { get; set; }
        public int qty { get; set; }
        public int max_sale_qty { get; set; }
    }
    public class FindMedicine
    {

        public bool operationSuccess { get; set; }
        public List<Pharmacy> objectResponse { get; set; }
        public string successMessage { get; set; }
        public string errorMessage { get; set; }
        public DateTime operationDate { get; set; }

    }

}
