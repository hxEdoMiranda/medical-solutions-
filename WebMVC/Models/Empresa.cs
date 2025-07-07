using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class Empresa
    {
        public int Id { get; set; }
        public string Identificador { get; set; }
        public string Nombre { get; set; }
        public string Estado { get; set; }
        public int IdUsuarioCreacion { get; set; }
        public int IdUsuarioModifica { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime FechaModifica { get; set; }
        public int AdmiteCargas { get; set; }
        public int CantCargas { get; set; }
        public int AdmiteCEmergencia { get; set; }
        public int CantCEmergencia { get; set; }
        public int UrlPropia { get; set; }
        public bool HistExterno { get; set; }
    }
}
