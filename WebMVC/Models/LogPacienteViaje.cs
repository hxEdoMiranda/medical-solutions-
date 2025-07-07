using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class LogPacienteViaje
    {
        public int Id { get; set; }
        public int IdPaciente { get; set; }
        public string Evento { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public int? IdAtencion { get; set; }
        public string Info { get; set; }
        public int IdCliente { get; set; }
    }
}
