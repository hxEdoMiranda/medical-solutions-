using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class PreAtencion
    {
        public int Id { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public string IdSesionPlataforma { get; set; }
        public int IdPaciente { get; set; }
        public bool ApruebaTerminos { get; set; }
    }
}
