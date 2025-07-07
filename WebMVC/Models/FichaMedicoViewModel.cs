using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace WebMVC.Models
{
    public class FichaMedicoViewModel
    {
        public List<Archivo> archivos { get; set; }
        public PersonasDatos personasDatos { get; set; }
        public PersonasViewModel personas { get; set; }

        public Atenciones atencion { get; set; }
        public List<TipoProfesionalViewModel> prefijoProfesion { get; set; }
        public List<Parametros> prefijo { get; set; }
        public List<Parametros> duracionAtencion { get; set; }
        public List<Especialidades> especialidades { get; set; }

        public String FechaAtencion { get; set; }
        public String HorarioText { get; set; }
        public String amPm { get; set; }
        public int IdCentroClinico{ get; set; }
        public SpGetValorizacionExcepciones ValorizacionExcepciones { get; set; }
        public Especialidades especialidad{ get; set; }
        public List<SelectListItem> ZonasHorarias()
        {
            int start = -12;
            int count = 25;
            List<SelectListItem> lista = new List<SelectListItem>();

            return lista.Union(Enumerable.Range(start, count).Select(i => new SelectListItem
            {
                Text = $"GMT{(i >= 0 ? $"+{i}" : i.ToString())}",
                Value = i.ToString()
            })).ToList();
        }

    }
}
