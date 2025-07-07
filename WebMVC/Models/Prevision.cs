namespace WebMVC.Models
{
    public class Prevision
    {
        public string CodigoPais { get; set; }
        public string Codigo { get; set; }
        public string Entidad { get; set; }
        public string CodigoMovilidad { get; set; }
        public int NIT { get; set; }
        public string Regimen { get; set; }

        public Prevision()
        {
            CodigoPais = string.Empty;
            Codigo = string.Empty;
            Entidad = string.Empty;
            CodigoMovilidad = string.Empty;
            NIT = 0;
            Regimen = string.Empty;
        }
    }
}
