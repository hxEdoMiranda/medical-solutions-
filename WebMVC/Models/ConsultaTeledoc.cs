using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;

namespace WebMVC.Models
{
    public class ConsultaTeledoc
    {
        public string idConsulta { get; set; }
        public string idConsultaExterna { get; set; }
        public string idPaciente { get; set; }
        public string idCarga { get; set; }
        public string idDoctor { get; set; }
        public string nombreDoctor { get; set; }
        public string nombrePaciente { get; set; }
        public string tsCreacion { get; set; }
        public int specialtyId_MS { get; set; }
        public int id_clienteMS { get; set; }
        public string pais { get; set; }
        public string especialidad { get; set; }      
    }
}
