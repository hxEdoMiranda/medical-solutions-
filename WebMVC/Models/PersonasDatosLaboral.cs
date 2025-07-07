using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class PersonasDatosLaboral
    {
        public int Id_PersonadatosLaboral { get; set; }
        public int IdPersona { get; set; }
        public int IdPersona_Bh { get; set; }
        public int? Experiencia_Laboral { get; set; }
        public int Id_Area { get; set; }
        public int Id_Puesto { get; set; }
        public DateTime Fecha_Ingreso { get; set; }
        public DateTime Fecha_Ingreso_Puesto { get; set; }
        public string Rotacion_Turno { get; set; }
        public string Id_Tipo_Contrato { get; set; }
        public string Id_Tipo_Jornada { get; set; }
        public List<AreasPersonaLaboral> Areas { get; set; } = new List<AreasPersonaLaboral>();
        public List<PuestoPersonaLaboral> Puestos { get; set; } = new List<PuestoPersonaLaboral>();

        public PersonasViewModel PersonaDatosBasicos { get; set; }

        public List<SelectListItem> ObtenerRotacionTurno()
        {
            return new List<SelectListItem>
            {
                new SelectListItem { Text = "Seleccione", Value = "" },
                new SelectListItem { Text = "Si", Value = "Si" },
                new SelectListItem { Text = "No", Value = "No" }
            };
        }

        public List<SelectListItem> ObtenerTipoContrato()
        {
            return new List<SelectListItem>
            {
                new SelectListItem { Text = "Seleccione", Value = "" },
                new SelectListItem { Text = "Obra o tiempo determinado", Value = "Obra o tiempo determinado" },
                new SelectListItem { Text = "Tiempo indeterminado", Value = "Tiempo indeterminado" },
                new SelectListItem { Text = "Periodo de prueba", Value = "Periodo de prueba" },
                new SelectListItem { Text = "Capacitación inicial", Value = "Capacitación inicial" },
                new SelectListItem { Text = "Relación de trabajo por temporada", Value = "Relación de trabajo por temporada" }
            };
        }

        public List<SelectListItem> ObtenerTipoJornada()
        {
            return new List<SelectListItem>
            {
                new SelectListItem { Text = "Seleccione", Value = "" },
                new SelectListItem { Text = "Jornada Diurna", Value = "Jornada Diurna" },
                new SelectListItem { Text = "Jornada Nocturna", Value = "Jornada Nocturna" },
                new SelectListItem { Text = "Jornada Mixta", Value = "Jornada Mixta" }
            };
        }

        public List<SelectListItem> ObtenerAreas()
        {
            var lista = new List<SelectListItem>
            {
                new SelectListItem { Text = "Seleccione", Value = string.Empty }
            };

            foreach (AreasPersonaLaboral area in Areas)
            {
                lista.Add(new SelectListItem
                {
                    Text = area.nombre_area,
                    Value = area.id_area.ToString(),
                    Selected = area.id_area == Id_Area?true:false
                });
            }

            return lista;
        }

        public List<SelectListItem> ObtenerPuestos()
        {
            var lista = new List<SelectListItem>
            {
                new SelectListItem { Text = "Seleccione", Value = string.Empty }
            };

            foreach (PuestoPersonaLaboral puesto in Puestos)
            {
                lista.Add(new SelectListItem
                {
                    Text = puesto.nombre_puesto,
                    Value = puesto.id_puesto.ToString()
                });
            }

            return lista;
        }

    }

    public class AreasPersonaLaboral{
        public int id_area { get; set; }
        public string nombre_area { get; set; }
        public int id_area_bh { get; set; }
    }
    public class PuestoPersonaLaboral
    {
        public int id_puesto { get; set; }
        public int id_area { get; set; }
        public string nombre_puesto { get; set; }
        public int id_puesto_bh { get; set; }
    }
}
