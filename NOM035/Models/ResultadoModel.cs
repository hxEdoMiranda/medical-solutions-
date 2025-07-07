using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nom035.Models
{
    // Clases para servicio de Resultados porcentajes
    public class ResultadoRequestModel
    {
        public string master_key { get; set; }
        public int id_periodo { get; set; }
        public int id_area { get; set; }
        public int id_empresa { get; set; }
        public int id_puesto { get; set; }
        public int id_usuario { get; set; }
        public int id_usuario_medi { get; set; }
        public int id_encuesta { get; set; }
    }
    public class ResultadoPorcentajeResponseModel : RespuestaModel
    {
        public PorcentajeDataModel data { get; set; }
    }
    public class PorcentajeDataModel
    {
        public int cuestionarios_solicitados { get; set; }
        public int cuestionarios_respondidos { get; set; }
        public decimal porcentaje_respondidos { get; set; }
        public decimal porcentaje_no_respondidos { get; set; }
        public int cantidad_cuestionarios_1 { get; set; }
        public int contestados_cuestionarios_1 { get; set; }
        public decimal porcentaje_contestado_1 { get; set; }
        public int cantidad_cuestionarios_2 { get; set; }
        public int contestados_cuestionarios_2 { get; set; }
        public decimal porcentaje_contestado_2 { get; set; }
        public int cantidad_cuestionarios_3 { get; set; }
        public int contestados_cuestionarios_3 { get; set; }
        public decimal porcentaje_contestado_3 { get; set; }
    }

    // Clases para servicio de Resultados cuestionario 1
    public class ResultadoCuestionario1ResponseModel : RespuestaModel
    {
        public ResultadoCuestionario1Model data { get; set; }
    }
    public class ResultadoCuestionario1Model
    {
        public List<ResultadoCuestionario1DataModel> resultados { get; set; }
        public string tabla_html { get; set; }
        public int porcentaje_requiere_atencion { get; set; }
        public int porcentaje_no_requieren_atencion { get; set; }
    }
    public class ResultadoCuestionario1DataModel
    {
        public int id_empleado { get; set; }
        public int numero_empleado { get; set; }
        public int id_cuestionario_respondido { get; set; }
        public string nombre_empleado { get; set; }
        public bool cuidado_clinico { get; set; }
    }
    // Fin clases

    // Clases para servicio de Resultados cuestionario 2 y 3
    public class ResultadoCuestionario2ResponseModel : RespuestaModel
    {
        public ResultadoCuestionario2Model data { get; set; }
    }
    public class ResultadoCuestionario2Model
    {
        public ResultadoCuestionario2DataModel resultados { get; set; }
        public string tabla_html { get; set; }
    }
    public class ResultadoCuestionario2DataModel
    {
        public ResultadoNivelesRiesgoModel niveles_riesgo { get; set; }
        public List<ResultadoEmpleadoDataModel> empleados { get; set; }
    }
    public class ResultadoNivelesRiesgoModel
    {
        public int resultado_nulo { get; set; }
        public int resultado_bajo { get; set; }
        public int resultado_medio { get; set; }
        public int resultado_alto { get; set; }
        public int resultado_muy_alto { get; set; }
    }
    public class ResultadoEmpleadoDataModel
    {
        public int id_empleado { get; set; }
        public int numero_empleado { get; set; }
        public int id_cuestionario_respondido { get; set; }
        public string nombre { get; set; }
        public string nivel_riesgo { get; set; }
        public string color { get; set; }
    }
    // Fin clases

    // Clases para servicio de Resultados individuales cuestionario 1
    public class ResultadoDatosUsuarioModel
    {
        public int num_empleado { get; set; }
        public string nombre { get; set; }
        public int edad { get; set; }
        public string genero { get; set; }
        public string estado_civil { get; set; }
        public int experiencia_laboral { get; set; }
        public int tiempo_en_empresa { get; set; }
        public string nombre_area { get; set; }
        public string puesto { get; set; }
        public int tiempo_en_puesto { get; set; }
        public string tipo_contrato { get; set; }
        public string tipo_jornada { get; set; }
        public string rotacion_turno { get; set; }
    }
    public class ResultadoIndividual1ResponseModel : RespuestaModel
    {
        public ResultadoIndividual1DataModel data { get; set; }
    }
    public class ResultadoIndividual1DataModel
    {
        public ResultadoDatosUsuarioModel datos_de_usuario { get; set; }
        public string resultados_cuestionario_1 { get; set; }
        public ResultadoPorSeccionModel resultados_por_seccion { get; set; }
        public List<ResultadoDetalleSeccionModel> detalles_de_seccion { get; set; }
        public string tabla_html { get; set; }
    }
    public class ResultadoPorSeccionModel
    {
        public int resultado_seccion_1 { get; set; }
        public int resultado_seccion_2 { get; set; }
        public int resultado_seccion_3 { get; set; }
        public int resultado_seccion_4 { get; set; }
    }
    public class ResultadoDetalleSeccionModel
    {
        public int id_seccion { get; set; }
        public int numero_seccion { get; set; }
        public string nombre_seccion { get; set; }
        public List<ResultadoSeccionPreguntaModel> preguntas { get; set; }
    }
    public class ResultadoSeccionPreguntaModel
    {
        public int num_pregunta { get; set; }
        public string pregunta { get; set; }
        public string valor { get; set; }
        public string opcion { get; set; }
    }

    // Fin clases

    // Clases para servicio de Resultados individuales cuestionario 2 y 3
    public class ResultadoIndividual2ResponseModel : RespuestaModel
    {
        public ResultadoIndividual2DataModel data { get; set; }
    }
    public class ResultadoIndividual2DataModel
    {
        public ResultadoDatosUsuarioModel datos_de_usuario { get; set; }
        public ResultadoResultadosModel resultados { get; set; }
        public List<ResultadoPor_SeccionModel> por_seccion { get; set; }
        public List<ResultadoPor_DominioModel> por_dominio { get; set; }
        public string tabla_html { get; set; }
    }
    public class ResultadoResultadosModel
    {
        public int puntuacion { get; set; }
        public string etiqueta { get; set; }
    }
    public class ResultadoPor_SeccionModel
    {
        public int id { get; set; }
        public string section { get; set; }
        public int score { get; set; }
        public string nivel_riesgo { get; set; }
    }
    public class ResultadoPor_DominioModel
    {
        public string domain { get; set; }
        public int score { get; set; }
        public string nivel_riesgo { get; set; }
    }
    // Fin clases

    // Clases para tabla EncuestaResultado
    public class EncuestaResultadoRequestModel
    {
        public int id_encuesta_persona { get; set; }
        public string resultados_cuestionario { get; set; }
        public string cuerpo_html { get; set; }
    }
    // Fin clases
}

