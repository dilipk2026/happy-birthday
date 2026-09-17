/**
 * 👑 ETERNAL LOVE — GOOGLE APPS SCRIPT CLOUD COLLECTOR & API HUB (Code.gs)
 * ============================================================================
 * Handcrafted for Queen Nishika's Birthday & Dedicated with Love by Dilip.
 * 
 * Functions:
 *   1. 💌 Sticky Wish Wall & Blessings   -> "Wishes" Sheet Tab (Text & Photo Wishes)
 *   2. 📸 Uploaded Polaroid Photos       -> Google Drive Folder + "Photos" Tab (Read & Write)
 *   3. 🔮 Starry Time Capsule Wishes     -> "Secret Wishes" Sheet Tab (Read & Write)
 * 
 * 100% Free Forever • Zero Third-Party Servers • Real-Time Cloud Sync
 * ============================================================================
 */

// ============================================================================
// GLOBAL HELPER FUNCTIONS
// ============================================================================

/**
 * Extract Google Drive File ID from any variant of Drive / Docs / Thumbnail URL
 */
function extractDriveId(url) {
  if (!url) return '';
  var str = url.toString().trim();
  var m1 = str.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  var m2 = str.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  var m3 = str.match(/\/d\/([a-zA-Z0-9_-]+)/);
  var m4 = str.match(/\/thumbnail\?id=([a-zA-Z0-9_-]+)/);
  var m5 = str.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (m1 && m1[1]) return m1[1];
  if (m2 && m2[1]) return m2[1];
  if (m3 && m3[1]) return m3[1];
  if (m4 && m4[1]) return m4[1];
  if (m5 && m5[1]) return m5[1];
  return '';
}

/**
 * Get or create the dedicated Google Drive folder with public view permissions
 */
function getMainDriveFolder() {
  var folderName = 'Eternal Love Wishes (Queen Nishika)';
  var folders = DriveApp.getFoldersByName(folderName);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
  try {
    folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (fErr) {
    Logger.log('Folder permission set note: ' + fErr.toString());
  }
  return folder;
}

/**
 * Save Base64 Photo into Google Drive & return thumbnail and direct URLs
 */
function saveBase64ToDrive(base64Uri, fileNamePrefix) {
  try {
    if (!base64Uri || typeof base64Uri !== 'string') return null;

    // If it is already a web URL, return normalized Drive URL
    if (base64Uri.indexOf('http://') === 0 || base64Uri.indexOf('https://') === 0) {
      var dId = extractDriveId(base64Uri);
      return {
        fileUrl: base64Uri,
        mediaUrl: dId ? ('https://drive.google.com/thumbnail?id=' + dId + '&sz=w1000') : base64Uri,
        viewUrl: dId ? ('https://drive.google.com/file/d/' + dId + '/view') : base64Uri,
        directUrl: dId ? ('https://drive.google.com/uc?export=download&id=' + dId) : base64Uri,
        driveId: dId
      };
    }

    var folder = getMainDriveFolder();

    var commaIdx = base64Uri.indexOf(',');
    var headerPart = commaIdx > 0 ? base64Uri.substring(0, commaIdx) : '';
    var rawBase64 = commaIdx > 0 ? base64Uri.substring(commaIdx + 1) : base64Uri;
    if (rawBase64.indexOf('\n') !== -1 || rawBase64.indexOf('\r') !== -1 || rawBase64.indexOf(' ') !== -1) {
      rawBase64 = rawBase64.replace(/[\r\n\s]+/g, '');
    }

    var mimeType = 'image/jpeg';
    if (headerPart.indexOf('data:') === 0 && headerPart.indexOf(';') > 5) {
      mimeType = headerPart.substring(5, headerPart.indexOf(';'));
    }

    var ext = '.jpg';
    if (mimeType.indexOf('png') !== -1) ext = '.png';
    else if (mimeType.indexOf('webp') !== -1) ext = '.webp';
    else if (mimeType.indexOf('gif') !== -1) ext = '.gif';
    else if (mimeType.indexOf('svg') !== -1) ext = '.svg';
    else ext = '.jpg';

    var dateFormatted = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'GMT+0530', 'yyyy-MM-dd_HH-mm-ss');
    var safePrefix = (fileNamePrefix || 'Photo').replace(/[^a-zA-Z0-9_-]/g, '_');
    var fileName = safePrefix + '_' + dateFormatted + ext;

    var decodedBytes = Utilities.base64Decode(rawBase64);
    var blob = Utilities.newBlob(decodedBytes, mimeType, fileName);
    var file = folder.createFile(blob);

    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (shareErr) {
      Logger.log('Share setting warning: ' + shareErr.toString());
    }

    var fileId = file.getId();
    return {
      fileUrl: file.getUrl(),
      mediaUrl: 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w1000',
      viewUrl: file.getUrl(),
      directUrl: 'https://drive.google.com/uc?export=download&id=' + fileId,
      driveId: fileId
    };
  } catch (driveErr) {
    Logger.log('Drive photo upload error: ' + driveErr.toString());
    return null;
  }
}

