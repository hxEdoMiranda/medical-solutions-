using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class ExamenesPreventivos
    {
        public int IdPersona { get; set; }
        public string CodigoExamen { get; set; }
        public string EdadInicial { get; set; }
        public string EdadFinal { get; set; }
        public List<Examenes> examenes { get; set; }
    }


}
