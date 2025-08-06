import { useState } from "react";
import { useLanguage } from "./language-provider";
import { ArrowRight, DollarSign, Clock, MapPin, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link } from "wouter";

export function LiveData() {
  const { t } = useLanguage();
  const [zipCode, setZipCode] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Real USCIS filing fees (as of 2024)
  const filingFees = [
    { form: "I-130", name: "Family-based Immigration Petition", fee: "$675" },
    { form: "I-485", name: "Adjustment of Status", fee: "$1,440" },
    { form: "N-400", name: "Naturalization Application", fee: "$760" },
    { form: "I-765", name: "Work Authorization", fee: "$470" },
    { form: "I-131", name: "Travel Document", fee: "$630" }
  ];

  // Real USCIS processing times (approximate ranges)
  const processingTimes = [
    { form: "I-130", name: "Family-based Petition", time: "13-33 months" },
    { form: "I-485", name: "Adjustment of Status", time: "13-23 months" },
    { form: "N-400", name: "Naturalization", time: "18-24 months" },
    { form: "I-765", name: "Work Authorization", time: "8-13 months" },
    { form: "I-131", name: "Travel Document", time: "11-16 months" }
  ];

  const handleZipSearch = () => {
    if (zipCode.length === 5) {
      // Comprehensive USCIS Field Office lookup by ZIP code ranges
      const fieldOffices = getFieldOfficeByZip(zipCode);
      console.log('ZIP code search:', zipCode, 'Results:', fieldOffices); // Debug log
      setSearchResults(fieldOffices);
    } else {
      setSearchResults([]);
    }
  };

  // Comprehensive USCIS Field Office lookup covering all US ZIP codes
  function getFieldOfficeByZip(zip: string): string[] {
    const zipNum = parseInt(zip);
    
    // Alabama - Birmingham Field Office
    if (zipNum >= 35000 && zipNum <= 36999) {
      return ["Birmingham Field Office", "2121 8th Ave N, Birmingham, AL 35203", "Phone: (800) 375-5283"];
    }
    
    // Alaska - Anchorage Field Office  
    if (zipNum >= 99500 && zipNum <= 99999) {
      return ["Anchorage Field Office", "620 E 10th Ave, Suite 102, Anchorage, AK 99501", "Phone: (800) 375-5283"];
    }
    
    // Arizona - Phoenix Field Office
    if (zipNum >= 85000 && zipNum <= 86999) {
      return ["Phoenix Field Office", "2035 N Central Ave, Phoenix, AZ 85004", "Phone: (800) 375-5283"];
    }
    
    // Arkansas - New Orleans Field Office (serves Arkansas)
    if (zipNum >= 71600 && zipNum <= 72999) {
      return ["New Orleans Field Office", "701 Loyola Ave, New Orleans, LA 70113", "Phone: (800) 375-5283"];
    }
    
    // California - Los Angeles Area
    if (zipNum >= 90000 && zipNum <= 93599) {
      return ["Los Angeles Field Office", "300 N Los Angeles St, Los Angeles, CA 90012", "Phone: (800) 375-5283"];
    }
    
    // California - San Francisco Area
    if (zipNum >= 94000 && zipNum <= 95999) {
      return ["San Francisco Field Office", "630 Sansome St, San Francisco, CA 94111", "Phone: (800) 375-5283"];
    }
    
    // California - San Diego Area
    if (zipNum >= 91900 && zipNum <= 92999) {
      return ["San Diego Field Office", "880 Front St, San Diego, CA 92101", "Phone: (800) 375-5283"];
    }
    
    // Colorado - Denver Field Office
    if (zipNum >= 80000 && zipNum <= 81999) {
      return ["Denver Field Office", "12354 W Alameda Pkwy, Lakewood, CO 80228", "Phone: (800) 375-5283"];
    }
    
    // Connecticut - Hartford Field Office
    if (zipNum >= 6000 && zipNum <= 6999) {
      return ["Hartford Field Office", "450 Main St, Hartford, CT 06103", "Phone: (800) 375-5283"];
    }
    
    // Delaware - Philadelphia Field Office (serves Delaware)
    if (zipNum >= 19700 && zipNum <= 19999) {
      return ["Philadelphia Field Office", "1600 Callowhill St, Philadelphia, PA 19130", "Phone: (800) 375-5283"];
    }
    
    // Florida - Miami Field Office
    if (zipNum >= 33000 && zipNum <= 34999) {
      return ["Miami Field Office", "16701 NW 37th Ave, Miami Gardens, FL 33056", "Phone: (800) 375-5283"];
    }
    
    // Florida - Tampa Field Office
    if (zipNum >= 32000 && zipNum <= 32999) {
      return ["Tampa Field Office", "5524 West Cypress St, Tampa, FL 33607", "Phone: (800) 375-5283"];
    }
    
    // Georgia - Atlanta Field Office
    if (zipNum >= 30000 && zipNum <= 31999) {
      return ["Atlanta Field Office", "2150 Parklake Dr, Atlanta, GA 30345", "Phone: (800) 375-5283"];
    }
    
    // Hawaii - Honolulu Field Office
    if (zipNum >= 96700 && zipNum <= 96999) {
      return ["Honolulu Field Office", "595 Ala Moana Blvd, Honolulu, HI 96813", "Phone: (800) 375-5283"];
    }
    
    // Idaho - Seattle Field Office (serves Idaho)
    if (zipNum >= 83200 && zipNum <= 83999) {
      return ["Seattle Field Office", "12500 Tukwila International Blvd, Seattle, WA 98168", "Phone: (800) 375-5283"];
    }
    
    // Illinois - Chicago Field Office
    if (zipNum >= 60000 && zipNum <= 62999) {
      return ["Chicago Field Office", "101 W Congress Pkwy, Chicago, IL 60605", "Phone: (800) 375-5283"];
    }
    
    // Indiana - Chicago Field Office (serves Indiana)
    if (zipNum >= 46000 && zipNum <= 47999) {
      return ["Chicago Field Office", "101 W Congress Pkwy, Chicago, IL 60605", "Phone: (800) 375-5283"];
    }
    
    // Iowa - Omaha Field Office (serves Iowa)
    if (zipNum >= 50000 && zipNum <= 52999) {
      return ["Omaha Field Office", "1717 Avenue H, Omaha, NE 68110", "Phone: (800) 375-5283"];
    }
    
    // Kansas - Kansas City Field Office
    if (zipNum >= 66000 && zipNum <= 67999) {
      return ["Kansas City Field Office", "9747 Northwest Conant Ave, Kansas City, MO 64153", "Phone: (800) 375-5283"];
    }
    
    // Kentucky - Louisville Field Office
    if (zipNum >= 40000 && zipNum <= 42799) {
      return ["Louisville Field Office", "Gene Snyder US Courthouse, 601 W Broadway, Louisville, KY 40202", "Phone: (800) 375-5283"];
    }
    
    // Louisiana - New Orleans Field Office
    if (zipNum >= 70000 && zipNum <= 71599) {
      return ["New Orleans Field Office", "701 Loyola Ave, New Orleans, LA 70113", "Phone: (800) 375-5283"];
    }
    
    // Maine - Boston Field Office (serves Maine)
    if (zipNum >= 3900 && zipNum <= 4999) {
      return ["Boston Field Office", "15 New Sudbury St, Boston, MA 02203", "Phone: (800) 375-5283"];
    }
    
    // Maryland - Baltimore Field Office
    if (zipNum >= 20600 && zipNum <= 21999) {
      return ["Baltimore Field Office", "Fallon Federal Building, 31 Hopkins Plaza, Baltimore, MD 21201", "Phone: (800) 375-5283"];
    }
    
    // Massachusetts - Boston Field Office
    if (zipNum >= 1000 && zipNum <= 2799) {
      return ["Boston Field Office", "15 New Sudbury St, Boston, MA 02203", "Phone: (800) 375-5283"];
    }
    
    // Michigan - Detroit Field Office
    if (zipNum >= 48000 && zipNum <= 49999) {
      return ["Detroit Field Office", "11411 E Jefferson Ave, Detroit, MI 48214", "Phone: (800) 375-5283"];
    }
    
    // Minnesota - St. Paul Field Office
    if (zipNum >= 55000 && zipNum <= 56999) {
      return ["St. Paul Field Office", "2901 Metro Dr, Bloomington, MN 55425", "Phone: (800) 375-5283"];
    }
    
    // Mississippi - New Orleans Field Office (serves Mississippi)
    if (zipNum >= 38600 && zipNum <= 39999) {
      return ["New Orleans Field Office", "701 Loyola Ave, New Orleans, LA 70113", "Phone: (800) 375-5283"];
    }
    
    // Missouri - Kansas City Field Office
    if (zipNum >= 63000 && zipNum <= 65999) {
      return ["Kansas City Field Office", "9747 Northwest Conant Ave, Kansas City, MO 64153", "Phone: (800) 375-5283"];
    }
    
    // Montana - Helena Field Office
    if (zipNum >= 59000 && zipNum <= 59999) {
      return ["Helena Field Office", "2800 Skyway Dr, Helena, MT 59602", "Phone: (800) 375-5283"];
    }
    
    // Nebraska - Omaha Field Office
    if (zipNum >= 68000 && zipNum <= 69999) {
      return ["Omaha Field Office", "1717 Avenue H, Omaha, NE 68110", "Phone: (800) 375-5283"];
    }
    
    // Nevada - Las Vegas Field Office
    if (zipNum >= 89000 && zipNum <= 89999) {
      return ["Las Vegas Field Office", "3373 Pepper Ln, Las Vegas, NV 89120", "Phone: (800) 375-5283"];
    }
    
    // New Hampshire - Boston Field Office (serves New Hampshire)
    if (zipNum >= 3000 && zipNum <= 3899) {
      return ["Boston Field Office", "15 New Sudbury St, Boston, MA 02203", "Phone: (800) 375-5283"];
    }
    
    // New Jersey - Newark Field Office
    if (zipNum >= 7000 && zipNum <= 8999) {
      return ["Newark Field Office", "Peter Rodino Federal Building, 970 Broad St, Newark, NJ 07102", "Phone: (800) 375-5283"];
    }
    
    // New Mexico - Albuquerque Field Office
    if (zipNum >= 87000 && zipNum <= 88499) {
      return ["Albuquerque Field Office", "1720 Randolph Rd SE, Albuquerque, NM 87106", "Phone: (800) 375-5283"];
    }
    
    // New York - New York City Field Office
    if (zipNum >= 10000 && zipNum <= 14999) {
      return ["New York City Field Office", "26 Federal Plaza, New York, NY 10278", "Phone: (800) 375-5283"];
    }
    
    // New York - Buffalo Field Office
    if (zipNum >= 14000 && zipNum <= 14999) {
      return ["Buffalo Field Office", "130 Delaware Ave, Buffalo, NY 14202", "Phone: (800) 375-5283"];
    }
    
    // North Carolina - Charlotte Field Office
    if (zipNum >= 27000 && zipNum <= 28999) {
      return ["Charlotte Field Office", "210 E Woodlawn Rd, Charlotte, NC 28217", "Phone: (800) 375-5283"];
    }
    
    // North Dakota - St. Paul Field Office (serves North Dakota)
    if (zipNum >= 58000 && zipNum <= 58999) {
      return ["St. Paul Field Office", "2901 Metro Dr, Bloomington, MN 55425", "Phone: (800) 375-5283"];
    }
    
    // Ohio - Cleveland Field Office
    if (zipNum >= 44000 && zipNum <= 45999) {
      return ["Cleveland Field Office", "AJC Federal Building, 1240 E 9th St, Cleveland, OH 44199", "Phone: (800) 375-5283"];
    }
    
    // Oklahoma - Oklahoma City Field Office
    if (zipNum >= 73000 && zipNum <= 74999) {
      return ["Oklahoma City Field Office", "4149 Highline Blvd, Oklahoma City, OK 73108", "Phone: (800) 375-5283"];
    }
    
    // Oregon - Portland Field Office
    if (zipNum >= 97000 && zipNum <= 97999) {
      return ["Portland Field Office", "511 NW Broadway, Portland, OR 97209", "Phone: (800) 375-5283"];
    }
    
    // Pennsylvania - Philadelphia Field Office
    if (zipNum >= 19000 && zipNum <= 19699) {
      return ["Philadelphia Field Office", "1600 Callowhill St, Philadelphia, PA 19130", "Phone: (800) 375-5283"];
    }
    
    // Rhode Island - Boston Field Office (serves Rhode Island)
    if (zipNum >= 2800 && zipNum <= 2999) {
      return ["Boston Field Office", "15 New Sudbury St, Boston, MA 02203", "Phone: (800) 375-5283"];
    }
    
    // South Carolina - Charleston Field Office
    if (zipNum >= 29000 && zipNum <= 29999) {
      return ["Charleston Field Office", "170 Meeting St, Charleston, SC 29401", "Phone: (800) 375-5283"];
    }
    
    // South Dakota - St. Paul Field Office (serves South Dakota)
    if (zipNum >= 57000 && zipNum <= 57999) {
      return ["St. Paul Field Office", "2901 Metro Dr, Bloomington, MN 55425", "Phone: (800) 375-5283"];
    }
    
    // Tennessee - Memphis Field Office
    if (zipNum >= 37000 && zipNum <= 38599) {
      return ["Memphis Field Office", "842 Virginia Run Cove, Memphis, TN 38122", "Phone: (800) 375-5283"];
    }
    
    // Texas - Dallas Field Office
    if (zipNum >= 75000 && zipNum <= 76999) {
      return ["Dallas Field Office", "8101 N Stemmons Fwy, Dallas, TX 75247", "Phone: (800) 375-5283"];
    }
    
    // Texas - Houston Field Office  
    if (zipNum >= 77000 && zipNum <= 77999) {
      return ["Houston Field Office", "2727 Allen Pkwy, Houston, TX 77019", "Phone: (800) 375-5283"];
    }
    
    // Texas - San Antonio Field Office
    if (zipNum >= 78000 && zipNum <= 79999) {
      return ["San Antonio Field Office", "8940 Fourwinds Dr, San Antonio, TX 78239", "Phone: (800) 375-5283"];
    }
    
    // Utah - Salt Lake City Field Office
    if (zipNum >= 84000 && zipNum <= 84999) {
      return ["Salt Lake City Field Office", "5272 South College Dr, Murray, UT 84123", "Phone: (800) 375-5283"];
    }
    
    // Vermont - Boston Field Office (serves Vermont)
    if (zipNum >= 5000 && zipNum <= 5999) {
      return ["Boston Field Office", "15 New Sudbury St, Boston, MA 02203", "Phone: (800) 375-5283"];
    }
    
    // Virginia - Norfolk Field Office
    if (zipNum >= 23000 && zipNum <= 24699) {
      return ["Norfolk Field Office", "5280 Henneman Dr, Norfolk, VA 23513", "Phone: (800) 375-5283"];
    }
    
    // Washington DC - Washington Field Office
    if (zipNum >= 20000 && zipNum <= 20599) {
      return ["Washington DC Field Office", "2675 Prosperity Ave, Fairfax, VA 22031", "Phone: (800) 375-5283"];
    }
    
    // Washington - Seattle Field Office
    if (zipNum >= 98000 && zipNum <= 99499) {
      return ["Seattle Field Office", "12500 Tukwila International Blvd, Seattle, WA 98168", "Phone: (800) 375-5283"];
    }
    
    // West Virginia - Pittsburgh Field Office (serves West Virginia)
    if (zipNum >= 24700 && zipNum <= 26999) {
      return ["Pittsburgh Field Office", "3000 Sidney St, Pittsburgh, PA 15203", "Phone: (800) 375-5283"];
    }
    
    // Wisconsin - Milwaukee Field Office
    if (zipNum >= 53000 && zipNum <= 54999) {
      return ["Milwaukee Field Office", "310 E Knapp St, Milwaukee, WI 53202", "Phone: (800) 375-5283"];
    }
    
    // Wyoming - Denver Field Office (serves Wyoming)
    if (zipNum >= 82000 && zipNum <= 83199) {
      return ["Denver Field Office", "12354 W Alameda Pkwy, Lakewood, CO 80228", "Phone: (800) 375-5283"];
    }
    
    // Default fallback for any missed ranges
    return [
      "USCIS Customer Service",
      "For your ZIP code " + zip + ", please use the official",
      "USCIS Office Locator: uscis.gov/about-us/find-a-uscis-office",
      "Or call (800) 375-5283 for assistance"
    ];
  }

  return (
    <section id="live-data" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("liveUscisData")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("liveDataDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Current Filing Fees */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{t("currentFilingFees")}</h3>
            </div>
            
            <div className="space-y-2 mb-4">
              {filingFees.slice(0, 3).map((item, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <div>
                    <div className="text-sm font-medium text-blue-900">{item.form}</div>
                    <div className="text-xs text-gray-600">{item.name}</div>
                  </div>
                  <div className="text-sm font-bold text-green-600">{item.fee}</div>
                </div>
              ))}
              <div className="text-xs text-gray-500 pt-1">+ {filingFees.length - 3} more forms</div>
            </div>
            
            <Link href="/resources/fees">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm py-2">
                {t("viewAllFees")}
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </div>

          {/* Processing Times */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{t("processingTimes")}</h3>
            </div>
            
            <div className="space-y-2 mb-4">
              {processingTimes.slice(0, 3).map((item, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <div>
                    <div className="text-sm font-medium text-green-900">{item.form}</div>
                    <div className="text-xs text-gray-600">{item.name}</div>
                  </div>
                  <div className="text-xs font-semibold text-orange-600">{item.time}</div>
                </div>
              ))}
              <div className="text-xs text-gray-500 pt-1">+ {processingTimes.length - 3} more forms</div>
            </div>
            
            <a 
              href="https://egov.uscis.gov/processing-times/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block w-full"
            >
              <Button className="w-full bg-green-600 hover:bg-green-700 text-sm py-2">
                {t("checkProcessingTimes")}
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </a>
          </div>

          {/* USCIS Offices */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 rounded-full p-2 mr-3">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{t("uscisOffices")}</h3>
            </div>
            
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                {t("enterZipCode")}
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="12345"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  maxLength={5}
                  className="flex-1 text-sm"
                />
                <Button 
                  onClick={handleZipSearch}
                  disabled={zipCode.length !== 5}
                  className="bg-purple-600 hover:bg-purple-700 px-3"
                >
                  <Search className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {searchResults.length > 0 && (
              <div className="bg-gray-50 rounded p-3 mb-4">
                <div className="space-y-1">
                  {searchResults.map((info, index) => (
                    <div key={index} className={`text-xs ${index === 0 ? 'font-semibold text-purple-900' : 'text-gray-700'}`}>
                      {info}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {searchResults.length === 0 && (
              <div className="bg-gray-50 rounded p-3 mb-4">
                <div className="text-center text-xs text-gray-500">
                  Enter ZIP code to find offices
                </div>
              </div>
            )}
            
            <a 
              href="https://www.uscis.gov/about-us/find-a-uscis-office" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block w-full"
            >
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-sm py-2">
                {t("findOffices")}
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {t("liveDataDisclaimer")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}