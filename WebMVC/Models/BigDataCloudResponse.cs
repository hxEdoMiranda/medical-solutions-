using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{

    public class BigDataCloudResponse
    {
        public string ip { get; set; }
        public string localityLanguageRequested { get; set; }
        public bool isReachableGlobally { get; set; }
        public Country country { get; set; }
        public Location location { get; set; }
        public DateTime lastUpdated { get; set; }
        public Network network { get; set; }
        public string confidence { get; set; }
        public Confidencearea[] confidenceArea { get; set; }
        public string securityThreat { get; set; }
        public Hazardreport hazardReport { get; set; }
    }

    public class Country
    {
        public string isoAlpha2 { get; set; }
        public string isoAlpha3 { get; set; }
        public int m49Code { get; set; }
        public string name { get; set; }
        public string isoName { get; set; }
        public string isoNameFull { get; set; }
        public Isoadminlanguage[] isoAdminLanguages { get; set; }
        public string unRegion { get; set; }
        public Currency currency { get; set; }
        public Wbregion wbRegion { get; set; }
        public Wbincomelevel wbIncomeLevel { get; set; }
        public string callingCode { get; set; }
        public string countryFlagEmoji { get; set; }
        public string wikidataId { get; set; }
        public int geonameId { get; set; }
        public Continent[] continents { get; set; }
    }

    public class Currency
    {
        public int numericCode { get; set; }
        public string code { get; set; }
        public string name { get; set; }
        public int minorUnits { get; set; }
    }

    public class Wbregion
    {
        public string id { get; set; }
        public string iso2Code { get; set; }
        public string value { get; set; }
    }

    public class Wbincomelevel
    {
        public string id { get; set; }
        public string iso2Code { get; set; }
        public string value { get; set; }
    }

    public class Isoadminlanguage
    {
        public string isoAlpha3 { get; set; }
        public string isoAlpha2 { get; set; }
        public string isoName { get; set; }
        public string nativeName { get; set; }
    }

    public class Continent
    {
        public string continent { get; set; }
        public string continentCode { get; set; }
    }

    public class Location
    {
        public string continent { get; set; }
        public string continentCode { get; set; }
        public string isoPrincipalSubdivision { get; set; }
        public string isoPrincipalSubdivisionCode { get; set; }
        public string city { get; set; }
        public string localityName { get; set; }
        public string postcode { get; set; }
        public float latitude { get; set; }
        public float longitude { get; set; }
        public string plusCode { get; set; }
        public Timezone timeZone { get; set; }
        public Localityinfo localityInfo { get; set; }
    }

    public class Timezone
    {
        public string ianaTimeId { get; set; }
        public string displayName { get; set; }
        public string effectiveTimeZoneFull { get; set; }
        public string effectiveTimeZoneShort { get; set; }
        public int utcOffsetSeconds { get; set; }
        public string utcOffset { get; set; }
        public bool isDaylightSavingTime { get; set; }
        public DateTime localTime { get; set; }
    }

    public class Localityinfo
    {
        public Administrative[] administrative { get; set; }
        public Informative[] informative { get; set; }
    }

    public class Administrative
    {
        public int order { get; set; }
        public int adminLevel { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string isoName { get; set; }
        public string isoCode { get; set; }
        public string wikidataId { get; set; }
        public int geonameId { get; set; }
    }

    public class Informative
    {
        public int order { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string isoCode { get; set; }
        public string wikidataId { get; set; }
        public int geonameId { get; set; }
    }

    public class Network
    {
        public string registry { get; set; }
        public string registryStatus { get; set; }
        public string registeredCountry { get; set; }
        public string registeredCountryName { get; set; }
        public string organisation { get; set; }
        public bool isReachableGlobally { get; set; }
        public bool isBogon { get; set; }
        public string bgpPrefix { get; set; }
        public string bgpPrefixNetworkAddress { get; set; }
        public string bgpPrefixLastAddress { get; set; }
        public int totalAddresses { get; set; }
        public Carrier[] carriers { get; set; }
        public Viacarrier[] viaCarriers { get; set; }
    }

    public class Carrier
    {
        public string asn { get; set; }
        public int asnNumeric { get; set; }
        public string organisation { get; set; }
        public string name { get; set; }
        public string registry { get; set; }
        public string registeredCountry { get; set; }
        public string registeredCountryName { get; set; }
        public string registrationDate { get; set; }
        public string registrationLastChange { get; set; }
        public int totalIpv4Addresses { get; set; }
        public int totalIpv4Prefixes { get; set; }
        public int totalIpv4BogonPrefixes { get; set; }
        public int rank { get; set; }
        public string rankText { get; set; }
    }

    public class Viacarrier
    {
        public string asn { get; set; }
        public int asnNumeric { get; set; }
        public string organisation { get; set; }
        public string registeredCountry { get; set; }
        public string registeredCountryName { get; set; }
        public int totalIpv4Addresses { get; set; }
        public int rank { get; set; }
    }

    public class Hazardreport
    {
        public bool isKnownAsTorServer { get; set; }
        public bool isKnownAsVpn { get; set; }
        public bool isKnownAsProxy { get; set; }
        public bool isSpamhausDrop { get; set; }
        public bool isSpamhausEdrop { get; set; }
        public bool isSpamhausAsnDrop { get; set; }
        public bool isBlacklistedUceprotect { get; set; }
        public bool isBlacklistedBlocklistDe { get; set; }
        public bool isKnownAsMailServer { get; set; }
        public bool isKnownAsPublicRouter { get; set; }
        public bool isBogon { get; set; }
        public bool isUnreachable { get; set; }
        public int hostingLikelihood { get; set; }
        public bool isHostingAsn { get; set; }
        public bool isCellular { get; set; }
    }

    public class Confidencearea
    {
        public float latitude { get; set; }
        public float longitude { get; set; }
    }

}
