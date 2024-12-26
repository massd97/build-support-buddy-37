function checkForNewRows() {
    try {
      const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('Sites');
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const rows = data.slice(1);
  
      // Track the last processed row
      const properties = PropertiesService.getScriptProperties();
      const lastProcessedRow = parseInt(properties.getProperty('LAST_PROCESSED_ROW') || '0');
  
      if (lastProcessedRow >= rows.length) {
        Logger.log("No new rows to process.");
        return;
      }
  
      // Get the new row(s)
      const newRows = rows.slice(lastProcessedRow);
      Logger.log(`New rows found: ${JSON.stringify(newRows)}`);
  
      newRows.forEach((row) => {
        const newSite = {};
        headers.forEach((header, index) => {
          newSite[header] = row[index];
        });
  
        // Find matches for the new site
        const matches = findSiteMatches(newSite);
  
        // Save matches if found
        if (matches.length > 0) {
          Logger.log(`Matches for ${newSite.siteName}: ${JSON.stringify(matches)}`);
          saveMatches(newSite.siteName, matches);
        }
      });
  
      // Update the last processed row
      properties.setProperty('LAST_PROCESSED_ROW', rows.length.toString());
    } catch (error) {
      console.error("Error in checkForNewRows:", error.message);
    }
  }
  
  // function findSiteMatches(newSite) {
  //   const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('Sites');
  //   const data = sheet.getDataRange().getValues();
  //   const headers = data[0];
  //   const rows = data.slice(1);
  
  //   const matches = rows
  //     .map((row) => {
  //       const site = {};
  //       headers.forEach((header, index) => {
  //         site[header] = row[index];
  //       });
  //       return site;
  //     })
  //     .filter((site) => {
  //       // Skip the new site itself
  //       if (site.siteName === newSite.siteName && site.address === newSite.address) return false;
  
  //       // Check for complementary site types
  //       const siteTypeMatch = 
  //         (newSite.siteType === "残土" && site.siteType === "客土") ||
  //         (newSite.siteType === "客土" && site.siteType === "残土");
  
  //       if (!siteTypeMatch) return false;
  
  //       // Soil Type Match
  //       const soilTypeMatch = site.soilType === newSite.soilType;
  
  //       // Availability Period Match
  //       const availabilityOverlap =
  //         new Date(site.startDate) <= new Date(newSite.endDate) &&
  //         new Date(site.endDate) >= new Date(newSite.startDate);
  
  //       // Distance Match
  //       const distance = calculateDistance(
  //         site.lat,
  //         site.lng,
  //         newSite.lat,
  //         newSite.lng
  //       );
  //       console.log('distance match: ', distance);
  //       const distanceMatch = distance <= 10; // Example: within 10km
  
  //       return soilTypeMatch && availabilityOverlap && distanceMatch;
  //     });
  
  //   return matches;
  // }
  
  function saveMatchingSitesForNewRows() {
    try {
      const sitesSheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('Sites');
      const matchesSheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('Matches');
  
      Logger.log("処理開始 saveMatchingSitesForNewRows");
  
      const data = sitesSheet.getDataRange().getValues();
      const headers = data[0];
      const rows = data.slice(1);
  
      // Track the last processed row using ScriptProperties
      const properties = PropertiesService.getScriptProperties();
      const lastProcessedRow = parseInt(properties.getProperty('LAST_PROCESSED_ROW') || '0');
      Logger.log(`Last processed row: ${lastProcessedRow}`);
  
      if (lastProcessedRow >= rows.length) {
        Logger.log("No new rows to process.");
        return;
      }
  
      // Identify new rows
      const newRows = rows.slice(lastProcessedRow);
      Logger.log(`Found ${newRows.length} new rows to process.`);
  
      const matches = [];
  
      newRows.forEach((newSiteRow, newSiteIndex) => {
        const newSite = {};
        headers.forEach((header, index) => {
          newSite[header] = newSiteRow[index];
        });
  
        Logger.log(`Processing new site: ${JSON.stringify(newSite)}`);
  
        // Find matches with existing rows (excluding new rows)
        const existingRows = rows.slice(0, lastProcessedRow);
        const complementarySites = existingRows.filter((row) => {
          const existingSite = {};
          headers.forEach((header, index) => {
            existingSite[header] = row[index];
          });
  
          // Complementary site types
          const siteTypeMatch =
            (newSite.siteType === "残土" && existingSite.siteType === "客土") ||
            (newSite.siteType === "客土" && existingSite.siteType === "残土");
  
          if (!siteTypeMatch) return false;
  
          if (site.status === '取引完了') return false
  
          // Soil Type Match
          const soilTypeMatch = newSite.soilType === existingSite.soilType;
          if (!soilTypeMatch) return false;
  
          // Availability Period Match
          const availabilityOverlap =
            new Date(newSite.startDate) <= new Date(existingSite.endDate) &&
            new Date(newSite.endDate) >= new Date(existingSite.startDate);
  
          if (!availabilityOverlap) return false;
  
          // Distance Match (within 10 km)
          const distance = calculateDistance(
            newSite.lat,
            newSite.lng,
            existingSite.lat,
            existingSite.lng
          );
          const distanceMatch = distance <= 10;
  
          return distanceMatch;
        });
  
        Logger.log(`Found ${complementarySites.length} matches for site: ${newSite.siteName}`);
  
        // Add matches to the result
        complementarySites.forEach((match) => {
          matches.push({
            "New Site": newSite.siteName,
            "Matching Site": match.siteName,
            "Address": match.address,
            "Distance": calculateDistance(newSite.lat, newSite.lng, match.lat, match.lng),
            "Timestamp": new Date().toISOString(),
          });
        });
      });
  
      Logger.log(`Total matches found: ${matches.length}`);
  
      // Save matches to the Matches sheet
      matches.forEach((match, index) => {
        Logger.log(`Saving match ${index + 1}: ${JSON.stringify(match)}`);
        matchesSheet.appendRow([
          match["New Site"],
          match["Matching Site"],
          match["Address"],
          match["Distance"],
          match["Timestamp"],
        ]);
      });
  
      // Update ScriptProperties with the new last processed row
      properties.setProperty('LAST_PROCESSED_ROW', rows.length.toString());
      Logger.log(`Updated LAST_PROCESSED_ROW to ${rows.length}`);
    } catch (error) {
      Logger.log("Error in saveMatchingSitesForNewRows:", error.message);
    }
  }
  
  
  function fetchMatchingSites() {
    try {
      const matchesSheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('Matches');
      const data = matchesSheet.getDataRange().getValues();
      const headers = data[0];
      const rows = data.slice(1);
  
      const matches = rows.map((row) => {
        const match = {};
        headers.forEach((header, index) => {
          match[header] = row[index];
        });
        return match;
      });
  
      // Encode the response
      const response = JSON.stringify({ success: true, matches });
      const compressedResponse = Utilities.base64Encode(response, Utilities.Charset.UTF_8);
      return compressedResponse;
    } catch (error) {
      console.error("Error in fetchMatchingSites:", error.message);
      return Utilities.base64Encode(
        JSON.stringify({ success: false, message: "Failed to fetch matches." }),
        Utilities.Charset.UTF_8
      );
    }
  }
  
  // Helper Function: Calculate Distance (Haversine Formula)
  function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // 地球の半径
    const toRad = (value) => (value * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }
  