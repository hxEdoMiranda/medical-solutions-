using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nom035.Models
{
    public class AreaRequestModel
    {
        public string master_key { get; set; }
        public int id_area { get; set; }
        public string nombre_area { get; set; }
        public int id_empresa { get; set; }
    }
    public class AreaResponseModel : RespuestaModel
    {
        public List<AreaDataModel> data { get; set; }
    }
    public class AreaDataModel
    {        
        public int id_area { get; set; }
        public int IdEmpresa { get; set; }
        public string nombre_area { get; set; }
        public int id_area_bh { get; set; }
    }
}
