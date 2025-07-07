using System;
using System.Collections.Generic;

namespace WebMVC.Models
{
    public class CuestionarioSueno
    {
        public int id { get; set; }
        public int id_usuario { get; set; }
        public int id_cliente { get; set; }
        public string hora_Acostarse { get; set; }
        public string tiempo_Dormirse { get; set; }
        public string hora_Levantarse { get; set; }
        public int horas_Dormidas { get; set; }
        public Problemas_Dormir Problemas_Dormir { get; set; }
        public string calidad_Sueno { get; set; }
        public string medicinas_Dormir { get; set; }
        public string somnolencia_Actividades { get; set; }
        public string animos_Realizar_Actividades { get; set; }
        public string dormir_Acompanado { get; set; }
        public DateTime fecha_registro { get; set; }
        public object configuration { get; set; }
    }
    public class Problemas_Dormir
    {
        public string sentir_calor { get; set; }
        public string levantarse_ir_servicio { get; set; }
        public string no_respirar_bien { get; set; }
        public string pesadillas_malos_suenos { get; set; }
        public string primera_media_hora { get; set; }
        public string sentir_frio { get; set; }
        public string sufrir_dolores { get; set; }
        public string toser_roncar { get; set; }
        public string despertar_noche_madrugada { get; set; }
        public Dictionary<string, string> otras_razones { get; set; }

    }
    public class ResponseGetCuestionarioSueno
    {
        public string status { get; set; }
        public CuestionarioSueno cuestionario { get; set; }

    }
}
