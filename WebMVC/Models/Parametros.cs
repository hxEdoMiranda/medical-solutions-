using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class Parametros
    {
        public int Id { get; set; }
        public string Codigo { get; set; }
        public string Grupo { get; set; }
        public string Detalle { get; set; }
        public int Orden { get; set; }
        public string Util1 { get; set; }
        public string Util2 { get; set; }
        public string Accion { get; set; }
    }
}
