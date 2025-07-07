using Dapper.Contrib.Extensions;

namespace WebMVC.Models
{
    public class FarmaciaExterna
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Logo { get; set; }
        public string Pais { get; set; }
        public string Carrito { get; set; }
    }

    
}
