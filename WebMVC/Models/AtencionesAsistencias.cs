using Dapper.Contrib.Extensions;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;

namespace WebMVC.Models
{
    public class AtencionesAsistencias
    {
        public int Id { get; set; }
        public int IdAtencion { get; set; }
        public string Sintomas { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public string Estado { get; set; }
        public string EdadAsist { get; set; }
        public string TipoDocumento { get; set; }
        public string Nombres { get; set; }
        public string Documento { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public string Direccion { get; set; }
        public string TipoAsistencia { get; set; }

        public List<SelectListItem> GetTipoDocumento()
        {
            return new List<SelectListItem>
            {
                new SelectListItem { Text = "Seleccione", Value = "" },
                new SelectListItem { Text = "Cedula de Ciudadania", Value = "C.C" },
                new SelectListItem { Text = "Cedula de Extranjeria", Value = "C.E" },
                new SelectListItem { Text = "Tarjeta de Identidad", Value = "T.I" }
            };
        }

    }
}

