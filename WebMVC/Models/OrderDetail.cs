namespace WebMVC.Models
{
    public class OrderDetail
    {
        /// <summary>
        /// 
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int Order_header_id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int Sale_period { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int Line_sequence { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int Product_id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string External_product_id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int Order_product_status_id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int Category { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int Total_items { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public double Total_amount { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public double Discount_amount { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public double Tax_amount { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public double Final_amount { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public double Total_cost { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public double Total_margin { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public bool Has_warranty { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int Unit_product_price { get; set; }

    }
}
