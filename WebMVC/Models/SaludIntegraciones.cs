namespace WebMVC.Models
{
    public class SaludIntegraciones
    {

        public int Id { get; set; }
        public int IdAtencion { get; set; }
        public string TipoIntegracion { get; set; }
        public string Identificador { get; set; }
        public string FechaCreacion { get; set; }
        public int IdUsuarioProfecional { get; set; }
        public int IdUsuarioPaciente { get; set; }
        public int IdArchivo { get; set; }
        public string UrlRedirect { get; set; }
        public string Data { get; set; }
        public string Status { get; set; }

        public string fechaNotificacion { get; set; }
        public string estadoNotificacion { get; set; }
        public string motivoCancelacion { get; set; }

    }
}
