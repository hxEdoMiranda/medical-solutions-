using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    /// <summary>
    /// Modelo para respuesta de peticiones GET o las que solo retornan datos en servicio
    /// </summary>
    public class RespuestaModel
    {
        public string result_code { get; set; }
        public string message { get; set; }
    }

    /// <summary>
    /// Modelo para respuesta de peticiones POST o que insertan nuevos registros en servicio
    /// </summary>
    public class ResponseModel
    {
        public string result_code { get; set; }
        public string message { get; set; }
        public string data { get; set; }
    }

    public class RespModel
    {
        public string status { get; set; }
        public string err { get; set; }
        public string msg { get; set; }
    }
}
