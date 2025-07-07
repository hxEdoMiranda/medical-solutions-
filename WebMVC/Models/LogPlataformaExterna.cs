using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class LogPlataformaExterna 
    {
        public int Id { get; set; }

        public string IdSesionPlataformaExterna { get; set; }

        public string JSON { get; set; }
        public string DataEncriptada { get; set; }
        public string Metodo { get; set; }
        public string Origen { get; set; }
        public string Respuesta { get; set; }
        public string RespuestaEncriptada { get; set; }
        public string Error { get; set; }
        public string IdCliente { get; set; }
        public DateTime? FechaRegistro { get; set; }
    }
}
