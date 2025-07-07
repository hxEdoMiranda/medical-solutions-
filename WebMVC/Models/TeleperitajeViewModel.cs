namespace WebMVC.Models
{

    public class TeleperitajesViewModel
    {
        public TeleperitajeViewModel List { get; set; }

    }
    public class TeleperitajeViewModel
    {
        public string Name { get; set; } = "";
        public string Apellido { get; set; } = "";
        public string Rut { get; set; } = "";
        public string Telefono { get; set; } = "";
        public string Email { get; set; } = "";
        public string RutMedico { get; set; } = "";
        public string FechaCitacion { get; set; } = "";
        public string Hora { get; set; } = "";
        public string IdPaciente { get; set; } = "";
        public string IdBloque { get; set; } = "";
        public string IdMedico { get; set; } = "";
        public string Validacion { get; set; } = "";
        public string Estado { get; set; } = "";
        public string correoPaciente { get; set; } = "";
        public string correoMedico { get; set; } = "";
        public string IdConvenio { get; set; } = "";
        public string ZonaHoraria { get; set; } = "";
    }
}
