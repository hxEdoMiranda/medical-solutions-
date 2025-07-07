using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nom035.Models
{
    public class PeriodoRequestModel
    {

        public string master_key { get; set; }
        public int? id_empresa { get; set; }
        public int? id_periodo { get; set; }
        public string fecha_inicio { get; set; }
        public string fecha_fin { get; set; }
        public int? cuestionarios_disponibles { get; set; }
        public string nombre { get; set; }
        public int id_periodo_bh { get; set; }
    }
    public class PeriodoEmpresaResponseModel : RespuestaModel
    {
        public List<PeriodoEmpresaDataModel> data { get; set; }
    }
    public class PeriodoEmpresaDataModel
    {
        public int id_periodo { get; set; }
        public DateTime periodo_inicio { get; set; }
        public DateTime periodo_fin { get; set; }
        public int num_inscritos { get; set; }
        public string nombre_periodo { get; set; }
    }
    public class PeriodoUsuarioResponseModel : RespuestaModel
    {
        public List<PeriodoUsuarioDataModel> data { get; set; }
    }
    public class PeriodoUsuarioDataModel
    {
        public int id_usuario { get; set; }
        public int id_periodo { get; set; }
        public string nombre_periodo { get; set; }
    }

}
