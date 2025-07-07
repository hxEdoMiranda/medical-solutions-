using Dapper.Contrib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using WebMVC.Models;

namespace WebMVC.Models
{
    public class Especialidades
    {
        public int Id { get; set; }
        public string Codigo { get; set; }
        public string Nombre { get; set; }
        public string Estado { get; set; }
        public int MontoTotal { get; set;}
        public int MontoTotalCopago { get; set; }
        public int MontoTotalBonificado { get;set; }
        public int? IdEspecialidad { get; set; }
        public int? IdConvenio { get; set; }
        public int? ReglaServicioHorasBolsa { get; set; }
        public int? PrecioEspecialidad { get; set; }
        public bool? TieneRestriccion { get; set; } = false;
        public DateTime HoraInicio { get; set; }
        public DateTime HoraFin { get; set; }
        public String Mensaje { get; set; } 

    }
}
