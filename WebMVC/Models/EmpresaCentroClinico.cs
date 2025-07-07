using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class EmpresaCentroClinico
    {
        public int UserId { get; set; }
        public int IdPersona { get; set; }
        public int IdCentroClinico { get; set; }
        public int IdEmpresa { get; set; }
        public string CodigoConvenio { get; set; }
        public int idConvenio { get; set; }


    }
}
