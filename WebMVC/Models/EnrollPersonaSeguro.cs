using System;

namespace WebMVC.Models
{
    public class EnrollPersonaSeguro 
    {
        public int IdPersonaSeguro { get; set; }
        public int IdPersona { get; set; }
        public int IdUsuario { get; set; }
        public int IdEmpresa { get; set; }
        public DateTime Fecha { get; set; }
        public string UrlContrato { get; set; }
        public string UrlCertificado { get; set; }
        public string Estado { get; set; }

    }
}