// ============================================================================
// 1. GET HANDLER (Fetch Live Wishes & Polaroid Photos for Website Display)
// ============================================================================
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // A. FETCH WISHES / STICKY NOTES
    var wishes = [];
    var wishSheet = ss.getSheetByName('Wishes');
    if (wishSheet && wishSheet.getLastRow() > 1) {
      var lastRow = wishSheet.getLastRow();
      var maxCols = Math.max(wishSheet.getLastColumn(), 10);
      var wishValues = wishSheet.getRange(2, 1, lastRow - 1, maxCols).getValues();

      for (var i = wishValues.length - 1; i >= 0; i--) { // Newest first
        var row = wishValues[i];
        var author = row[4] ? row[4].toString().trim() : '';
        var message = row[5] ? row[5].toString().trim() : '';
        
        if (author || message) {
          var mediaType = row[7] ? row[7].toString().trim().toLowerCase() : 'none';
          var mediaUrl = row[8] ? row[8].toString().trim() : '';
          var likes = row[9] ? parseInt(row[9], 10) || 0 : Math.floor(Math.random() * 8) + 5;

          // Normalize photo media URLs
          if (mediaUrl) {
            if (mediaUrl.indexOf('blob:') === 0) {
              mediaUrl = '';
              mediaType = 'none';
            } else {
              var driveId = extractDriveId(mediaUrl);
              if (driveId) {
                mediaType = 'photo';
                mediaUrl = 'https://drive.google.com/thumbnail?id=' + driveId + '&sz=w1000';
              } else if (mediaUrl.match(/(\.jpg|\.jpeg|\.png|\.gif|\.webp|data:image)/i)) {
                mediaType = 'photo';
              }
            }
          }

          wishes.push({
            id: 'gs_wish_' + (i + 2),
            timestamp: row[0],
            localTime: row[1] || 'Recently',
            celebrant: row[2] || 'Nishika',
            dedicatedBy: row[3] || 'Dilip',
            author: author || 'Loving Well-wisher',
            name: author || 'Loving Well-wisher',
            message: message,
            text: message,
            color: (row[6] && row[6].toString().toLowerCase()) || 'pink',
            styleClass: row[6] || 'sticky-pink',
            mediaType: mediaType === 'photo' ? 'photo' : 'none',
            mediaUrl: mediaType === 'photo' ? mediaUrl : '',
            likes: likes
          });
        }
      }
    }

    // B. FETCH POLAROID PHOTOS
    var photos = [];
    var photoSheet = ss.getSheetByName('Photos');
    if (photoSheet && photoSheet.getLastRow() > 1) {
      var photoValues = photoSheet.getRange(2, 1, photoSheet.getLastRow() - 1, Math.max(photoSheet.getLastColumn(), 8)).getValues();

      for (var j = photoValues.length - 1; j >= 0; j--) { // Newest first
        var pRow = photoValues[j];
        var driveLink = pRow[6] ? pRow[6].toString().trim() : '';
        var directImgUrl = '';
        var fId = extractDriveId(driveLink);

        if (fId) {
          directImgUrl = 'https://drive.google.com/thumbnail?id=' + fId + '&sz=w1000';
        } else if (driveLink) {
          directImgUrl = driveLink;
        }

        var caption = pRow[4] ? pRow[4].toString().trim() : 'Our unforgettable memory';
        var tag = pRow[5] ? pRow[5].toString().trim() : 'Real Moment 📸';
        var dedicatedBy = pRow[3] ? pRow[3].toString().trim() : 'Dilip';

        if (directImgUrl || caption) {
          photos.push({
            id: 'gs_photo_' + (j + 2),
            timestamp: pRow[0],
            localTime: pRow[1] || 'Recently',
            celebrant: pRow[2] || 'Nishika',
            dedicatedBy: dedicatedBy,
            author: dedicatedBy,
            name: dedicatedBy,
            caption: caption,
            title: caption,
            message: caption,
            tag: tag,
            mediaType: 'photo',
            driveUrl: driveLink,
            imgUrl: directImgUrl || driveLink,
            mediaUrl: directImgUrl || driveLink
          });
        }
      }
    }

    var response = {
      status: 'success',
      title: 'Eternal Love Cloud Hub 👑💖',
      countWishes: wishes.length,
      countPhotos: photos.length,
      wishes: wishes,
      photos: photos,
      timestamp: new Date().toISOString()
    };

    // Support JSONP callback for cross-origin browser loading
    var callback = e && e.parameter && e.parameter.callback;
    if (callback) {
      return ContentService.createTextOutput(callback + '(' + JSON.stringify(response) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    var errResponse = {
      status: 'error',
      message: err.toString()
    };
    var callback = e && e.parameter && e.parameter.callback;
    if (callback) {
      return ContentService.createTextOutput(callback + '(' + JSON.stringify(errResponse) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput(JSON.stringify(errResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================================
// 2. POST HANDLER (Webhook Data Receiver: Wishes, Photos, Capsule)
// ============================================================================
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'No payload received'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(e.postData.contents);
    var type = (data.type || 'wish').toLowerCase();
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // ------------------------------------------------------------------------
    // CASE A: STICKY WISH NOTE SUBMISSION (Pure Text or with Photo Attachment)
    // ------------------------------------------------------------------------
    if (type === 'wish') {
      var sheet = ss.getSheetByName('Wishes') || ss.insertSheet('Wishes');
      
      // Ensure 10-column header
      if (sheet.getLastRow() === 0 || sheet.getLastColumn() < 10) {
        var headers = [
          'Timestamp', 'Local Time', 'Celebrant', 'Dedicated By',
          'Author / Sender', 'Heartfelt Message', 'Sticky Note Style',
          'Media Type', 'Media URL', 'Likes Count'
        ];
        sheet.getRange(1, 1, 1, 10).setValues([headers]);
        var header = sheet.getRange(1, 1, 1, 10);
        header.setFontWeight('bold')
              .setFontFamily('Arial')
              .setFontColor('#831843')
              .setBackground('#fce7f3')
              .setHorizontalAlignment('center');
        sheet.setFrozenRows(1);
      }

      var author = data.author || data.name || 'Loving Guest';
      var message = data.message || data.text || data.caption || '';
      var colorStyle = data.color || data.styleClass || 'pink';
      var mediaType = (data.mediaType || 'none').toString().trim().toLowerCase();
      var mediaUrl = data.mediaUrl || data.mediaLink || data.mediaData || data.dataUrl || '';

      var isPhoto = (mediaType === 'photo') || (mediaUrl && (mediaUrl.indexOf('data:image') === 0 || mediaUrl.match(/(\.jpg|\.jpeg|\.png|\.gif|\.webp)/i)));

      if (isPhoto) {
        mediaType = 'photo';
        // If Base64 image is uploaded, store in Google Drive
        if (mediaUrl.indexOf('data:image') === 0) {
          var driveResult = saveBase64ToDrive(mediaUrl, 'Wish_Photo_' + author);
          if (driveResult && driveResult.mediaUrl) {
            mediaUrl = driveResult.mediaUrl;
          } else if (driveResult && driveResult.fileUrl) {
            mediaUrl = driveResult.fileUrl;
          }
        } else if (mediaUrl.indexOf('drive.google.com') !== -1 || mediaUrl.indexOf('docs.google.com') !== -1 || mediaUrl.indexOf('googleusercontent.com') !== -1) {
          var dId = extractDriveId(mediaUrl);
          if (dId) {
            mediaUrl = 'https://drive.google.com/thumbnail?id=' + dId + '&sz=w1000';
          }
        }
      } else {
        mediaType = 'none';
        mediaUrl = '';
      }

      sheet.appendRow([
        new Date(),
        data.localTime || new Date().toLocaleString(),
        data.celebrant || 'Nishika',
        data.dedicatedBy || 'Dilip',
        author,
        message,
        colorStyle,
        mediaType,
        mediaUrl,
        1
      ]);

      // If photo attached, also log to Photos tab
      if (mediaType === 'photo' && mediaUrl) {
        var photoSheet = ss.getSheetByName('Photos') || ss.insertSheet('Photos');
        if (photoSheet.getLastRow() === 0) {
          photoSheet.appendRow(['Timestamp', 'Local Time', 'Celebrant', 'Dedicated By', 'Photo Caption', 'Moment Tag', 'Google Drive Link', 'Image Preview']);
          var pHeader = photoSheet.getRange(1, 1, 1, 8);
          pHeader.setFontWeight('bold').setFontFamily('Arial').setFontColor('#831843').setBackground('#fce7f3').setHorizontalAlignment('center');
          photoSheet.setFrozenRows(1);
        }
        photoSheet.appendRow([
          new Date(),
          data.localTime || new Date().toLocaleString(),
          data.celebrant || 'Nishika',
          author,
          message || 'Our unforgettable memory',
          data.tag || 'Real Moment 📸',
          mediaUrl,
          mediaUrl.indexOf('http') === 0 ? '=IMAGE("' + mediaUrl + '")' : ''
        ]);
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        type: 'wish',
        mediaUrl: mediaUrl,
        mediaType: mediaType,
        message: 'Wish note saved to Google Sheet successfully!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ------------------------------------------------------------------------
    // CASE B: POLAROID PHOTO UPLOAD (Saved to Drive + Logged in Photos & Wishes)
    // ------------------------------------------------------------------------
    else if (type === 'photo') {
      var sheet = ss.getSheetByName('Photos') || ss.insertSheet('Photos');

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
      var dataUrl = data.dataUrl || data.base64 || data.mediaData || data.mediaUrl || '';
      var sender = data.author || data.name || data.dedicatedBy || 'Dilip';
      var caption = data.caption || data.message || data.title || 'Our unforgettable memory';

      if (dataUrl && dataUrl.indexOf('data:image') === 0) {
        var driveResult = saveBase64ToDrive(dataUrl, 'Photo_' + sender);
        if (driveResult) {
          fileUrl = driveResult.fileUrl;
          directImgUrl = driveResult.mediaUrl;
          imageFormula = '=IMAGE("' + directImgUrl + '")';
        } else {
          fileUrl = '[Photo Uploaded: ' + sender + ']';
          directImgUrl = '';
        }
      } else if (dataUrl) {
        directImgUrl = dataUrl;
        fileUrl = dataUrl;
        if (dataUrl.indexOf('http') === 0) {
          imageFormula = '=IMAGE("' + dataUrl + '")';
        }
      }

      sheet.appendRow([
        new Date(),
        data.localTime || new Date().toLocaleString(),
        data.celebrant || 'Nishika',
        sender,
        caption,
        data.tag || 'Real Moment 📸',
        fileUrl,
        imageFormula
      ]);

      var lastRow = sheet.getLastRow();
      try { sheet.setRowHeight(lastRow, 90); } catch(rErr) {}

      // Mirror to Wishes tab for live Sticky Wall visibility
      var wishSheet = ss.getSheetByName('Wishes') || ss.insertSheet('Wishes');
      if (wishSheet.getLastRow() === 0 || wishSheet.getLastColumn() < 10) {
        var headers = [
          'Timestamp', 'Local Time', 'Celebrant', 'Dedicated By',
          'Author / Sender', 'Heartfelt Message', 'Sticky Note Style',
          'Media Type', 'Media URL', 'Likes Count'
        ];
        wishSheet.getRange(1, 1, 1, 10).setValues([headers]);
        var wHeader = wishSheet.getRange(1, 1, 1, 10);
        wHeader.setFontWeight('bold').setFontFamily('Arial').setFontColor('#831843').setBackground('#fce7f3').setHorizontalAlignment('center');
        wishSheet.setFrozenRows(1);
      }

      wishSheet.appendRow([
        new Date(),
        data.localTime || new Date().toLocaleString(),
        data.celebrant || 'Nishika',
        sender,
        sender,
        caption,
        'gold',
        'photo',
        directImgUrl || fileUrl,
        1
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        type: 'photo',
        fileUrl: fileUrl,
        imgUrl: directImgUrl || fileUrl,
        mediaUrl: directImgUrl || fileUrl,
        mediaType: 'photo',
        message: 'Photo saved to Google Drive and logged in Google Sheet!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ------------------------------------------------------------------------
    // CASE C: SECRET TIME CAPSULE WISH
    // ------------------------------------------------------------------------
    else if (type === 'secret_wish') {
      var sheet = ss.getSheetByName('Secret Wishes') || ss.insertSheet('Secret Wishes');

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
        data.wish || data.message || ''
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        type: 'secret_wish',
        message: 'Secret wish sealed safely into Google Sheet!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

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

// ============================================================================
// 3. UTILITY SETUP FUNCTION (Run once from Apps Script editor if setting up a fresh sheet)
// ============================================================================
function setupInitialSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Wishes Tab
  var wishSheet = ss.getSheetByName('Wishes') || ss.insertSheet('Wishes');
  var wishHeaders = [
    'Timestamp', 'Local Time', 'Celebrant', 'Dedicated By',
    'Author / Sender', 'Heartfelt Message', 'Sticky Note Style',
    'Media Type', 'Media URL', 'Likes Count'
  ];
  wishSheet.getRange(1, 1, 1, 10).setValues([wishHeaders]);
  wishSheet.getRange(1, 1, 1, 10)
    .setFontWeight('bold')
    .setFontFamily('Arial')
    .setFontColor('#831843')
    .setBackground('#fce7f3')
    .setHorizontalAlignment('center');
  wishSheet.setFrozenRows(1);

  // 2. Photos Tab
  var photoSheet = ss.getSheetByName('Photos') || ss.insertSheet('Photos');
  var photoHeaders = ['Timestamp', 'Local Time', 'Celebrant', 'Dedicated By', 'Photo Caption', 'Moment Tag', 'Google Drive Link', 'Image Preview'];
  photoSheet.getRange(1, 1, 1, 8).setValues([photoHeaders]);
  photoSheet.getRange(1, 1, 1, 8)
    .setFontWeight('bold')
    .setFontFamily('Arial')
    .setFontColor('#831843')
    .setBackground('#fce7f3')
    .setHorizontalAlignment('center');
  photoSheet.setFrozenRows(1);

  // 3. Secret Wishes Tab
  var secretSheet = ss.getSheetByName('Secret Wishes') || ss.insertSheet('Secret Wishes');
  var secretHeaders = ['Timestamp', 'Local Time', 'Celebrant', 'Dedicated By', 'Secret Birthday Wish'];
  secretSheet.getRange(1, 1, 1, 5).setValues([secretHeaders]);
  secretSheet.getRange(1, 1, 1, 5)
    .setFontWeight('bold')
    .setFontFamily('Arial')
    .setFontColor('#831843')
    .setBackground('#fce7f3')
    .setHorizontalAlignment('center');
  secretSheet.setFrozenRows(1);

  Logger.log('👑 All 3 Eternal Love Sheet Tabs (Wishes, Photos, Secret Wishes) Initialized Successfully!');
}
