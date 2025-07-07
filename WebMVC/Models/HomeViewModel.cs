using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class HomeViewModel
    {
        public List<VwHorasMedicos> CalendarData { get; set; }
        public VwHorasMedicos horasMedicos { get; set; }
        public List<VwHorasMedicosBloquesHoras> TimelineData { get; set; }
        public Convenios convenio { get; set; }
        public List<Parametros> modeloAtencion { get; set; }
        public List<Parametros> tipoAgenda { get; set; }
        public string ZonaHoraria { get; set; }
        public List<VwHorasMedicosBloquesHorasAtencion> TimelineData2 { get; set; }

        public List<SelectListItem> ZonasHorarias()
        {
            int start = -12;
            int count = 25;
            List<SelectListItem> lista = new List<SelectListItem>();

            return lista.Union(Enumerable.Range(start, count).Select(i => new SelectListItem
            {
                Text = $"GMT{(i >= 0 ? $"+{i}" : i.ToString())}",
                Value = i.ToString(),
                Selected = ZonaHoraria == i.ToString()
            })).ToList();
        }

        public List<SelectListItem> IdDuracionTiempo(string url = "")
        {
            var lista = new List<SelectListItem>
            {
                new SelectListItem { Text = "15 Min", Value = "1" },
                new SelectListItem { Text = "20 Min", Value = "2" },
                new SelectListItem { Text = "30 Min", Value = "3" },
                new SelectListItem { Text = "45 Min", Value = "5" },
                new SelectListItem { Text = "60 Min", Value = "6" }
            };

            if (!url.Contains("achs."))
                lista.Add(new SelectListItem { Text = "Atención directa (para convenios validos)", Value = "4" });

            return lista;
        }
    }
}
