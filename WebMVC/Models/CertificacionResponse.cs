namespace WebMVC.Models
{
    public class CertificacionResponse
    {
        public response response { get; set; }  
    }

    public class response
    {
        public data  data { get; set; } 
    }
    public class data
    {
        public validarResponse ValidarResponse { get; set; }
    }
    public class validarResponse
    {
        public int estado { get; set; }
        public string gloEstado { get; set; }
        public int codigoIsapre { get; set; }
        public string codEstBen { get; set; }
    }
}
