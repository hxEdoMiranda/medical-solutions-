namespace Encuestas.API.Models
{
    public class LogNom035
    {
        public string mensaje { get; set; } = "";
        public LogNom035Datos data { get; set; } = new LogNom035Datos();
    }
    public class LogNom035Datos
    {
        public string url { get; set; } = "";
        public object body { get; set; } = null;
        public object response { get; set; } = null;
        public string MsgError { get; set; } = "";
        public object ex { get; set; } = null;
    }
}
