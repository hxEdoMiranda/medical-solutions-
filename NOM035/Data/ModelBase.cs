using Dapper.Contrib.Extensions;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace Nom035.Data
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
