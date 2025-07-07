using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper.Contrib.Extensions;
using Microsoft.Extensions.Configuration;

namespace Encuestas.API.Models
{
    public class ModelBase  
    {
        [Computed]
        public IConfiguration Configuration { get; set; }
        public IDbConnection CreateConnection()
        {
            var connection = new SqlConnection(Configuration.GetConnectionString("MedismartDBContext"));
            // Properly initialize your connection here.
            return connection;
        }
    }
}
