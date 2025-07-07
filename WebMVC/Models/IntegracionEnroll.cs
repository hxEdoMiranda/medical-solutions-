using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class IntegracionEnroll
    {
        public string Status { get; set; }
        public string Convenio { get; set; }
        public string Activo { get; set; }
        public string Origen { get; set; }
        public int IdUsuario { get; set; }
        public string Username { get; set; }
        public string Host { get; set; }
    }

    public class UsuarioEmpresas
    { 
        public int IdEmpresasUsuario { get; set; }
        public string Identificador { get; set; }   
    }

}
