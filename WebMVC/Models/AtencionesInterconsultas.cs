using Dapper.Contrib.Extensions;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;

namespace WebMVC.Models
{
    public class AtencionesInterconsultas
    {
        public int Id { get; set; }
        public int IdAtencion { get; set; }
        public int IdInterconsulta { get; set; }
        public int Estado { get; set; }

    }
}

