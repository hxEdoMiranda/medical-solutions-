using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class AdminProfesionales
    {
        public List<Especialidades> especialidades { get; set; }
    }


    public class AgendaProfesionales
    {
        public List<Especialidades> especialidades { get; set; }
        public List<Convenios> convenios { get; set; }
        public List<VwHorasMedicos> agenda { get; set; }
    }
}
