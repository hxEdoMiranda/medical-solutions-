using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class CuestionarioProgreso
    {

        public List<CuestionarioRespuestas> respuestas { get; set; }
        public int Avance { get; set; }
    }

    public class CuestionarioRespuestas
    {
        public int id_pregunta { get; set; }
        public int contestada { get; set; }
    }
}
