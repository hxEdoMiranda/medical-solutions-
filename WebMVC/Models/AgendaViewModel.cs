using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class AgendaViewModel
    {
        public List<Especialidades> especialidades { get; set; }
        public List<VwHorasMedicosBloquesHoras> BloquesHoras { get; set; }
        public List<VwHorasMedicos> vwHorasMedicos { get; set; }
        public VwHorasMedicos horasMedicos { get; set; }
        public PersonasViewModel fichaPaciente { get; set; }
        public String idCliente { get; set; }
    }
}
