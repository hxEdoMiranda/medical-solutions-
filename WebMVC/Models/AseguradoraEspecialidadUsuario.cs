using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class AseguradoraEspecialidadUsuario
    {
        public int IdCliente { get; set; }
        public string Identificador { get; set; }
        public int IdPersona { get; set; }
        public decimal? Valor { get; set; }
        public int? CantCargas { get; set; }
        public List<string> Especialidades { get; set; }


    }

}
