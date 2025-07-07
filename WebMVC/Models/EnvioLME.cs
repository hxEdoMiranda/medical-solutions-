using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class EnvioLME
    {
        public PersonasViewModel Paciente { get; set; }
        public List<Examenes> Examenes { get; set; }
        public RespuestaPago RespuestaPago { get; set; }
        public string UsuarioLME { get; set; }
        public string PaswordLME { get; set; }
        public string ParametroD1LME { get; set; }
        public string ParametroD7LME { get; set; }
        public string CorreoDestino { get; set; }
    }
}
