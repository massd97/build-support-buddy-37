function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('残土マッチ')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

//現場登録
function registerSite(site) {
  const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('Sites');
  const newRow = [
    Utilities.getUuid(), // Generate a unique ID
    site.siteName,
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
  try {
    const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('Sites');
    if (!sheet) {
      console.error('Sheet not found');
      return { success: false, message: 'Sheet not found', sites: [] };
    }

    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      console.log('No data found in sheet');
      return { success: true, sites: [] };
    }

    const headers = data[0];
    const rows = data.slice(1);

    const sites = rows.map(row => {
      const site = {};
      headers.forEach((header, index) => {
        if (header === 'id') {
          site['id'] = row[index] || Utilities.getUuid(); // Ensure ID exists
        } else if (header === 'latitude' || header === 'longitude') {
          site[header] = Number(row[index]) || 0;
        } else {
          site[header] = row[index] || '';
        }
      });
      return site;
    });

    console.log(`Total sites found: ${sites.length}`);
    return { success: true, sites };
  } catch (error) {
    console.error("Error in fetchSites:", error);
    return { success: false, message: error.toString(), sites: [] };
  }
}

function searchSitesByAddress(addressQuery) {
  const sites = fetchSites();
  if (!sites.success) return sites;
  
  const filteredSites = sites.sites.filter(site => 
    site.address && site.address.includes(addressQuery)
  );
  return { success: true, sites: filteredSites };
}

// 住所以外でのフィルタリング
function filterSites(criteria) {
  const sites = fetchSites();
  if (!sites.success) return sites;
  
  const filteredSites = sites.sites.filter(site => {
    for (let key in criteria) {
      if (site[key] !== criteria[key]) {
        return false;
      }
    }
    return true;
  });
  return { success: true, sites: filteredSites };
}

function test() {
  const result = fetchSites();
  console.log(JSON.stringify(result, null, 2));
}

function registerTransaction(transaction) {
  const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('Transactions');
  const newRow = [
    Utilities.getUuid(), // Generate a unique ID for the transaction
    transaction.type,
    transaction.siteName,
    transaction.address,
    transaction.preferredDate,
    transaction.requesterName,
    transaction.soilVolume,
    transaction.email,
    transaction.contactPerson,
    new Date(), // Timestamp
  ];
  sheet.appendRow(newRow);
  return { success: true, message: '取引登録完了' };
}

function fetchMatchingSites() {
  try {
    const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('Sites');
    if (!sheet) {
      console.error('Sheet not found');
      return { success: false, message: 'Sheet not found', sites: [] };
    }

    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      console.log('No data found in sheet');
      return { success: true, sites: [] };
    }

    const headers = data[0];
    const rows = data.slice(1);

    const sites = rows.map(row => {
      const site = {};
      headers.forEach((header, index) => {
        if (header === 'latitude' || header === 'longitude') {
          site[header] = Number(row[index]) || 0;
        } else {
          site[header] = row[index] || '';
        }
      });
      return site;
    });

    const matchingSites = sites.filter(site => {
      // Add your matching logic here
      return true; // Currently returns all sites, implement your matching logic
    });

    console.log(`Total matching sites found: ${matchingSites.length}`);
    return { success: true, sites: matchingSites };
  } catch (error) {
    console.error("Error in fetchMatchingSites:", error);
    return { success: false, message: error.toString(), sites: [] };
  }
}