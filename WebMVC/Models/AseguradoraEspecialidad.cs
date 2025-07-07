using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class AseguradoraEspecialidad
    {
        public int Id { get; set; }
        public int IdPersona { get; set; }
        public string Identificador { get; set; }
        public string NombreEspecialidad { get; set; }


    }

}
