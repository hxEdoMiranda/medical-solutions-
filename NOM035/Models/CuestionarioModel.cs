using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nom035.Models
{
    public class CuestionarioRequestModel
    {
        public string master_key { get; set; }
        public int id_empresa { get; set; }
        public int id_cuestionario { get; set; }
        public int? id_usuario { get; set; }
        public int? id_cuestionario_respondido { get; set; }
        public int? id_seccion { get; set; }
    }
    public class RespuestaRequestModel
    {
        public string master_key { get; set; }
        public int id_cuestionario_respondido { get; set; }
        public int id_usuario { get; set; }
        public int id_cuestionario { get; set; }
        public int id_seccion { get; set; }
        public int id_pregunta { get; set; }
        public int id_opcion { get; set; }
        public int valor { get; set; }
        public int id_preguntaopciones { get; set; }
        public int idCuestionarioPersona { get; set; }
    }
    public class CuestionarioResponseModel : RespuestaModel
    {
        public List<CuestionarioDataModel> data { get; set; }
    }
    public class CuestionarioDataModel
    {
        public int id_seccion { get; set; }
        public int questionnaire_id { get; set; }
        public int id_cuestionariorespondido { get; set; }
        public int section_number { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string value { get; set; }
        public DateTime creation_date { get; set; }
        public List<QuestionsDataModel> questions { get; set; }
    }
    public class QuestionsDataModel
    {
        public int question_id { get; set; }
        public int question_number { get; set; }
        public string question { get; set; }
        public string help_text { get; set; }
        public string value { get; set; }
        public string is_critic { get; set; }
        public string upload_photo { get; set; }
        public string max_char { get; set; }
        public string type { get; set; }
        public string question_result { get; set; }
        public List<OptionsDataModel> options { get; set; }
        public List<RespondidoDataModel> respondido { get; set; }
    }
    public class OptionsDataModel
    {
        public int option_id { get; set; }
        public string question_option { get; set; }
        public string value { get; set; }
        public int id_preguntaopciones { get; set; }
        public int id_pregunta { get; set; }
        public int id_respuesta_bh { get; set; }
    }
    public class RespondidoDataModel
    {
        public int option_id { get; set; }
        public string question_option { get; set; }
        public string value { get; set; }
    }

    public class SeccionResponseModel : RespuestaModel
    {
        public List<SeccionDataModel> data { get; set; }
    }
    public class SeccionDataModel
    {
        public int id_cuestionario { get; set; }
        public int num_seccion { get; set; }
    }
    // Clases para servicio de consultar la última pregunta respondida
    public class UltimaRespuestaRequestModel
    {
        public string master_key { get; set; }
        public int id_cuestionario_respondido { get; set; }
    }

    public class UltimaRespuestaResponseModel : RespuestaModel
    {
        public UltimaRespuestaDataModel data { get; set; }
    }
    public class UltimaRespuestaDataModel
    {
        public int id_respuesta { get; set; }
        public int id_cuestionario_respondido { get; set; }
        public int id_cuestionario { get; set; }
        public int id_seccion { get; set; }
        public int id_pregunta { get; set; }
        public OpcionDataModel id_opcion { get; set; }
        public int valor { get; set; }
        public int fecha_respuesta { get; set; }
        public int hora_respuesta { get; set; }
        public int fecha_alta { get; set; }
    }
    public class OpcionDataModel
    {
        public int opcion { get; set; }
        public int valor { get; set; }
        public DateTime fecha_alta { get; set; }
    }
    public class EncuestaPersonaModel
    {
        public int id_encuesta_persona { get; set; }
        public int id_encuesta { get; set; }
        public int id_persona { get; set; }
        public DateTime fecha_inicio_diligencia { get; set; }
        public DateTime fecha_fin_diligencia { get; set; }
        public int id_cuestionario_respondido { get; set; }

        public int id_empresa { get; set; }
    }
    public class EncuestaRespuestaModel
    {
        public int id_respuesta { get; set; }
        public int id_pregunta { get; set; }
        public int id_encuesta_persona { get; set; }
        public int id_preguntaopciones { get; set; }
        public string texto_respuesta { get; set; }
        public bool enviada { get; set; }
    }
    public class EncuestaAvanceModel
    {
        public decimal preguntas { get; set; }
        public decimal respuestas { get; set; }
        public decimal porcentaje { get; set; }
    }

    public class TestOcupacionalesResult
    {
        public string audiometria_Oido_izquierdo { get; set; }
        public string audiometria_Oido_derecho { get; set; }
        public string colometria_Ojo_izquierdo { get; set; }
        public string colometria_Ojo_derecho { get; set; }
        public string visiometria_Ojo_izquierdo { get; set; }
        public string visiometria_Ojo_derecho { get; set; }
        public string lectura_Ojo_izquierdo { get; set; }
        public string lectura_Ojo_derecho { get; set; }
    }

    public class EncuestaComentario
    { 

        public string Comentario { get; set; }
        //public DateTime fechaIngreso { get; set;}
        public int id_Cliente { get; set; }
    }

    public class EncuestaComentarioEmpresa
    {
        public string correo_Cliente { get; set; }   
        public string id_Cliente { get; set;}
        public string asunto { get; set; }
        public string body { get; set; }
        public bool estado { get; set; }= false;
    }
    // Fin clases
}
