using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class ConvenioEspecialidades
    {
        public int IdConvenio { get; set; }
        public int IdEspecialidad { get; set; }
        public int ReglaServicioHorasBolsa { get; set; }
        public string Estado { get; set; }
    }
}
