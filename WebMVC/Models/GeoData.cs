using System.Collections.Generic;

namespace WebMVC.Models
{
    public class GeoData
    {
        public string ip { get; set; }
        public string localityLanguageRequested { get; set; }
        public bool isReachableGlobally { get; set; }
        public GeoDataCountry country { get; set; }
    }

    public class GeoDataCountry
    {
        public string isoAlpha2 { get; set; }
        public string isoAlpha3 { get; set; }
        public int m49Code { get; set; }
        public string name { get; set; }
        public string isoName { get; set; }
        public string isoNameFull { get; set; }
        public string unRegion { get; set; }
        public string callingCode { get; set; }
        public string countryFlagEmoji { get; set; }
        public string wikidataId { get; set; }
        public int geonameId { get; set; }
    }

}
