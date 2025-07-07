using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class Paciente
    {
        public PersonasViewModel fichaPaciente { get; set; }
        public List<Atenciones> HistorialAtenciones { get; set; }
        public List<Empresa> empresas { get; set; }
    }
}
