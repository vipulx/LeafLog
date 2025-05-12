function doGet() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    // Filter out empty rows and create plant objects
    const plants = rows
      .filter(row => row[0]) // Filter rows that have an ID
      .map(row => ({
        id: row[0] || '',
        name: row[1] || '',
        species: row[2] || '',
        imageURL: row[3] || '',
        notes: row[4] || '',
        waterNeeds: row[5] || '',
        sunNeeds: row[6] || '',
        lastUpdate: row[7] ? new Date(row[7]).toISOString() : '',
        healthStatus: row[8] || '',
        photoCount: row[9] || 0
      }));

    Logger.log("Sending data: " + JSON.stringify(plants)); // Debug log
    
    return ContentService.createTextOutput(JSON.stringify(plants))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log("Error: " + error.toString()); // Debug log
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const postData = e.postData.contents;
    const params = {};
    
    // Parse the URL-encoded data
    postData.split('&').forEach(item => {
      const [key, value] = item.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    
    // Ensure headers exist
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'id',
        'name',
        'species',
        'imageURL',
        'notes',
        'waterNeeds',
        'sunNeeds',
        'lastUpdate',
        'healthStatus',
        'photoCount'
      ]);
    }
    
    // Append data
    sheet.appendRow([
      params.id || '',
      params.name || '',
      params.species || '',
      params.imageURL || '',
      params.notes || '',
      params.waterNeeds || '',
      params.sunNeeds || '',
      params.lastUpdate || new Date().toISOString(),
      params.healthStatus || '',
      params.photoCount || '0'
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data saved successfully'
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}
