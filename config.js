// =====================================================================
// AGCO Power Lead Capture – CONFIGURATION
// Only this file needs to be edited when the app is deployed.
// Client ID and Tenant ID are NOT secrets (they are public identifiers),
// but do not put any passwords or client secrets in this file.
// =====================================================================
window.APP_CONFIG = {
  appName: "AGCO Power Lead Capture",
  version: "1.0.0",

  // --- Microsoft Entra ID (Azure AD) app registration -----------------
  // Get these from IT after they create the "SPA" app registration.
  clientId: "PASTE-APPLICATION-CLIENT-ID-HERE",
  tenantId: "PASTE-DIRECTORY-TENANT-ID-HERE",
  // Must match EXACTLY the redirect URI registered in Entra ID (SPA platform).
  // Example: "https://agco-power-sales.github.io/lead-app/"
  redirectUri: window.location.origin + window.location.pathname.replace(/index\.html$/, ""),
  scopes: ["User.Read", "Sites.ReadWrite.All"],

  // --- SharePoint target ----------------------------------------------
  sharepointHost: "agcocorp.sharepoint.com",
  sitePath: "/sites/SalesMarketingAGCOPowerEMESales-AGCOPowerSalesandMarketingFinland",
  // Folder inside the site's default document library ("Shared Documents")
  defaultFolderPath: "Annual Planning/Events and exhibitions/Events 2026-2027/EIMA 2026/Liidit apista",

  // Optional: Excel summary file in the same folder. Every lead is added as
  // a new row to the table below. Set enableExcel to false to disable.
  enableExcel: true,
  excelFileName: "Liidit.xlsx",
  excelTableName: "Leads",

  // --- Defaults ---------------------------------------------------------
  defaultEvent: "EIMA 2026",
  defaultUiLanguage: "fi",          // "fi" or "en"
  defaultSpeechLanguage: "fi-FI",   // fi-FI, en-GB, sv-SE, de-DE, it-IT, fr-FR
  // Tesseract OCR languages. More languages = bigger first download.
  // Examples: "eng", "eng+ita", "eng+deu+fin+swe+ita"
  ocrLanguages: "eng",

  // --- AGCO Power product list (source: agcopower.com "Browse engines") ---
  engineGroups: [
    { group: "CORE", items: ["CORE50", "CORE75", "CORE80"] },
    { group: "Diesel HD / MD", items: ["33MD", "33HD", "44MD", "44HD", "49HD", "66HD", "74HD", "84HD", "98HD"] },
    { group: "Marine", items: ["74HD Marine", "74HD Auxiliary", "74HD Propulsion", "Other marine"] },
    { group: "Other", items: ["Electrification / hybrid", "HVO / alternative fuels", "Service & parts", "Not sure yet"] }
  ],
  applications: ["Agriculture", "Forestry", "Construction", "Material handling", "Marine", "Standby power / genset", "Other"]
};
