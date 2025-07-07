using Dapper.Contrib.Extensions;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class CargasPacienteModel
    {
        public CargasPacienteModel cargasPaciente;

        public int uid { get; set; }

        public int AdmiteCargas { get; set; }

        public int IdPersona { get; set; }

        public string NombrePersona { get; set; }

        public int IdEmpresa { get; set; }

        public string NombreEmpresa { get; set; }

        public string UrlPropia { get; set; }

        public string CantCargas { get; set; }

        public List<Empresa> Empresas { get; set; }
       



    }
}
