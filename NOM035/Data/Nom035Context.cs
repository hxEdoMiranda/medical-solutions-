using Dapper;
using Dapper.Contrib.Extensions;
using Microsoft.Extensions.Configuration;
using Nom035.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Nom035.Data
{
    public class Nom035Context : ModelBase
    {
        public Nom035Context(IConfiguration _conf)
        {
            this.Configuration = _conf;
        }

        public EmpresaDataModel ConsultarEmpresaPorIdPaciente(int Id)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    var sql = @"select e.id, e.Rut AS rfc, e.Nombre as nombre_comercial, e.RazonSocial as razon_social, 
                                ee.NumeroEmpleados as cantidad_empleados, ee.IdEmpresaBH 
                                from Empresas e
                                inner join PersonasEmpresas pe on e.Id=pe.IdEmpresa and pe.Estado = 'V'
                                inner join EncuestaEmpresa ee on e.Id=ee.IdEmpresa
                                where pe.IdPersona= @Id";

                    var lista = db.Query<EmpresaDataModel>(
                            sql,
                            param: new { Id })
                        .FirstOrDefault();

                    return lista;
                }
                catch (Exception e)
                {
                    throw;
                }
            }
        }
        public EmpresaDataModel ConsultarEmpresaPorIdArea(int Id)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    var sql = @"select e.id, e.Rut AS rfc, e.Nombre as nombre_comercial, e.RazonSocial as razon_social, 
                                ee.NumeroEmpleados as cantidad_empleados, ee.IdEmpresaBH 
                                from Empresas e
                                inner join Area a on e.Id = a.IdEmpresa
                                inner join EncuestaEmpresa ee on e.Id=ee.IdEmpresa
                                where a.id_area = @Id";

                    var lista = db.Query<EmpresaDataModel>(
                            sql,
                            param: new { Id })
                        .FirstOrDefault();

                    return lista;
                }
                catch (Exception e)
                {
                    throw;
                }
            }
        }
        public List<OptionsDataModel> ConsultarIdOpcion(int id_cuestionario_respondido)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    var sql = @"  select epo.id_preguntaopciones, ep.id_pregunta, epo.id_respuesta_bh from Encuesta e
                                  inner join EncuestaSeccion es on e.id_encuesta=es.id_encuesta
                                  inner join EncuestaPregunta ep on es.id_seccion= ep.id_seccion
                                  inner join EncuestaPreguntaOpciones epo on ep.id_pregunta = epo.id_pregunta
                                  inner join EncuestaPersona epe on e.id_encuesta=epe.id_encuesta
                                  where epe.id_cuestionario_respondido=@id_cuestionario_respondido";

                    var lista = db.Query<OptionsDataModel>(
                            sql,
                            param: new { id_cuestionario_respondido })
                        .ToList();

                    return lista;
                }
                catch (Exception e)
                {
                    throw;
                }
            }
        }

        public PeriodoRequestModel ConsultarPeriodoxIdPaciente(int idPaciente)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    var sql = @"select distinct epr.IdPeriodoBH as id_periodo_bh 
                                from EncuestaPersona emp
                                inner join PersonasEmpresas pem on emp.id_persona=pem.IdPersona and pe.Estado = 'V'
                                inner join EncuestaPeriodo epr on pem.IdEmpresa=epr.IdEmpresa
                                where emp.id_persona=@idPaciente";

                    var lista = db.Query<PeriodoRequestModel>(
                            sql,
                            param: new { idPaciente })
                        .FirstOrDefault();

                    return lista;
                }
                catch (Exception e)
                {
                    throw;
                }
            }
        }


        public EmpresaDataModel ConsultarPacienteEmpresaBH(int Id, int id_cliente)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    var sql = @"select e.id, e.Rut AS rfc, e.Nombre as razon_social, e.RazonSocial as razon_social, ee.NumeroEmpleados as cantidad_empleados, ee.IdEmpresaBH, pdl.idpersona, pdl.idpersona_bh from Empresas e
                                inner join PersonasEmpresas pe on e.Id=pe.IdEmpresa and pe.Estado = 'V'
                                left join EncuestaEmpresa ee on e.Id=ee.IdEmpresa
                                inner join PersonasDatosLaborales pdl on pe.IdPersona=pdl.IdPersona
                                where pe.IdPersona= @Id and e.id = @id_cliente";

                    var lista = db.Query<EmpresaDataModel>(
                            sql,
                            param: new { Id, id_cliente })
                        .FirstOrDefault();

                    return lista;
                }
                catch (Exception e)
                {
                    throw;
                }
            }
        }
        public async Task<int> TerminarCuestionarioAsync(CuestionarioRequestModel persona)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    string sql = @"update EncuestaPersona set
                               fecha_fin_diligencia=dbo.getdate2()
                            where id_cuestionario_respondido=@id_cuestionario_respondido ";
                    var idInserted = await db.QuerySingleAsync<int>(sql, new
                    {
                        persona.id_cuestionario_respondido
                    });
                    return idInserted;
                }
                catch (Exception)
                {
                    return 0;
                }
            }
        }
        public EncuestaRespuestaModel ConsultarRespuestaPregunta(int id_pregunta, int id_encuesta_persona)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    var sql = @"select id_respuesta
                               ,id_encuesta_persona
                                ,id_preguntaopciones
                               ,id_pregunta
                               ,texto_respuesta
                               ,enviada
                                from EncuestaRespuesta
                                where id_pregunta=@id_pregunta and id_encuesta_persona=@id_encuesta_persona";

                    var lista = db.Query<EncuestaRespuestaModel>(
                            sql,
                            param: new { id_pregunta, id_encuesta_persona })
                        .FirstOrDefault();

                    return lista;
                }
                catch (Exception e)
                {
                    throw;
                }
            }
        }

        public async Task<int> InsertarRespuestaPregunta(EncuestaRespuestaModel respuesta)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    string sql = @"INSERT INTO EncuestaRespuesta
                                           (id_encuesta_persona
                                           ,id_pregunta
                                           ,id_preguntaopciones
                                           ,texto_respuesta
                                           ,enviada)
                                     VALUES
                                           (@id_encuesta_persona
                                           ,@id_pregunta
                                           ,@id_preguntaopciones
                                           ,@texto_respuesta
                                           ,@enviada)";

                    var idInserted = await db.QuerySingleAsync<int>(sql, new
                    {
                        respuesta.id_encuesta_persona,
                        respuesta.id_pregunta,
                        respuesta.id_preguntaopciones,
                        respuesta.texto_respuesta,
                        respuesta.enviada
                    });

                    return idInserted;
                }
                catch (Exception e)
                {
                    return 0;
                }
            }
        }
        public async Task<EncuestaComentarioEmpresa> InsertarEncuestaComentario(EncuestaComentario comentario)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    string sql = @"INSERT INTO EncuestaComentario (Comentario, id_Cliente)
                                     OUTPUT INSERTED.Id 
                                     VALUES  ( @Comentario, @id_Cliente  )";
                                           

                    int idInserted = await db.QuerySingleAsync<int>(sql, new 
                    {
                      Comentario= comentario.Comentario, 
                      id_Cliente = comentario.id_Cliente
                    });
                    if (idInserted == 0) return null;
                     sql = @"select top 1 * from EncuestaComentarioEmpresa where id_cliente = @id_Cliente and estado = 1";


                    EncuestaComentarioEmpresa encustacomentario = await db.QuerySingleAsync<EncuestaComentarioEmpresa>(sql, new
                    {
                        id_Cliente = comentario.id_Cliente
                    });
                    //sql = @"select ......";
                    //mimodelo correo = await db.QuerySingleAsync<mimodelo>(sql, new
                    //{
                    //    id_Cliente = comentario.id_Cliente
                    //});
                    return encustacomentario;
                    //return idInserted;
                }
                catch (Exception e)
                {
                    return null;
                }
            }
        }
        public async Task<bool> PermisoComentarioEmpresa(int id_cliente)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    string sql = @"select count (1) from EncuestaComentarioEmpresa where id_cliente = @id_Cliente and estado = 1";

                    int encustacomentario = await db.QuerySingleAsync<int>(sql, new
                    {
                        id_Cliente = id_cliente
                    });

                    return encustacomentario>0;
                }
                catch (Exception e)
                {
                    return false;
                }
            }
        }

        public async Task<int> UpdateRespuestaPregunta(EncuestaRespuestaModel persona)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    string sql = @"update EncuestaRespuesta set
                                       id_encuesta_persona=@id_encuesta_persona
                                      ,id_preguntaopciones=@id_preguntaopciones
                                      ,texto_respuesta=@texto_respuesta
                                      ,enviada=@enviada
                                    where id_respuesta=@id_respuesta ";

                    var idInserted = await db.QuerySingleAsync<int>(sql, new
                    {
                        persona.id_respuesta,
                        persona.id_encuesta_persona,
                        persona.id_preguntaopciones,
                        persona.texto_respuesta,
                        persona.enviada
                    });

                    return idInserted;
                }
                catch (Exception e)
                {
                    return 0;
                }
            }
        }

        public EncuestaAvanceModel ConsultarPorcentajePregutasAvance(int id_encuesta, int id_persona, int id_cliente)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    var sql = @"select count(ep.id_pregunta) preguntas
                                from EncuestaPersona Enp
                                inner join Encuesta e on enp.id_encuesta=e.id_encuesta
                                inner join EncuestaSeccion es on e.id_encuesta = es.id_encuesta
                                inner join EncuestaPregunta ep on es.id_seccion=ep.id_seccion
                                where enp.id_encuesta = @id_encuesta and enp.id_persona=@id_persona ";

                    var lista = db.Query<EncuestaAvanceModel>(
                            sql,
                            param: new { id_encuesta, id_persona, id_cliente })
                        .FirstOrDefault();

                    return lista;
                }
                catch (Exception e)
                {
                    throw;
                }
            }
        }

        public EncuestaAvanceModel ConsultarPorcentajeRespuestasAvance(int id_encuesta, int id_persona, int id_cliente)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    var sql = @"select count(er.id_respuesta) respuestas
                                from EncuestaPersona Enp
                                inner join EncuestaRespuesta er on er.id_encuesta_persona = Enp.id_encuesta_persona
                                where enp.id_encuesta=@id_encuesta and enp.id_persona=@id_persona ";

                    var lista = db.Query<EncuestaAvanceModel>(
                            sql,
                            param: new { id_encuesta, id_persona, id_cliente })
                        .FirstOrDefault();

                    return lista;
                }
                catch (Exception e)
                {
                    throw;
                }
            }
        }

        public PuestoDataModel ConsultarPuestoxId(int Id)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    var sql = @"select * from puestos where id_puesto= @Id and estado = 1";

                    var lista = db.Query<PuestoDataModel>(
                            sql,
                            param: new { Id })
                        .FirstOrDefault();

                    return lista;
                }
                catch (Exception e)
                {
                    throw;
                }
            }
        }
        public PuestoDataModel ConsultarPuestoxIdArea(int IdArea)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    var sql = @"select* from Puestos where id_area = @IdArea and estado = 1"; 

                    var lista = db.Query<PuestoDataModel>(
                            sql,
                            param: new { IdArea })
                        .FirstOrDefault();

                    return lista;
                }
                catch (Exception e)
                {
                    throw;
                }
            }
        }
        public AreaDataModel ConsultarAreaxId(int Id)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    var sql = @"select * from area where id_area= @Id and estado = 1";

                    var lista = db.Query<AreaDataModel>(
                            sql,
                            param: new { Id })
                        .FirstOrDefault();

                    return lista;
                }
                catch (Exception e)
                {
                    throw;
                }
            }
        }
        public AreaDataModel ConsultarAreaxIdEmpresa(string IdEmpresa)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    var sql = @"select * from area where idEmpresa= @IdEmpresa and estado = 1";

                    var lista = db.Query<AreaDataModel>(
                            sql,
                            param: new { IdEmpresa })
                        .FirstOrDefault();

                    return lista;
                }
                catch (Exception e)
                {
                    throw;
                }
            }
        }

        public int UpdateIdEmpresaBHxId(int IdEmpresa, int IdEmpresaBH)
        {
            using (IDbConnection db = CreateConnection())
            {
                string sql = "update EncuestaEmpresa set IdEmpresaBH=@IdEmpresaBH where IdEmpresa= @IdEmpresa ";
                var affectedRows = db.Execute(sql, new { IdEmpresa, IdEmpresaBH });
                return affectedRows;
            }
        }

        public async Task<int> InsertarPeriodo(PeriodoRequestModel periodo)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    string sql = @"INSERT INTO EncuestaPeriodo
                                    (IdEmpresa
                                    ,NombrePeriodo
                                    ,FechaInicial
                                    ,FechaFinal
                                    ,CuestionariosDisponibles
                                    ,IdPeriodoBH)
                                OUTPUT INSERTED.IdPeriodo
                                VALUES
                                    (@id_empresa
                                    ,@nombre
                                    ,@fecha_inicio
                                    ,@fecha_fin
                                    ,@cuestionarios_disponibles
                                    ,@id_periodo_bh)";

                    var idInserted = await db.QuerySingleAsync<int>(sql, 
                        new { periodo.id_empresa, periodo.nombre, periodo.fecha_inicio, periodo.fecha_fin, periodo.cuestionarios_disponibles, periodo.id_periodo_bh });

                    return idInserted;
                }
                catch (Exception e)
                {
                    return 0;
                }
            }
        }
        public PeriodoRequestModel ConsultarPeriodoPorIdEmpresa(int Id)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    var sql = @"SELECT IdPeriodo as id_periodo
                                      ,IdEmpresa as id_empresa
                                      ,NombrePeriodo  as nombre
                                      ,FechaInicial as fecha_inicio
                                      ,FechaFinal as fecha_fin
                                      ,CuestionariosDisponibles as cuestionarios_disponibles
                                      ,IdPeriodoBH as id_periodo_bh
                                  FROM EncuestaPeriodo 
                                  WHERE IdEmpresa = @Id and GETDATE() between FechaInicial and FechaFinal order by FechaFinal desc";

                    var lista = db.Query<PeriodoRequestModel>(
                            sql,
                            param: new { Id })
                        .FirstOrDefault();

                    return lista;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }

        public int UpdateIdAreaBHxId(int id_area, int id_area_bh)
        {
            using (IDbConnection db = CreateConnection())
            {
                string sql = "update area set id_area_bh=@id_area_bh where id_area= @id_area ";
                var affectedRows = db.Execute(sql, new { id_area, id_area_bh });
                return affectedRows;
            }
        }

        public int UpdateIdPuestoBHxId(int id_puesto, int id_puesto_bh)
        {
            using (IDbConnection db = CreateConnection())
            {
                string sql = "update puestos set id_puesto_bh=@id_puesto_bh where id_pueso= @id_puesto ";
                var affectedRows = db.Execute(sql, new { id_puesto, id_puesto_bh });
                return affectedRows;
            }
        }

        public Encuesta ConsultarEncuestaPorId(int Id)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    var sql = @"SELECT * FROM Encuesta WHERE id_encuesta = @Id";

                    var lista = db.Query<Encuesta>(
                            sql,
                            param: new { Id })
                        .FirstOrDefault();

                    return lista;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }

        public EncuestaPersonaModel ConsultarEncuestaPersonaPorIdBH(int id_cuestionario_respondido)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    var sql = @"SELECT id_encuesta_persona
                                      ,id_encuesta
                                      ,id_persona
                                      ,fecha_inicio_diligencia
                                      ,fecha_fin_diligencia
                                      ,id_cuestionario_respondido
                                  FROM dbo.EncuestaPersona where id_cuestionario_respondido=@id_cuestionario_respondido";

                    var lista = db.Query<EncuestaPersonaModel>(
                            sql,
                            param: new { id_cuestionario_respondido })
                        .FirstOrDefault();

                    return lista;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }

        public async Task<int> InsertarEncuestaPersona(EncuestaPersonaModel encuesta)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    string sql = @"INSERT INTO EncuestaPersona
                                    (id_encuesta
                                      ,id_persona
                                      ,fecha_inicio_diligencia
                                      ,id_cuestionario_respondido
                                      , id_empresa )
                                OUTPUT INSERTED.id_encuesta_persona
                                VALUES
                                    (@id_encuesta
                                    ,@id_persona
                                    ,@fecha_inicio_diligencia
                                    ,@id_cuestionario_respondido
                                    ,@id_empresa )";

                    var idInserted = await db.QuerySingleAsync<int>(sql, new { encuesta.id_encuesta, encuesta.id_persona, encuesta.fecha_inicio_diligencia, encuesta.id_cuestionario_respondido , encuesta.id_empresa});

                    return idInserted;
                }
                catch (Exception e)
                {
                    return 0;
                }
            }
        }
        public async Task<int> InsertarEncuesta(Encuesta encuesta)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    string sql = @"INSERT INTO Encuesta
                                    (id_tipo_encuesta
                                    ,nom_cuestionario
                                    ,id_encuesta_bh)
                                OUTPUT INSERTED.id_encuesta
                                VALUES
                                    (@id_tipo_encuesta
                                    ,@nom_cuestionario
                                    ,@id_encuesta_bh)";

                    var idInserted = await db.QuerySingleAsync<int>(sql, new { encuesta.id_tipo_encuesta, encuesta.nom_cuestionario, encuesta.id_encuesta_bh });

                    return idInserted;
                }
                catch (Exception e)
                {
                    return 0;
                }
            }
        }

        public async Task<int> InsertarSeccion(EncuestaSeccion encuestaSeccion)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    string sql = @"INSERT INTO EncuestaSeccion
                                    (id_encuesta
                                    ,nombre_seccion
                                    ,id_seccion_bh)
                                OUTPUT INSERTED.id_seccion
                                VALUES
                                    (@id_encuesta
                                    ,@nombre_seccion
                                    ,@id_seccion_bh)";

                    var idInserted = await db.QuerySingleAsync<int>(sql, new { encuestaSeccion.id_encuesta, encuestaSeccion.nombre_seccion, encuestaSeccion.id_seccion_bh });

                    return idInserted;
                }
                catch (Exception e)
                {
                    return 0;
                }
            }
        }

        public async Task<int> InsertarPregunta(EncuestaPregunta encuestaPregunta)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    string sql = @"INSERT INTO EncuestaPregunta
                                    (id_seccion
                                    ,texto_pregunta
                                    ,tipo_pregunta
                                    ,id_pregunta_bh)
                                OUTPUT INSERTED.id_pregunta
                                VALUES
                                    (@id_seccion
                                    ,@texto_pregunta
                                    ,@tipo_pregunta
                                    ,@id_pregunta_bh)";

                    var idInserted = await db.QuerySingleAsync<int>(sql, new { encuestaPregunta.id_seccion, encuestaPregunta.texto_pregunta, encuestaPregunta.tipo_pregunta, encuestaPregunta.id_pregunta_bh });

                    return idInserted;
                }
                catch (Exception e)
                {
                    return 0;
                }
            }
        }

        public async Task<int> InsertarOpcion(EncuestaPreguntaOpciones encuestaPreguntaOpciones)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    string sql = @"INSERT INTO EncuestaPreguntaOpciones
                                    (id_pregunta
                                    ,texto_preguntaopcion
                                    ,id_respuesta_bh)
                                OUTPUT INSERTED.id_preguntaopciones
                                VALUES
                                    (@id_pregunta
                                    ,@texto_preguntaopcion
                                    ,@id_respuesta_bh)";

                    var idInserted = await db.QuerySingleAsync<int>(sql, new { encuestaPreguntaOpciones.id_pregunta, encuestaPreguntaOpciones.texto_preguntaopcion, encuestaPreguntaOpciones.id_respuesta_bh });

                    return idInserted;
                }
                catch (Exception e)
                {
                    return 0;
                }
            }
        }

        public async Task<int> InsertarDatosLaborales(PersonasDatosLaborales persona)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    string sql = @"insert into PersonasDatosLaborales(
	                                   idpersona
                                      ,experiencia_laboral
                                      ,fecha_ingreso
                                      ,id_area
                                      ,id_puesto
                                      ,fecha_ingreso_puesto
                                      ,id_tipo_contrato
                                      ,id_tipo_jornada
                                      ,rotacion_turno
                                      ,idpersona_bh)
                                  values(
                                       @idpersona
                                      ,@experiencia_laboral
                                      ,@fecha_ingreso
                                      ,@id_area
                                      ,@id_puesto
                                      ,@fecha_ingreso_puesto
                                      ,@id_tipo_contrato
                                      ,@id_tipo_jornada
                                      ,@rotacion_turno
                                      ,@idpersona_bh
                                  ) ";

                    var idInserted = await db.QuerySingleAsync<int>(sql, new
                    {
                        persona.idpersona,
                        persona.experiencia_laboral,
                        persona.fecha_ingreso,
                        persona.id_area,
                        persona.id_puesto,
                        persona.fecha_ingreso_puesto,
                        persona.id_tipo_contrato,
                        persona.id_tipo_jornada,
                        persona.rotacion_turno,
                        persona.idpersona_bh
                    });

                    return idInserted;
                }
                catch (Exception e)
                {
                    return 0;
                }
            }
        }

        public async Task<int> UpdateDatosLaborales(PersonasDatosLaborales persona)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    string sql = @"update PersonasDatosLaborales set
                                       idpersona=@idpersona
                                      ,experiencia_laboral=@experiencia_laboral
                                      ,fecha_ingreso=@fecha_ingreso
                                      ,id_area=@id_area
                                      ,id_puesto=@id_puesto
                                      ,fecha_ingreso_puesto=@fecha_ingreso_puesto
                                      ,id_tipo_contrato=@id_tipo_contrato
                                      ,id_tipo_jornada=@id_tipo_jornada
                                      ,rotacion_turno=@rotacion_turno
                                      ,idpersona_bh=@idpersona_bh
                                    where id_personadatoslaboral=@id_personadatoslaboral ";

                    await db.ExecuteAsync(sql, new
                    {
                        persona.idpersona,
                        persona.experiencia_laboral,
                        persona.fecha_ingreso,
                        persona.id_area,
                        persona.id_puesto,
                        persona.fecha_ingreso_puesto,
                        persona.id_tipo_contrato,
                        persona.id_tipo_jornada,
                        persona.rotacion_turno,
                        persona.idpersona_bh,
                        persona.id_personadatoslaboral
                    });
                    var idInserted = persona.id_personadatoslaboral;
                    return idInserted;
                }
                catch (Exception e)
                {
                    return 0;
                }
            }
        }

        public PersonasDatosLaborales ConsultarDatosLaborales(int idpersona)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    string sql = @"select
	                                   id_personadatoslaboral
                                      ,idpersona
                                      ,experiencia_laboral
                                      ,fecha_ingreso
                                      ,id_area
                                      ,id_puesto
                                      ,fecha_ingreso_puesto
                                      ,id_tipo_contrato
                                      ,id_tipo_jornada
                                      ,rotacion_turno
                                      ,idpersona_bh
                                    from PersonasDatosLaborales where idpersona=@idpersona";


                    var lista = db.Query<PersonasDatosLaborales>(
                            sql,
                            param: new { idpersona })
                        .FirstOrDefault();

                    return lista;
                }
                catch (Exception e)
                {
                    throw;
                }
            }
        }

        public async Task<int> InsertarResultadosEncuestas(EncuestaResultadoRequestModel encuesta)
        {
            using (IDbConnection db = CreateConnection())
            {
                try
                {
                    string sql = @"INSERT INTO EncuestaResultado
                                           (id_encuesta_persona
                                           ,resultados_cuestionario
                                           ,cuerpo_html)
                                     VALUES
                                           (@id_encuesta_persona
                                           ,@resultados_cuestionario
                                           ,@cuerpo_html)";

                    var idInserted = await db.QuerySingleAsync<int>(sql, new { encuesta.id_encuesta_persona, encuesta.resultados_cuestionario, encuesta.cuerpo_html });

                    return idInserted;
                }
                catch (Exception e)
                {
                    return 0;
                }
            }
        }


    }


    [Table("Encuesta")]
    public class Encuesta
    {
        public int id_encuesta { get; set; }
        public int id_tipo_encuesta { get; set; }
        public string nom_cuestionario { get; set; }
        public int id_encuesta_bh { get; set; }
    }

    [Table("EncuestaSeccion")]
    public class EncuestaSeccion
    {
        public int id_seccion { get; set; }
        public int id_encuesta { get; set; }
        public string nombre_seccion { get; set; }
        public int id_seccion_bh { get; set; }
    }

    [Table("EncuestaPregunta")]
    public class EncuestaPregunta
    {
        public int id_pregunta { get; set; }
        public int id_seccion { get; set; }
        public string texto_pregunta { get; set; }
        public int tipo_pregunta { get; set; }
        public int id_pregunta_bh { get; set; }
    }

    [Table("EncuestaPreguntaOpciones")]
    public class EncuestaPreguntaOpciones
    {
        public int id_preguntaopciones { get; set; }
        public int id_pregunta { get; set; }
        public string texto_preguntaopcion { get; set; }
        public int id_respuesta_bh { get; set; }
    }

    [Table("PersonasDatosLaborales")]
    public class PersonasDatosLaborales
    {
        public int id_personadatoslaboral { get; set; }
        public int idpersona { get; set; }
        public int experiencia_laboral { get; set; }
        public DateTime fecha_ingreso { get; set; }
        public int id_area { get; set; }
        public int id_puesto { get; set; }
        public DateTime fecha_ingreso_puesto { get; set; }
        public string id_tipo_contrato { get; set; }
        public string id_tipo_jornada { get; set; }
        public string rotacion_turno { get; set; }
        public int idpersona_bh { get; set; }
        public PersonasViewModel PersonaDatosBasicos { get; set; }
    }

    [Table("EncuestaEmpresa")]
    public class EncuestaEmpresa
    {
        public int IdCuestionarioEmpresa { get; set; }
        public int IdEmpresa { get; set; }
        public int NumeroEmpleados { get; set; }
        public int IdEmpresaBH { get; set; }
    }


}
