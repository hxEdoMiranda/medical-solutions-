using System.Collections;
using System.Collections.Generic;

namespace WebMVC.Models
{
    public class DtoAfiliadoPositiva
    {
        public string id_tipo_doc_emp { get; set; }
        public string id_empresa { get; set; }
        public string razon_social { get; set; }
        public string id_tipo_doc_per { get; set; }
        public string id_persona { get; set; }
        public string nombre1 { get; set; }
        public string nombre2 { get; set; }
        public string apellido1 { get; set; }
        public string apellido2 { get; set; }
        public string sexo { get; set; }
        public string fecha_inicio_vinculacion { get; set; }
        public string fecha_nacimiento { get; set; }
        public int id_afp { get; set; }
        public string nombre_afp { get; set; }
        public string id_eps { get; set; }
        public string nombre_eps { get; set; }
        public string direccion_persona { get; set; }
        public int id_arp { get; set; }
        public string nombre_arp { get; set; }
        public int id_ocupacion { get; set; }
        public string nombre_ocupacion { get; set; }
        public double salario_mensual { get; set; }
        public int id_departamento { get; set; }
        public string nombre_departamento { get; set; }
        public int id_municipio { get; set; }
        public string nombre_municipio { get; set; }
    }

    public class ResponseAfiliadoPositiva
    {
        public List<DtoAfiliadoPositiva> message { get; set; }

        public string status;

    }
}
