using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class AdminConvenios
    {
        public Convenios convenios { get; set; }
        public ConvenioEspecialidades convenioEspecialidades { get; set; }
        public List<Parametros> modeloAtencion { get; set; }
        public List<Parametros> reglaPago { get; set; }
        public List<Parametros> reglaServicio { get; set; }
        public List<SelectListItem> ObtenerEstado()
        {
            var lista = new List<SelectListItem>();
            lista.Add(new SelectListItem { Text = "Seleccione", Value = "" });
            lista.Add(new SelectListItem { Text = "Activo", Value = "V" });
            lista.Add(new SelectListItem { Text = "Inactivo", Value = "I" });
            return lista;

        }
        public List<SelectListItem> TipoProfesionales()
        {
            var lista = new List<SelectListItem>();
            lista.Add(new SelectListItem { Text = "Todos", Value = "0" });
            lista.Add(new SelectListItem { Text = "Medicina General", Value = "MG" }); //Medicina General
            lista.Add(new SelectListItem { Text = "Especialistas", Value = "E" }); // E = Especialistas
            lista.Add(new SelectListItem { Text = "Otros Profesionales", Value = "OP" }); //OP = Otros Profesionales
            return lista;

        }
    }
}
