namespace WebMVC.Models
{
    public class CargaProfesional
    {
        public string Identificador { get; set; }
        public string Nombres { get; set; }
        public string ApellidoPaterno { get; set; } = "";
        public string ApellidoMaterno { get; set; } = "";
        public int Especialidad { get; set; }
        public string Email { get; set; } = "";
        public string Sexo { get; set; } = "";
        public string Telefono { get; set; } = "";
        public string FechaNacimiento { get; set; } = "";
        public string IdentificadorProfesorAsociado { get; set; } = "";
        public string Rol { get; set; } = "";
        public int IdCentroClinico { get; set; }
        public int IdEspecialidad { get; set; }
        public int IdDuracionAtencion { get; set; }
        public int NumeroRegistro { get; set; }
        public string Status { get; set; }
    }
}
