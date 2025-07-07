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
    public class CuestionarioOcupacional : ModelBase
    {
        public List<PreguntasCuestionario> Preguntas { get; set; }

        public CuestionarioOcupacional(IConfiguration _conf)
        {
            this.Configuration = _conf;
        }
        public CuestionarioOcupacional()
        {

        }
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

        public CuestionarioOcupacional GetCuestionario(int idCuestionario, int idPersona, int idEncuestaPersona)
        {
            CuestionarioOcupacional cuestionario = new CuestionarioOcupacional();
            List<PreguntasCuestionario> preguntas = new List<PreguntasCuestionario>();
            List<OpcionesRespuestas> opciones = new List<OpcionesRespuestas>();
            List<RespuestasEncuenta> respuestas = new List<RespuestasEncuenta>();
            List<PreguntaAssets> assets = new List<PreguntaAssets>();

            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    preguntas = db.Query<PreguntasCuestionario>("SELECT ep.*  FROM Encuesta e  " +
                                                                "INNER JOIN EncuestaSeccion es ON es.id_encuesta = e.id_encuesta " +
                                                                "INNER JOIN EncuestaPregunta ep ON ep.id_seccion = es.id_seccion " +
                                                                "WHERE e.id_encuesta = @idCuestionario", param: new { idCuestionario }).ToList();
                    int index = 0;
                    foreach (var item in preguntas)
                    {
                        opciones = db.Query<OpcionesRespuestas>("SELECT * FROM EncuestaPreguntaOpciones epo WHERE id_pregunta = @id_pregunta ", param: new { item.id_pregunta }).ToList();
                        preguntas[index].OpcionesRespuesta = opciones;
                        index++;
                    }
                    int index2 = 0;
                    foreach (var item in preguntas)
                    {
                        respuestas = db.Query<RespuestasEncuenta>("SELECT er.* FROM EncuestaRespuesta er   INNER JOIN EncuestaPersona ep ON ep.id_encuesta  = @idCuestionario AND er.id_pregunta = @id_pregunta AND ep.id_encuesta_persona = @idEncuestaPersona AND ep.id_persona  = @idPersona INNER JOIN Encuesta e  ON e.id_encuesta = ep.id_encuesta \r\n\t\tAND er.id_encuesta_persona = ep.id_encuesta_persona ", param: new { idCuestionario, idPersona, item.id_pregunta, idEncuestaPersona }).ToList();
                        preguntas[index2].Respuestas = respuestas;
                        index2++;
                    }
                    int index3 = 0;
                    foreach (var item in preguntas)
                    {
                        assets = db.Query<PreguntaAssets>("SELECT * FROM PreguntasAssets pa WHERE pa.id_pregunta = @id_pregunta", param: new { item.id_pregunta }).ToList();
                        preguntas[index3].Assets = assets;
                        index3++;
                    }

                    cuestionario.Preguntas = preguntas;
                    return cuestionario;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }

        public CuestionarioProgreso GetProgresoCuestinario(int idEncuesta, int idPersona, int idEncuestaPersona)
        {

            CuestionarioProgreso cuestionario = new CuestionarioProgreso();

            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    cuestionario.respuestas = db.Query<CuestionarioRespuestas>(@"SELECT ep.id_pregunta , (SELECT COUNT(1) FROM EncuestaRespuesta er 
                                                                        INNER JOIN EncuestaPersona ep2 
	                                                                        ON ep2.id_encuesta = @idEncuesta
	                                                                        AND ep2.id_persona = @idPersona
	                                                                        AND ep2.id_encuesta_persona = er.id_encuesta_persona 
	                                                                        AND ep2.id_encuesta_persona = @idEncuestaPersona
                                                                            WHERE id_preguntaopciones IN (SELECT id_preguntaopciones  
                                                                                FROM EncuestaPreguntaOpciones epo WHERE id_pregunta = ep.id_pregunta)) AS contestada FROM Encuesta e 
                                                                        INNER JOIN EncuestaSeccion es 
                                                                            ON es.id_encuesta = e.id_encuesta
                                                                        INNER JOIN EncuestaPregunta ep 
                                                                            ON ep.id_seccion = es.id_seccion
                                                                        WHERE e.id_tipo_encuesta  = (SELECT id_tipo_encuesta FROM Encuesta WHERE id_encuesta = @idEncuesta)", param: new { idEncuesta, idPersona, idEncuestaPersona }).ToList();
                    var total = cuestionario.respuestas.Count;
                    var respondidas = cuestionario.respuestas.Count(el => el.contestada == 1);
                    if (total == 0)
                        cuestionario.Avance = 0;
                    else
                        cuestionario.Avance = Convert.ToInt32(Decimal.Round((respondidas * 100) / total));
                    return cuestionario;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }
        public EncuestaCondiciones GetEncuestaCondiciones(int idCuestionario)
        {

            EncuestaCondiciones condiciones = new EncuestaCondiciones();

            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    condiciones.Condiciones = db.Query<Condiciones>(@"SELECT ec.condicion, ec.asset_url  FROM EncuestaCondiciones ec
                                                                                    INNER JOIN Encuesta e
	                                                                                    ON ec.id_tipo_encuesta  = e.id_tipo_encuesta 
                                                                                    WHERE e.id_encuesta  = @idCuestionario
                                                                                    ", param: new { idCuestionario }).ToList();
                    condiciones.Titulo = db.Query<string>(@"SELECT top 1 e.nom_cuestionario AS titulo FROM Encuesta e WHERE e.id_encuesta  = @idCuestionario", param: new { idCuestionario }).Single();
                    

                    return condiciones;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }
        public RespuestaProgreso GetRespuestasIngresadas(int idEncuesta, int idPersona, int idEncuestaPersona)
        {

            RespuestaProgreso cuestionario = new RespuestaProgreso();

            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    cuestionario.respuestas = db.Query<RespuestasIngresadas>(@"SELECT ep.id_pregunta, ep.texto_pregunta, ps.asset_url ,(SELECT COUNT(1) FROM EncuestaRespuesta er 
                                                                                INNER JOIN EncuestaPersona ep2 
                                                                                    ON ep2.id_encuesta = @idEncuesta
                                                                                    AND ep2.id_persona = @idPersona
                                                                                    AND ep2.id_encuesta_persona = er.id_encuesta_persona 
                                                                                    AND ep2.id_encuesta_persona = @idEncuestaPersona
                                                                                WHERE id_preguntaopciones IN (SELECT id_preguntaopciones  
                                                                                        FROM EncuestaPreguntaOpciones epo WHERE id_pregunta = ep.id_pregunta)) AS contestada, 
                                                                                er.id_preguntaopciones, er.texto_respuesta, epo.texto_preguntaopcion, te.respuesta, te.puntaje_respuesta FROM Encuesta e 
                                                                                INNER JOIN EncuestaSeccion es ON es.id_encuesta = e.id_encuesta
                                                                                INNER JOIN EncuestaPregunta ep ON ep.id_seccion = es.id_seccion
                                                                                INNER JOIN EncuestaPreguntaOpciones epo ON epo.id_pregunta = ep.id_pregunta
                                                                                INNER JOIN PreguntaRespuesta te ON te.id_pregunta = ep.id_pregunta
                                                                                INNER JOIN PreguntasAssets ps ON ps.id_pregunta = ep.id_pregunta
                                                                                INNER JOIN EncuestaRespuesta er ON er.id_preguntaopciones = epo.id_preguntaopciones
                                                                                INNER JOIN EncuestaPersona ep2 
                                                                                    ON ep2.id_encuesta = @idEncuesta 
                                                                                    AND ep2.id_persona = @idPersona 
                                                                                    AND ep2.id_encuesta_persona = er.id_encuesta_persona
                                                                                WHERE e.id_tipo_encuesta  = (SELECT id_tipo_encuesta FROM Encuesta WHERE id_encuesta = @idEncuesta)", param: new { idEncuesta, idPersona, idEncuestaPersona }).ToList();
                    var total = cuestionario.respuestas.Count;
                    return cuestionario;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }
        public RespuestaProgresoAudiometria GetRespuestasIngresadasAudiometria(int idEncuesta, int idPersona)
        {

            RespuestaProgresoAudiometria cuestionario = new RespuestaProgresoAudiometria();

            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    cuestionario.respuestas = db.Query<RespuestasIngresadasAudiometria>(@"SELECT ep.id_pregunta ,(SELECT COUNT(1) FROM EncuestaRespuesta er 
                                                                                INNER JOIN EncuestaPersona ep2 
                                                                                    ON ep2.id_encuesta = @idEncuesta
                                                                                    AND ep2.id_persona = @idPersona
                                                                                    AND ep2.id_encuesta_persona = er.id_encuesta_persona 
                                                                                WHERE id_preguntaopciones IN (SELECT id_preguntaopciones  
                                                                                        FROM EncuestaPreguntaOpciones epo WHERE id_pregunta = ep.id_pregunta)) AS contestada, 
                                                                                er.id_preguntaopciones, er.texto_respuesta, te.puntaje_respuesta FROM Encuesta e 
                                                                                INNER JOIN EncuestaSeccion es ON es.id_encuesta = e.id_encuesta
                                                                                INNER JOIN EncuestaPregunta ep ON ep.id_seccion = es.id_seccion
                                                                                INNER JOIN EncuestaPreguntaOpciones epo ON epo.id_pregunta = ep.id_pregunta
                                                                                INNER JOIN PreguntaRespuesta te ON te.id_pregunta = ep.id_pregunta
                                                                                INNER JOIN EncuestaRespuesta er ON er.id_preguntaopciones = epo.id_preguntaopciones
                                                                                INNER JOIN EncuestaPersona ep2 
                                                                                    ON ep2.id_encuesta = @idEncuesta 
                                                                                    AND ep2.id_persona = @idPersona
                                                                                    AND ep2.id_encuesta_persona = er.id_encuesta_persona
                                                                                WHERE e.id_tipo_encuesta  = (SELECT id_tipo_encuesta FROM Encuesta WHERE id_encuesta = @idEncuesta)", param: new { idEncuesta, idPersona }).ToList();
                    var total = cuestionario.respuestas.Count;
                    return cuestionario;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }
    }
}
