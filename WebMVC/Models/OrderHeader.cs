using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace WebMVC.Models
{
    public class OrderHeader
    {
        /// <summary>
        /// 
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int? Attention_id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public DateTime Sale_timestamp { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int Sale_period { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int Transaction_type { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int Order_status_id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public bool was_pay_by_promotion { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public double Total_amount { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int delivery_amount { get; set; }

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
        public int Total_margin { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int Total_lines { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int Total_items { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int Customer_delivery_address_id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public List<OrderDetail> Items_details { get; set; }


        /// <summary>
        /// 
        /// </summary>
        public int customer_exam_address_id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string? detail_add_optional { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string? number_facture_farmazone { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [JsonProperty("userId")]
        public int? userId { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [JsonProperty("invoice_id")]
        public int? invoice_id { get; set; }
    }
}
