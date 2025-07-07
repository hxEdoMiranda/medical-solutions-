using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class ExamenesAsistencia
    {
        public int Id { get; set; }
        public int IdCiudad { get; set; }
        public int IdComuna { get; set; }
        public List<Examenes> examenes { get; set; }
        public bool? WowMx { get; set; }
    }


}
