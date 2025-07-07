using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class Notificacions
    {
        public string Tipo { get; set; }
        public string Mensaje { get; set; }
        public int IdUsuario { get; set; } 
        public string ClaseNotificacion { get; set; }
        public int IdAtencion { get; set; }
        public int TiempoRestante { get; set; }
    }
}
