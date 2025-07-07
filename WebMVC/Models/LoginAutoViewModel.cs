using System.ComponentModel.DataAnnotations;

namespace WebMVC.Models
{
    public class LoginAutoViewModel
    {
        [Required]
        public string Credencial { get; set; }
        [Required]
        public string Tipo { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Correo { get; set; }
        public string ReturnUrl { get; set; }
    }
}
