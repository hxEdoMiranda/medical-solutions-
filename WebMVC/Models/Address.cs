namespace WebMVC.Models
{
    public class Address
    {
        public int Id { get; set; }
        public bool Activa { get; set; }
        public string Alias { get; set; } = string.Empty;
        public bool PorDefectoExamenes { get; set; } = false;
        public bool PorDefectoMedicamentos { get; set; } = false;
        public bool PorDefectoPerfil { get; set; } = false;
        public int UserId { get; set; }
        public string Latitud { get; set; } = string.Empty;
        public string Longitud { get; set; } = string.Empty;
        public string CodigoPostal { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
        public string Calle { get; set; } = string.Empty;
        public string Numero { get; set; } = string.Empty;
        public string Block { get; set; } = string.Empty;
        public string Departamento { get; set; } = string.Empty;
        public string Referencia { get; set; } = string.Empty;
        public string IdPais { get; set; } = string.Empty;
        public string CodigoPais { get; set; } = string.Empty;
        public string NombrePais { get; set; } = string.Empty;
        public string IdRegion { get; set; } = string.Empty;
        public string CodigoRegion { get; set; } = string.Empty;
        public string NombreRegion { get; set; } = string.Empty;
        public string IdCiudad { get; set; } = string.Empty;
        public string CodigoCiudad { get; set; } = string.Empty;
        public string NombreCiudad { get; set; } = string.Empty;
        public string FechaCreacion { get; set; } = string.Empty;
    }
}
