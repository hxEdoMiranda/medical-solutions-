using Dapper.Contrib.Extensions;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;

namespace WebMVC.Models
{
    public class InvoiceConfig
    {
        public long Id { get; set; }
        public int IdEmpresa { get; set; }
        public int Periodo { get; set; }
        public int TiempoEspera { get; set; }
        public bool Estado { get; set; }
        public string? PreapprovalPlanId { get; set; }
    }
}
