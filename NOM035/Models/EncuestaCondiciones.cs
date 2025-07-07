using Dapper;
using Dapper.Contrib.Extensions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Globalization;
using Microsoft.Extensions.Configuration;
using Nom035.Data;
using System.Reflection;

namespace Encuestas.API.Models
{
    public class EncuestaCondiciones
    {
        public string Titulo { get; set; }
        public List<Condiciones> Condiciones { get; set; }
    }

    public class Condiciones
    {
        public string Condicion { get; set; }
        public string Asset_url { get; set; }
    }
}
