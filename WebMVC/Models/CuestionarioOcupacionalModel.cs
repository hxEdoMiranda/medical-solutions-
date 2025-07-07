using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class CuestionarioOcupacional
    {
        public List<PreguntasCuestionario> Preguntas { get; set; }

        public class PreguntasCuestionario
        {
            public int id_pregunta { get; set; }
            public int id_seccion { get; set; }
            public string texto_pregunta { get; set; }
            public int? tipo_pregunta { get; set; }
            public int? id_pregunta_bh { get; set; }
            public List<OpcionesRespuestas> OpcionesRespuesta { get; set; }
            public List<RespuestasEncuenta> Respuestas { get; set; }
            public List<PreguntaAssets> Assets { get; set; }
        }
        public class OpcionesRespuestas
        {
            public int id_preguntaopciones { get; set; }
            public int id_pregunta { get; set; }
            public string texto_preguntaopcion { get; set; }
            public int? id_pregunta_bh { get; set; }
        }

        public class RespuestasEncuenta
        {
            public int id_respuesta { get; set; }
            public int id_encuesta_persona { get; set; }
            public int id_preguntaopciones { get; set; }
            public string texto_respuesta { get; set; }
        }
        public class PreguntaAssets
        {
            public int id { get; set; }
            public int id_pregunta { get; set; }
            public string asset_url { get; set; }
            public int tipo_asset { get; set; }
        }
    }

}
