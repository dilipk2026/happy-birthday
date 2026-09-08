/**
 * 👑 ETERNAL LOVE — GOOGLE APPS SCRIPT CLOUD COLLECTOR & API HUB (Code.gs)
 * ============================================================================
 * Handcrafted for Queen Nishika's Birthday & Dedicated with Love by Dilip.
 * 
 * Functions:
 *   1. 💌 Sticky Wish Wall & Blessings   -> "Wishes" Sheet Tab (Read & Write with Photos/Videos)
 *   2. 📸 Uploaded Polaroid Photos       -> Google Drive Folder + "Photos" Tab (Read & Write)
 *   3. 🔮 Starry Time Capsule Wishes     -> "Secret Wishes" Sheet Tab (Read & Write)
 * 
 * 100% Free Forever • Zero Third-Party Servers • Real-Time Cloud Sync
 * ============================================================================
 */

// 1. GET Handler (Fetch Live Wishes & Photos for Website Display)
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = (e && e.parameter && e.parameter.action) || 'getAll';

    // A. FETCH WISHES / STICKY NOTES
    var wishes = [];
    var wishSheet = ss.getSheetByName('Wishes');
    if (wishSheet && wishSheet.getLastRow() > 1) {
      var lastRow = wishSheet.getLastRow();
      var wishValues = wishSheet.getRange(2, 1, lastRow - 1, 10).getValues();
      for (var i = wishValues.length - 1; i >= 0; i--) { // Newest first
        var row = wishValues[i];
        var author = row[4] ? row[4].toString().trim() : '';
        var message = row[5] ? row[5].toString().trim() : '';
        if (author || message) {
          var mediaType = row[7] ? row[7].toString().trim().toLowerCase() : 'none';
          var mediaUrl = row[8] ? row[8].toString().trim() : '';
          var likes = row[9] ? parseInt(row[9], 10) || 0 : Math.floor(Math.random() * 8) + 3;

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
            mediaType: mediaType,
            mediaUrl: mediaUrl,
            likes: likes
          });
        }
      }
    }

    // B. FETCH POLAROID PHOTOS
    var photos = [];
    var photoSheet = ss.getSheetByName('Photos');
    if (photoSheet && photoSheet.getLastRow() > 1) {
      var photoValues = photoSheet.getRange(2, 1, photoSheet.getLastRow() - 1, 8).getValues();
      for (var j = photoValues.length - 1; j >= 0; j--) { // Newest first
        var pRow = photoValues[j];
        var driveLink = pRow[6] ? pRow[6].toString() : '';
        var directImgUrl = '';

        if (driveLink) {
          if (driveLink.indexOf('id=') !== -1) {
            var fId = driveLink.split('id=')[1].split('&')[0].split('/')[0];
            directImgUrl = 'https://drive.google.com/thumbnail?id=' + fId + '&sz=w1000';
          } else if (driveLink.indexOf('/d/') !== -1) {
            var fId2 = driveLink.split('/d/')[1].split('/')[0];
            directImgUrl = 'https://drive.google.com/thumbnail?id=' + fId2 + '&sz=w1000';
          }
        }

        var caption = pRow[4] ? pRow[4].toString().trim() : 'Our unforgettable memory';
        var tag = pRow[5] ? pRow[5].toString().trim() : 'Real Moment 📸';

        if (directImgUrl || driveLink || caption) {
          photos.push({
            id: 'gs_photo_' + (j + 2),
            timestamp: pRow[0],
            localTime: pRow[1] || 'Recently',
            celebrant: pRow[2] || 'Nishika',
            dedicatedBy: pRow[3] || 'Dilip',
            caption: caption,
            title: caption,
            tag: tag,
            driveUrl: driveLink,
            imgUrl: directImgUrl || driveLink
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

// 2. POST Handler (Webhook Data Receiver: Wishes, Photos, Capsule)
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
    // CASE A: STICKY WISH NOTE SUBMISSION (With optional Photo or Video)
    // ------------------------------------------------------------------------
    if (type === 'wish') {
      var sheet = ss.getSheetByName('Wishes') || ss.insertSheet('Wishes');
      
      // Auto-initialize header on empty sheet (10 columns)
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          'Timestamp', 'Local Time', 'Celebrant', 'Dedicated By',
          'Author / Sender', 'Heartfelt Message', 'Sticky Note Style',
          'Media Type', 'Media URL', 'Likes Count'
        ]);
        var header = sheet.getRange(1, 1, 1, 10);
        header.setFontWeight('bold')
              .setFontFamily('Arial')
              .setFontColor('#831843')
              .setBackground('#fce7f3')
              .setHorizontalAlignment('center');
        sheet.setFrozenRows(1);
      }

      var author = data.author || data.name || 'Loving Guest';
      var message = data.message || data.text || '';
      var colorStyle = data.color || data.styleClass || 'pink';
      var mediaType = data.mediaType || 'none';
      var mediaUrl = data.mediaUrl || data.mediaLink || '';

      // If Base64 image is uploaded with the wish, store in Google Drive
      if (data.mediaData && data.mediaData.indexOf('data:image') === 0) {
        try {
          var folderName = 'Eternal Love Wishes (Queen Nishika)';
          var folders = DriveApp.getFoldersByName(folderName);
          var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

          var mimeType = data.mediaData.substring(5, data.mediaData.indexOf(';')) || 'image/jpeg';
          var base64Data = data.mediaData.substring(data.mediaData.indexOf(',') + 1);
          var dateFormatted = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'GMT+0530', 'yyyy-MM-dd_HH-mm-ss');
          var fileName = 'WishPhoto_' + (author.replace(/[^a-zA-Z0-9]/g, '_')) + '_' + dateFormatted + '.jpg';

          var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, fileName);
          var file = folder.createFile(blob);
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          
          mediaUrl = 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1000';
          mediaType = 'photo';
        } catch(driveErr) {
          mediaUrl = data.mediaData.length < 500 ? data.mediaData : '';
        }
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

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        type: 'wish',
        mediaUrl: mediaUrl,
        mediaType: mediaType,
        message: 'Wish note saved to Google Sheet successfully!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ------------------------------------------------------------------------
    // CASE B: POLAROID PHOTO UPLOAD (Saved to Drive + Logged in Sheet)
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
      var dataUrl = data.dataUrl || data.base64 || '';

      if (dataUrl && dataUrl.indexOf(',') !== -1) {
        var folderName = 'Eternal Love Memories (Nishika)';
        var folders = DriveApp.getFoldersByName(folderName);
        var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

        var mimeType = dataUrl.substring(5, dataUrl.indexOf(';')) || 'image/jpeg';
        var base64Data = dataUrl.substring(dataUrl.indexOf(',') + 1);
        var dateFormatted = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'GMT+0530', 'yyyy-MM-dd_HH-mm-ss');
        var fileName = 'Nishika_Memory_' + dateFormatted + '.jpg';

        var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, fileName);
        var file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        fileUrl = file.getUrl();
        directImgUrl = 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1000';
        imageFormula = '=IMAGE("' + directImgUrl + '")';
      }

      sheet.appendRow([
        new Date(),
        data.localTime || new Date().toLocaleString(),
        data.celebrant || 'Nishika',
        data.dedicatedBy || 'Dilip',
        data.caption || data.title || 'Our unforgettable memory',
        data.tag || 'Real Moment 📸',
        fileUrl,
        imageFormula
      ]);

      var lastRow = sheet.getLastRow();
      sheet.setRowHeight(lastRow, 90);

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        type: 'photo',
        fileUrl: fileUrl,
        imgUrl: directImgUrl,
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
