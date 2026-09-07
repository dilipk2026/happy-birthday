/**
 * 👑 ETERNAL LOVE — GOOGLE APPS SCRIPT CLOUD COLLECTOR (Code.gs)
 * ============================================================================
 * Handcrafted for Nishika's Birthday & Dedicated by Dilip.
 * 
 * Automatically saves:
 *   1. 💌 Celebration Pinboard Wishes -> "Wishes" Sheet Tab
 *   2. 📸 Uploaded Polaroid Photos     -> Google Drive Folder + "Photos" Sheet Tab
 *   3. 🔮 Starry Time Capsule Wishes   -> "Secret Wishes" Sheet Tab
 * 
 * 100% Free Forever • Zero Third-Party Servers • Permanent Cloud Archive
 * ============================================================================
 */

// 1. GET Handler (Browser Health-Check Endpoint)
function doGet(e) {
  var response = {
    status: 'online',
    title: 'Eternal Love Cloud Collector 👑💖',
    message: 'Google Apps Script Web App is connected and ready to receive wishes and photos!',
    timestamp: new Date().toISOString()
  };
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// 2. POST Handler (Webhook Data Receiver)
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'No payload received'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(e.postData.contents);
    var type = data.type || 'wish';
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // ------------------------------------------------------------------------
    // CASE A: PINBOARD WISH NOTE SUBMISSION
    // ------------------------------------------------------------------------
    if (type === 'wish') {
      var sheet = ss.getSheetByName('Wishes') || ss.insertSheet('Wishes');
      
      // Auto-initialize header on empty sheet
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Timestamp', 'Local Time', 'Celebrant', 'Dedicated By', 'Author / Sender', 'Heartfelt Message', 'Sticky Note Style']);
        var header = sheet.getRange(1, 1, 1, 7);
        header.setFontWeight('bold')
              .setFontFamily('Arial')
              .setFontColor('#831843')
              .setBackground('#fce7f3')
              .setHorizontalAlignment('center');
        sheet.setFrozenRows(1);
      }

      sheet.appendRow([
        new Date(),
        data.localTime || new Date().toLocaleString(),
        data.celebrant || 'Nishika',
        data.dedicatedBy || 'Dilip',
        data.author || 'Anonymous Loved One',
        data.message || '',
        data.styleClass || ''
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        type: 'wish',
        message: 'Wish note saved to Google Sheet successfully!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ------------------------------------------------------------------------
    // CASE B: POLAROID PHOTO UPLOAD (Saved to Drive + Logged in Sheet)
    // ------------------------------------------------------------------------
    else if (type === 'photo') {
      var sheet = ss.getSheetByName('Photos') || ss.insertSheet('Photos');

      // Auto-initialize header on empty sheet
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Timestamp', 'Local Time', 'Celebrant', 'Dedicated By', 'Photo Caption', 'Moment Tag', 'Google Drive Link', 'Image Preview']);
        var header = sheet.getRange(1, 1, 1, 8);
        header.setFontWeight('bold')
              .setFontFamily('Arial')
              .setFontColor('#831843')
              .setBackground('#fce7f3')
              .setHorizontalAlignment('center');
        sheet.setFrozenRows(1);
      }

      var fileUrl = '';
      var directImgUrl = '';
      var imageFormula = '';

      if (data.dataUrl && data.dataUrl.indexOf(',') !== -1) {
        // Target Google Drive Folder
        var folderName = 'Eternal Love Memories (Nishika)';
        var folders = DriveApp.getFoldersByName(folderName);
        var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

        // Decode Base64 dataURL
        var mimeType = data.dataUrl.substring(5, data.dataUrl.indexOf(';')) || 'image/jpeg';
        var base64Data = data.dataUrl.substring(data.dataUrl.indexOf(',') + 1);
        var dateFormatted = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'GMT+0530', 'yyyy-MM-dd_HH-mm-ss');
        var fileName = 'Nishika_Memory_' + dateFormatted + '.jpg';

        var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, fileName);
        var file = folder.createFile(blob);
        
        // Make viewable to anyone with the link
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        fileUrl = file.getUrl();
        directImgUrl = 'https://drive.google.com/uc?export=view&id=' + file.getId();
        imageFormula = '=IMAGE("' + directImgUrl + '")';
      }

      sheet.appendRow([
        new Date(),
        data.localTime || new Date().toLocaleString(),
        data.celebrant || 'Nishika',
        data.dedicatedBy || 'Dilip',
        data.caption || 'Our unforgettable memory',
        data.tag || 'Real Moment',
        fileUrl,
        imageFormula
      ]);

      // Set comfortable preview height for image row
      var lastRow = sheet.getLastRow();
      sheet.setRowHeight(lastRow, 90);

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        type: 'photo',
        fileUrl: fileUrl,
        message: 'Photo saved to Google Drive and logged in Google Sheet!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ------------------------------------------------------------------------
    // CASE C: SECRET TIME CAPSULE WISH
    // ------------------------------------------------------------------------
    else if (type === 'secret_wish') {
      var sheet = ss.getSheetByName('Secret Wishes') || ss.insertSheet('Secret Wishes');

      // Auto-initialize header on empty sheet
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Timestamp', 'Local Time', 'Celebrant', 'Dedicated By', 'Secret Birthday Wish']);
        var header = sheet.getRange(1, 1, 1, 5);
        header.setFontWeight('bold')
              .setFontFamily('Arial')
              .setFontColor('#831843')
              .setBackground('#fce7f3')
              .setHorizontalAlignment('center');
        sheet.setFrozenRows(1);
      }

      sheet.appendRow([
        new Date(),
        data.localTime || new Date().toLocaleString(),
        data.celebrant || 'Nishika',
        data.dedicatedBy || 'Dilip',
        data.wish || ''
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        type: 'secret_wish',
        message: 'Secret wish sealed safely into Google Sheet!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Unrecognized type fallback
    return ContentService.createTextOutput(JSON.stringify({
      status: 'ignored',
      message: 'Unknown payload type: ' + type
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
