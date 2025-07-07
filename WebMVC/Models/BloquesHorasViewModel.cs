using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class BloquesHorasViewModel
    {
        public int Id { get; set; }

        public TimeSpan HoraDesde { get; set; }

        public TimeSpan HoraHasta { get; set; }

        public DateTime? FechaCreacion { get; set; }

        public int? IdUsuarioModifica { get; set; }

        public DateTime? FechaModifica { get; set; }

        public string Estado { get; set; }

        public int? IdUsuarioCreacion { get; set; }

        public int? IdDuracionAntencion { get; set; }
    }
}
