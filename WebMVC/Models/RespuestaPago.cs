using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{

    public class RespuestaPago
    {
        public int IdInterno { get; set; }
        public string transaction_id { get; set; }
        public string status { get; set; }
        public string id { get; set; }
        public string url { get; set; }
        public string verification_key { get; set; }
        public string order { get; set; }
        public string created_at { get; set; }
        public string email { get; set; }
        public string subject { get; set; }
        public Transaction transaction { get; set; }
        public string id_proveedor_pago { get; set; }
        public string id_cliente_sistema { get; set; }
        public string id_mercado_pago { get; set; }
        public string nro_pago { get; set; }
        public string estado { get; set; }
        public string request_base { get; set; }
        public string datetime_response_mercado_pago { get; set; }
        public string response_mercado_pago { get; set; }
        public string updated_at { get; set; }
        public string collection_status { get; set; }
    }

    public class Transaction
    {
        public int IdInterno { get; set; }
        public string id { get; set; }
        public string media { get; set; }
        public string amount { get; set; }
        public string authorization_code { get; set; }
        public string last_4_digits { get; set; }
        public string card_type { get; set; }
        public string additional { get; set; }
        public string currency { get; set; }
    }


    public class RespuestaPagoMedipass
    {
        public string collection_id { get; set; }
        public string collection_status { get; set; }
        public string payment_id { get; set; }
        public string status { get; set; }
        public string nro_pago { get; set; }
        public string estado { get; set; }
        public Response_PagoMedipass response_pago { get; set; }
        public string created_at { get; set; }
        public string updated_at { get; set; }
    }

    public class Response_PagoMedipass
    {
        public string created_at { get; set; }
        public string email { get; set; }
        public string subject { get; set; }
        public TransactionMedipass transaction { get; set; }
        public string status { get; set; }
    }

    public class TransactionMedipass
    {
        public string id { get; set; }
        public string media { get; set; }
        public string amount { get; set; }
        public string authorization_code { get; set; }
        public string last_4_digits { get; set; }
        public string card_type { get; set; }
        public string additional { get; set; }
        public string currency { get; set; }
    }

}




