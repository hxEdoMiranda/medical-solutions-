using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class Medicamentos
    {
        public int Id { get; set; }
        public string Codigo { get; set; }
        public string PrincipioActivo { get; set; }
        public string PresentacionFarmaceutica { get; set; }
        public string Estado { get; set; }
        public string Posologia { get; set; }
        public string? product_id { get; set; }
        public string? product_name { get; set; }
        public string? formula_id { get; set; }
        public string? formula_name { get; set; }
        public string? product_logo { get; set; }
        public string? active_principle_id { get; set; }
        public string? active_principle_name { get; set; }
        public bool? is_product { get; set; }
        public string? laboratory_name { get; set; }
        public string? presentation { get; set; }
        public string? category { get; set; }
        public int IsComercial { get; set; }
        public string? minimal_price { get; set; }
        public bool? has_benefit { get; set; }
        public string? reference_price { get; set; }
        public string? benefit_price { get; set; }
        public string? info_benefit { get; set; }
        public string? benefit_percentage { get; set; }
        public string? prescription { get; set; }
        public int? prescription_id { get; set; }
        public string CodigoPais { get; set; }
    }
}
