using Dapper;
using Dapper.Contrib.Extensions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Globalization;
using Microsoft.Extensions.Configuration;
using Nom035.Data;
using System.Reflection;

namespace Encuestas.API.Models
{
    public class CuestionarioProgreso
    {

        public List<CuestionarioRespuestas> respuestas { get; set; }
        public int Avance { get; set; }
    }

    public class EncuestaEmpresas
    {
        public string Cod_tipo { get; set; }
        public int id_encuesta_activa { get; set; }
        public int Avance { get; set; }
    }

    public class CuestionarioRespuestas
    {
        public int id_pregunta { get; set; }
        public int contestada { get; set; }
    }

    public class RespuestaProgreso
    {

        public List<RespuestasIngresadas> respuestas { get; set; }
    }
    public class RespuestaProgresoAudiometria
    {

        public List<RespuestasIngresadasAudiometria> respuestas { get; set; }
    }

    public class RespuestasIngresadas 
    {
        public int id_pregunta { get; set; }
        public int contestada { get; set; }
        public int id_preguntaopciones { get; set; }
        public string texto_respuesta { get; set; }
        public string texto_preguntaopcion { get; set; }
        public string texto_pregunta { get; set; }
        public string respuesta { get; set; }
        public int puntaje_respuesta { get; set; }
        public string asset_url { get; set;}
    }
    public class RespuestasIngresadasAudiometria
    {
        public int id_pregunta { get; set; }
        public int contestada { get; set; }
        public int id_preguntaopciones { get; set; }
        public string texto_respuesta { get; set; }
        public int puntaje_respuesta { get; set; }
    }
}
