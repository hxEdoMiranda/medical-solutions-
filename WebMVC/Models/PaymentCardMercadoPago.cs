using System.Collections.Generic;

namespace WebMVC.Models
{
    public class DatosCardMercadopPago
    {
        public List<PaymentCardMercadoPago> tarjetas { get; set; }
        public string email { get; set; }
        public string nombreUser { get; set; }
        public int idUser { get; set; }
        public string identificador { get; set; }
        public string codigotelefono { get; set; }
    }

    public class PaymentCardMercadoPago
    {

        /// <summary>
        /// 
        /// </summary>            
        public int Id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int IdUser { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string CustomerId { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string NumberCard { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string ExpirationDate { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string FranchiseCard { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string CardId { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int payment_type_id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public bool Status { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string textoFranchiseCardNumberCard { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string CreditorDebit { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string CardHolderName { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public bool default_card { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public bool shared_card_load { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string LastFourDigit { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string SegurityCodeLength { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int tarjetaCarga { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int esCarga { get; set; }
    }
}
