using Newtonsoft.Json;

namespace WebMVC.Models
{
    public class PaymentConfiguration
    {
        /// <summary>
        /// 
        /// </summary>
        [JsonProperty("id")]
        public int id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [JsonProperty("payment_type_id")]
        public int Payment_type_id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [JsonProperty("param")]
        public string Param { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [JsonProperty("value")]
        public string Value { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [JsonProperty("status")]
        public bool Status { get; set; }

    }
}
