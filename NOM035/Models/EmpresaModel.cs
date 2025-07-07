using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nom035.Models
{
    public class EmpresaRequestModel
    {
        public string master_key { get; set; }
        public string nombre_comercial { get; set; }    //Obligatorio
        public string razon_social { get; set; }
        public string telefono { get; set; }
        public string calle_numero { get; set; }
        public string colonia { get; set; }
        public string municipio { get; set; }
        public string estado { get; set; }
        public string codigo_postal { get; set; }  
        public string cantidad_empleados { get; set; }  //Obligatorio
        public string rfc { get; set; } //Obligatorio
    }
    public class EmpresasResponseModel : RespuestaModel
    {
        public List<EmpresasDataModel> data { get; set; }
    }
    public class EmpresasDataModel
    {
        public string id { get; set; }
        public string trade_name { get; set; }
        public string business_name { get; set; }
    }
    public class EmpresaResponseModel : RespuestaModel
    {
        public EmpresaDataModel data { get; set; }
    }
    public class EmpresaDataModel
    {
        public int id { get; set; }
        public string nombre_comercial { get; set; }
        public string razon_social { get; set; }
        public string telefono { get; set; }
        public string calle_numero { get; set; }
        public string colonia { get; set; }
        public string municipio { get; set; }
        public string estado { get; set; }
        public string codigo_postal { get; set; }
        public DateTime creation_date { get; set; }
        public DateTime modify_date { get; set; }
        public string cantidad_empleados { get; set; }
        public string rfc { get; set; }
        public string estatus { get; set; }
        public int IdEmpresaBH { get; set; }
        public int idpersona_bh { get; set; }
        public int idpersona { get; set; }
        public DateTime fechacreacion { get; set; }
    }
}
