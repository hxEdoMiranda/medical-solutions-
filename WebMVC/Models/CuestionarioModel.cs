using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
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
    }
    public class CuestionarioResponseModel : RespuestaModel
    {
        public List<CuestionarioDataModel> data { get; set; }
    }
    public class CuestionarioDataModel
    {
        public int id_seccion { get; set; }
        public int questionnaire_id { get; set; }
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
        public int id_pregunta { get; set; }
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
    public class EmpresaEncuestaModel
    {
        public int id { get; set; }
        public string nombre_comercial { get; set; }
        public string razon_social { get; set; }
        public string cantidad_empleados { get; set; }
        public string rfc { get; set; }
        public int IdEmpresaBH { get; set; }
        public int idpersona_bh { get; set; }
        public int idpersona { get; set; }
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
    public class EncuestaComentarioEmpresa
    {
        public string correo_Cliente { get; set; }
        public string id_Cliente { get; set; }
        public string asunto { get; set; }
        public string body { get; set; }
        public bool estado { get; set; } = false;
    }
}
