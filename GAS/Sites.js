// Code.gs
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('残土マッチ')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getMapsApiKey(){
  return PropertiesService.getScriptProperties().getProperty('MAPS_API_KEY');
}

function geocodeAddress(address) {
  try {
    const geocoder = Maps.newGeocoder();
    const location = geocoder.geocode(address);

    if (location.status === "OK" && location.results && location.results[0]) {
      const geometry = location.results[0].geometry.location;
      return {
        lat: geometry.lat,
        lng: geometry.lng,
      };
    }

    console.warn("Geocoding failed for address:", address);
    return null;
  } catch (error) {
    console.error("Error in geocodeAddress:", error.message);
    return null;
  }
}

//現場登録
function registerSite(payload) {
  try {
    // Retrieve the Google Sheet
    const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('Sites');

    const geocodeResult = geocodeAddress(payload.address);
    const lat = geocodeResult ? geocodeResult.lat : "";
    const lng = geocodeResult ? geocodeResult.lng : "";

    console.log(`lat: ${lat}, lng: ${lng}`);

    // Define the headers for the Google Sheet
    const headers = [
      "id",
      "Site Name",
      "Site Type",
      "Address",
      "Lat",
      "Lng",
      "Manager Name",
      "Email",
      "Company",
      "Soil Type",
      "Soil Volume",
      "Start Date",
      "End Date",
      "Small Transport",
      "Dump Size",
      "Previous Use",
      "Required Soil Volume",
      "Image Base64",
      "Registration Date",
    ];

    // Map payload data to sheet row based on headers
    const row = headers.map((header) => {
      switch (header) {
        case "Site Name":
          return payload.siteName || "";
        case "Address":
          return payload.address || "";
        case "Lat":
          return lat;
        case "Lng":
          return lng;
        case "Manager Name":
          return payload.managerName || "";
        case "Email":
          return payload.email || "";
        case "Start Date":
          return payload.startDate || "";
        case "End Date":
          return payload.endDate || "";
        case "Small Transport":
          return payload.smallTransport || "";
        case "Dump Size":
          return payload.dumpSize || "";
        case "Soil Volume":
          return payload.soilVolume || "";
        case "Soil Type":
          return payload.soilType || "";
        case "Previous Use":
          return payload.previousUse || "";
        case "Required Soil Volume":
          return payload.requiredSoilVolume || "";
        case "Company":
          return payload.company || "";
        case "Site Type":
          return payload.siteType || "";
        case "Image Base64":
          return payload.image || ""; // Store the Base64 string if provided
        case "Registration Date":
          return Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:mm:ss') || ""; // 登録日時
        default:
          return "";
      }
    });

    // Append the row to the sheet
    sheet.appendRow(row);

    // Return success response
    return { success: true, message: "Site registered successfully!" };
  } catch (error) {
    console.error("Error in registerSite:", error.message);
    return { success: false, message: "An error occurred during site registration." };
  }
}

//現場取得
// Fetch all sites
function fetchSites() {
  console.log('This is the right function to be called')
  try {
    // Retrieve the Google Sheet
    const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('Sites');
    const data = sheet.getDataRange().getValues(); // Get all rows

    if (data.length < 2) {
      // No data rows (only headers exist)
      return { success: true, sites: [] };
    }

    // Extract headers and rows
    const headers = data[0];
    const rows = data.slice(1);
    const dateFields = ["startDate", "endDate"];
    const dateColumnIndices = dateFields
      .map(field => headers.indexOf(field))
      .filter(index => index !== -1);

    // Map rows to JSON objects
    const sites = rows.map((row) => {
      const site = {};
      headers.forEach((header, index) => {
        if (dateColumnIndices.includes(index) && row[index]) {
          // Format date fields
          site[header] = Utilities.formatDate(new Date(row[index]), Session.getScriptTimeZone(), "yyyy-MM-dd");
        } else {
          site[header] = row[index];
        }
      });
      return site;
    });
    var response = JSON.stringify({ success: true, sites });
    console.log('stringified response: ', response);
    const compressedResponse = Utilities.base64Encode(response, Utilities.Charset.UTF_8);
    console.log('compressed response: ', compressedResponse)
    return compressedResponse;
  } catch (error) {
    console.error("Error in fetchSites:", error.message);
    var response = { success: false, message: "An error occurred while fetching sites." };
    return response
  }
}

function updateSite(updatedSite) {
  try {
    console.log('Updating sites ...')
    const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('Sites');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idColumnIndex = headers.indexOf("ID");

    if (idColumnIndex === -1) {
      throw new Error('No "ID" column found in the Sites sheet.');
    }

    for (let i = 1; i < data.length; i++) {
      if (data[i][idColumnIndex] === updatedSite.id) {
        headers.forEach((header, index) => {
          const value = updatedSite[header];
          if (value !== undefined) {
            sheet.getRange(i + 1, index + 1).setValue(value);
          }
        });
        return { success: true, message: "Site updated successfully." };
      }
    }
    return { success: false, message: "Site not found." };
  } catch (error) {
    console.error("Error in updateSite:", error.message);
    return { success: false, message: "Failed to update site." };
  }
}
