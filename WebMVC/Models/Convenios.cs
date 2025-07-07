using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class Convenios
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public int IdModeloAtencion { get; set; }
        public int IdReglaPago { get; set; }
        public int ValorReglaPago { get; set; }
        public int IdReglaServicio { get; set; }
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaTermino { get; set; }
        public string Estado { get; set; }
        public int IdUsuarioCreacion { get; set; }
        public int IdUsuarioModifica { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaModifica { get; set; }
        public string CodConvenio { get; set; }
        public int TempID { get; set; }
        public string FotoConvenio { get; set; }
        public string ModeloAtencion { get; set; }
        public string Activos { get; set; }
        public string Inactivos { get; set; }
        public bool AtencionDirecta { get; set; }
        public string UrlConvenio { get; set; }
        public string TextoMarca { get; set; }
        public bool Teleperitaje { get; set; }
    }
}
