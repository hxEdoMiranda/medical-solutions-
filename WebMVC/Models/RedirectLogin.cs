namespace WebMVC.Models
{
    public class RedirectLogin
    {
        public int UserId { get; set; } 
        public string UserName { get; set; }
        public int Timestamp { get; set; } //Timestamp en el que fue generado 
        public int IdCliente { get; set; }   
        public string Url { get; set; }
        public bool PreHome { get; set; }
    }
}
