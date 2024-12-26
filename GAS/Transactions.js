function fetchTransactions() {
    try {
      const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('Transactions');
      const data = sheet.getDataRange().getValues();
  
      console.log('fetchTransactions called');
  
      const headers = data[0]; // The first row contains the headers
      console.log('headers gotten');
      const rows = data.slice(1); // Remaining rows contain the data
  
      console.log('headers: ', headers);
  
      // Identify the column index for "Status"
      const statusColumnIndex = headers.indexOf("Status");
      if (statusColumnIndex === -1) {
        throw new Error('No "Status" column found in the Transactions sheet.');
      }
  
      const dateFields = ["date"];
      const dateColumnIndices = dateFields
        .map(field => headers.indexOf(field))
        .filter(index => index !== -1);
  
      // Filter rows where the "Status" is "Pending"
      const filteredRows = rows.filter(row => row[statusColumnIndex] === "Pending");
  
      console.log('Filtered rows: ', filteredRows);
  
      // Map the filtered rows into transaction objects
      const transactions = filteredRows.map((row) => {
        const transaction = {};
        headers.forEach((header, index) => {
          if (dateColumnIndices.includes(index) && row[index]) {
            // Format date fields
            transaction[header] = Utilities.formatDate(new Date(row[index]), Session.getScriptTimeZone(), "yyyy-MM-dd");
          } else {
            transaction[header] = row[index];
          }
        });
        return transaction;
      });
  
      console.log('transactions: ', transactions);
  
      // Encode the response
      const response = JSON.stringify({ success: true, transactions });
      const compressedResponse = Utilities.base64Encode(response, Utilities.Charset.UTF_8);
      return compressedResponse;
    } catch (error) {
      console.error("Error in fetchTransactions:", error.message);
      return Utilities.base64Encode(JSON.stringify({ success: false, message: "Failed to fetch transactions." }), Utilities.Charset.UTF_8);
    }
  }
  
  function registerTransaction(payload) {
    try {
      const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('Transactions');
      const row = [
        payload.type, // "要求" or "承認"
        payload.siteName,
        payload.address,
        payload.preferredDate,
        payload.contactPerson, // Registerer's name
        payload.email, // Registerer's contact
        "Pending", // Default status
        Utilities.formatDate(new Date(), "JST", "yyyy-MM-dd HH:mm:ss"), // Registration date
      ];
  
      console.log(`row: ${row}`);
  
      registerTransactionEmail(payload);
  
      sheet.appendRow(row);
      return { success: true, message: "Transaction registered successfully." };
    } catch (error) {
      console.error("Error in registerTransaction:", error.message);
      return { success: false, message: "Failed to register transaction." };
    }
  }
  
  function fetchRequests() {
    try {
      const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('Transactions');
      const data = sheet.getDataRange().getValues();
  
      const headers = data[0];
      const rows = data.slice(1);
  
      const requests = rows
        .filter((row) => row[headers.indexOf("Status")] === "Pending")
        .map((row) => {
          const request = {};
          headers.forEach((header, index) => {
            request[header] = row[index];
          });
          return request;
        });
  
      return { success: true, requests };
    } catch (error) {
      console.error("Error in fetchRequests:", error.message);
      return { success: false, message: "Failed to fetch requests." };
    }
  }
  
  function updateTransactionStatus(payload) {
    try {
      const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('Transactions');
      const sitesSheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('Sites');
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      console.log('headers: ', headers);
      const idColumnIndex = headers.indexOf("ID");
      console.log('id index: ', idColumnIndex);
      const statusColumnIndex = headers.indexOf("Status");
      if (payload.status === '受諾'){
        acceptTransaction(payload);
      }else if(payload.status === '拒否'){
        denyTransaction(payload);
      }else{
        console.error('想定外のエラー発生→取引ステータスが受諾でも拒否でもない');
      }
  
      for (let i = 1; i < data.length; i++) {
        if (data[i][idColumnIndex] === payload.id) {
          sheet.getRange(i + 1, statusColumnIndex + 1).setValue(payload.status);
          return { success: true, message: `Transaction status updated to ${payload.status}.` };
        }
      }
  
      return { success: false, message: "Transaction not found." };
    } catch (error) {
      console.error("Error in updateTransactionStatus:", error.message);
      return { success: false, message: "Failed to update transaction status." };
    }
  }