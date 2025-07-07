using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nom035.Models
{
    public class PuestoRequestModel
    {
        public string master_key { get; set; }
        public int id_puesto { get; set; }
        public string nombre_puesto { get; set; }
        public int id_area{ get; set; }
    }
    public class PuestoResponseModel : RespuestaModel
    {
        public List<PuestoDataModel> data { get; set; }
    }
    public class PuestoDataModel
    {
        public int id_puesto { get; set; }
        public int id_area { get; set; }
        public string nombre_puesto { get; set; }
        public int id_puesto_bh { get; set; }
    }
}
