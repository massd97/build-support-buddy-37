// Code.gs
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('残土マッチ')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

//現場登録
function registerSite(site) {
  const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('Sites');
  // Assuming the sheet has headers: ID, Name, Address, Latitude, Longitude, Company, SiteType, etc.
  const newRow = [
    Utilities.getUuid(),
    site.name,
    site.siteType,
    site.address,
    site.latitude,
    site.longitude,
    site.company,
    site.soilType,
    site.soilAmount,
    site.availablePeriod,
    site.maxDumpSize,
    site.smallCarry,
    site.staff,
    site.staffMailAddress,
    site.story,
    site.neededSoilAmount,
    site.soilPic,
    new Date(), // Timestamp
  ];
  sheet.appendRow(newRow);
  return { success: true, message: '現場登録完了'};
}

//現場取得
function fetchSites() {
  const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('Sites');
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const sites = data.map(row => {
    const site = {};
    headers.forEach((header, index) => {
      site[header] = row[index];
    });
    return site;
  });
  return sites;
}

//現場検索
function searchSitesByAddress(addressQuery) {
  const sites = fetchSites();
  const filteredSites = sites.filter(site => site.address.includes(addressQuery));
  return filteredSites;
}

// 住所以外でのフィルタリング
function filterSites(criteria) {
  const sites = fetchSites();
  const filteredSites = sites.filter(site => {
    for (let key in criteria) {
      if (site[key] !== criteria[key]) {
        return false;
      }
    }
    return true;
  });
  return filteredSites;
}


function test() {
  const numbers = [80, 40, 80, 30, 60];
  const result = numbers.filter(number => 50 >= number);
  console.log(result);
}