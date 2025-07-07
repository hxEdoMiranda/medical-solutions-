using Dapper;
using Dapper.Contrib.Extensions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using static Dapper.SqlMapper;
using Nom035.Models;

namespace Encuestas.API.Models
{
    [Table("EncuestaPersona")]
    public class EncuestaPersona : ModelBase
    {
        public int Id_encuesta_persona { get; set; }
        public int Id_encuesta { get; set; }
        public int Id_persona { get; set; }
        public DateTime Fecha_inicio_diligencia { get; set; }
        public DateTime Fecha_fin_diligencia { get; set; }
        public int Id_cuestionario_respondido { get; set; }
        public EncuestaPersona(IConfiguration _conf)
        {
            this.Configuration = _conf;
        }

        public EncuestaPersona()
        {

        }

        public void Insertar()
        {
            try
            {
                using (IDbConnection db = CreateConnection())
                {
                    var identity = db.Insert(this); 

                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public string InsertEncuesta(EncuestaPersona encuestaPersona, string textInput = null)
        {
            var id_encuesta= encuestaPersona.Id_encuesta;
            var id_persona = encuestaPersona.Id_persona;
            var fecha_inicio_diligencia = encuestaPersona.Fecha_inicio_diligencia;
            var id_encuesta_persona = encuestaPersona.Id_encuesta_persona;
            var id_preguntaopciones = encuestaPersona.Id_cuestionario_respondido;
            var texto_respuesta = textInput;

            if(textInput == "undefined")
                texto_respuesta = null;

            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    var affectedRows = db.Query<string>("SpInsertarRespuestasOcupacional",
                                param: new
                                {
                                    id_encuesta = id_encuesta,
                                    id_persona = id_persona,
                                    fecha_inicio_diligencia = fecha_inicio_diligencia,
                                    texto_respuesta = texto_respuesta,
                                    id_preguntaopciones = id_preguntaopciones,
                                    id_encuesta_persona2 = id_encuesta_persona

                                },
                                commandType: CommandType.StoredProcedure).FirstOrDefault();
                    return affectedRows;

                }catch(Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }
        public IdEncuesta GetIdEncuestaByQuestion(int idQuestion)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {

                    var sql = "SELECT e.id_encuesta  from EncuestaPregunta ep " +
                              " inner join EncuestaSeccion es on es.id_seccion = ep.id_seccion " +
                              " inner join Encuesta e on e.id_encuesta = es.id_encuesta " +
                              " where ep.id_pregunta = @idQuestion ";

                    var idEncuesta = db.Query<IdEncuesta>(
                        sql,
                        param: new { idQuestion })
                        .SingleOrDefault();

                    return idEncuesta;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }

        public string CreateNewMedicalExamUser(int idEncuesta, int idPersona)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {

                    var sql = "INSERT INTO EncuestaPersona (id_encuesta, id_persona) VALUES (@idEncuesta, @idPersona) ";

                    var data = db.Query<string>(
                        sql,
                        param: new { idEncuesta, idPersona })
                        .SingleOrDefault();

                    return data;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }

        public string CreateResultMedicalExams( int id_persona, string audiometria_Oido_izquierdo, string audiometria_Oido_derecho, string colometria_Ojo_izquierdo, string colometria_Ojo_derecho, string visiometria_Ojo_derecho, string visiometria_Ojo_izquierdo, string lectura_Ojo_izquierdo, string lectura_Ojo_derecho)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    var Activo = true;
                    var sql = "INSERT INTO ResultadosEncuestaOcupacional " +
                        "(id_persona, audiometria_Oido_izquierdo, audiometria_Oido_derecho,colometria_Ojo_izquierdo, colometria_Ojo_derecho, visiometria_Ojo_derecho, visiometria_Ojo_izquierdo, lectura_Ojo_izquierdo, lectura_Ojo_derecho, Activo) " +
                        "VALUES " +
                        "(@id_persona, @audiometria_Oido_izquierdo, @audiometria_Oido_derecho, @colometria_Ojo_izquierdo, @colometria_Ojo_derecho, @visiometria_Ojo_derecho, @visiometria_Ojo_izquierdo, @lectura_Ojo_izquierdo, @lectura_Ojo_derecho, @Activo) ";

                    var data = db.Query<string>(
                        sql,
                        param: new { 
                            id_persona, 
                            audiometria_Oido_izquierdo, 
                            audiometria_Oido_derecho,
                            colometria_Ojo_izquierdo, 
                            colometria_Ojo_derecho, 
                            visiometria_Ojo_derecho, 
                            visiometria_Ojo_izquierdo, 
                            lectura_Ojo_izquierdo, 
                            lectura_Ojo_derecho,
                            Activo
                        })
                        .SingleOrDefault();

                    return data;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }

        public int? GetIdEncuestaResults(int id_persona)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    var Activo = true;
                    var sql = "SELECT e.id_resultados_encuesta_ocupacional  from ResultadosEncuestaOcupacional e where e.Activo = @Activo AND e.id_persona = @id_persona";

                    var id = db.Query<IdEncuestaOcupacional>(
                          sql,
                          param: new { Activo, id_persona })
                          .SingleOrDefault();

                    if(id != null ) {
                        return id.id_resultados_encuesta_ocupacional;
                    }

                    return null;
                    
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }

        public List<TestOcupacionalesResult>  GetEncuestaResults(int id_persona)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    var Activo = true;
                    var sql = "SELECT * from ResultadosEncuestaOcupacional e where e.Activo = @Activo AND e.id_persona = @id_persona";

                    var data = db.Query<TestOcupacionalesResult>(
                          sql,
                          param: new { Activo, id_persona })
                          .ToList();

                    if (data != null)
                    {
                        return data;
                    }

                    return null;

                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }

