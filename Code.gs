/**
 * Google Apps Script backend functions for the kiosk slideshow
 */

/**
 * Serve the main HTML page
 */
function doGet() {
  return HtmlService.createFileFromTemplate('main')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Fetch slideshow data from the Google Sheets
 * @return {Array} Array of slide objects with image, title, and description
 */
function getSlideshowData() {
  try {
    // Open the spreadsheet by ID
    const spreadsheetId = '17Oqv88YWfVX9gi-LRIQORCAR8W5vtpa0jApY-nUidK0';
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    // Get the "Main" sheet
    const sheet = spreadsheet.getSheetByName('Main');
    
    if (!sheet) {
      throw new Error('Sheet "Main" not found');
    }
    
    // Get all data from the sheet
    const data = sheet.getDataRange().getValues();
    
    // Remove header row
    const headers = data[0];
    const rows = data.slice(1);
    
    // Process the data
    const slides = [];
    
    rows.forEach((row, index) => {
      const imageUrl = row[0];
      const title = row[1];
      const description = row[2];
      
      // Skip empty rows
      if (!imageUrl && !title && !description) {
        return;
      }
      
      // Convert Google Drive link to viewable image URL
      const convertedImageUrl = convertDriveLink(imageUrl);
      
      slides.push({
        id: index + 1,
        imageUrl: convertedImageUrl,
        title: title || 'Untitled',
        description: description || 'No description available'
      });
    });
    
    console.log(`Fetched ${slides.length} slides from spreadsheet`);
    return slides;
    
  } catch (error) {
    console.error('Error fetching slideshow data:', error);
    return [{
      id: 1,
      imageUrl: '',
      title: 'Error Loading Data',
      description: 'Unable to fetch slideshow data. Please check the spreadsheet configuration.'
    }];
  }
}

/**
 * Convert Google Drive sharing link to direct image URL
 * @param {string} driveUrl - Google Drive sharing URL
 * @return {string} Direct image URL
 */
function convertDriveLink(driveUrl) {
  if (!driveUrl || typeof driveUrl !== 'string') {
    return '';
  }
  
  // Handle different Google Drive URL formats
  let fileId = '';
  
  // Format 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  let match = driveUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  if (match) {
    fileId = match[1];
  } else {
    // Format 2: https://drive.google.com/open?id=FILE_ID
    match = driveUrl.match(/[?&]id=([a-zA-Z0-9-_]+)/);
    if (match) {
      fileId = match[1];
    } else {
      // Format 3: Already a direct link or other format
      return driveUrl;
    }
  }
  
  // Convert to direct image URL
  if (fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  return driveUrl;
}

/**
 * Test function to verify data fetching
 */
function testGetSlideshowData() {
  const data = getSlideshowData();
  console.log('Test data:', JSON.stringify(data, null, 2));
  return data;
}

/**
 * Get slideshow configuration
 */
function getSlideshowConfig() {
  return {
    autoAdvanceTime: 5000, // 5 seconds per slide
    showControls: true,
    enableTransitions: true,
    transitionDuration: 1000 // 1 second transition
  };
}