        public string GetIdsEncuestaPersona(int id_persona)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    var sql = "SELECT * FROM EncuestaPersona ep INNER JOIN Encuesta e on e.id_encuesta = ep.id_encuesta WHERE ep.id_persona = @id_persona AND e.Estado = 'V' AND e.Cod_tipo IN ('visual', 'audiometria', 'psicologico')";

                    var data = db.Query<IdEncuestaPersona>(
                          sql,
                          param: new {  id_persona })
                          .ToString();

                    if (data != null)
                    {
                        return data;
                    }

                    return null;

                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }
        public List<int> GetIdEncuestaPersona(int id_persona)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    List<int> list = new List<int>();
                    string[] dataFor = new string[3] { "visual", "audiometria", "psicologico" };
                    foreach (string data in dataFor)
                    {
                        var sql = "SELECT MAX(id_encuesta_persona) id_encuesta_persona FROM EncuestaPersona ep INNER JOIN Encuesta e on e.id_encuesta = ep.id_encuesta  WHERE ep.id_persona = @id_persona AND e.Estado = 'V' AND e.Cod_tipo = @data";

                        var response = db.Query<IdEncuestaPersona>(
                              sql,
                              param: new { id_persona, data })
                              .SingleOrDefault();

                        list.Add(response.id_encuesta_persona);
                    }
                    

                    return list;

                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }
        public int GetOneIdEncuestaPersona(int id_encuesta, int id_persona)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {

                        var sql = "SELECT MAX(id_encuesta_persona) id_encuesta_persona FROM EncuestaPersona ep   WHERE ep.id_persona = @id_persona AND ep.id_encuesta = @id_encuesta";

                        var response = db.Query<IdEncuestaPersona>(
                              sql,
                              param: new { id_persona, id_encuesta })
                              .SingleOrDefault();

                        return response.id_encuesta_persona;

                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }


        public int GetIdEncuestaByNameText(string Cod)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {

                    var sql = "SELECT e.id_encuesta  from Encuesta e where e.Cod_tipo = @Cod AND e.Estado = 'V'";

                  var idEncuesta = db.Query<IdEncuesta>(
                        sql,
                        param: new { Cod })
                        .SingleOrDefault();

                    return idEncuesta.id_encuesta;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }

        public List<IdEncuesta> GetEncuestaByNameTextNotNull()
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {

                    var sql = "SELECT e.id_encuesta  from Encuesta e where e.Cod_tipo IS NOT NULL AND e.Estado = 'V'";

                    var Encuestas = db.Query<IdEncuesta>(
                          sql)
                          .ToList();

                    return Encuestas;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }
        public bool Actualizar()
        {
            using (IDbConnection db = CreateConnection())
            {
                var actualizado = db.Update(this);
                return actualizado;

            }
        }

        public class IdEncuesta
        {
            public int id_encuesta { get; set; }
        }

        public class IdEncuestaOcupacional
        {
            public int id_resultados_encuesta_ocupacional { get; set; }
        }

        public class IdEncuestaPersona
        {
            public int id_encuesta_persona { get; set; }
        }
    }
}
