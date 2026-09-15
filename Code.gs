/**
 * 👑 ETERNAL LOVE — GOOGLE APPS SCRIPT CLOUD COLLECTOR & API HUB (Code.gs)
 * ============================================================================
 * Handcrafted for Queen Nishika's Birthday & Dedicated with Love by Dilip.
 * 
 * Functions:
 *   1. 💌 Sticky Wish Wall & Blessings   -> "Wishes" Sheet Tab (Read & Write with Photos/Videos)
 *   2. 📸 Uploaded Polaroid Photos       -> Google Drive Folder + "Photos" Tab (Read & Write)
 *   3. 🎬 Uploaded Videos & Reels        -> Google Drive Folder + "Videos" Tab (Read & Write)
 *   4. 🔮 Starry Time Capsule Wishes     -> "Secret Wishes" Sheet Tab (Read & Write)
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
  url = url.toString().trim();
  var m1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  var m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  var m3 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  var m4 = url.match(/\/thumbnail\?id=([a-zA-Z0-9_-]+)/);
  if (m1 && m1[1]) return m1[1];
  if (m2 && m2[1]) return m2[1];
  if (m3 && m3[1]) return m3[1];
  if (m4 && m4[1]) return m4[1];
  return '';
}

/**
 * Detect if a URL or data string represents a video
 */
function isVideoUrl(url) {
  if (!url) return false;
  var str = url.toString().toLowerCase();
  return (
    str.indexOf('youtube.com') !== -1 ||
    str.indexOf('youtu.be') !== -1 ||
    str.indexOf('vimeo.com') !== -1 ||
    str.indexOf('/preview') !== -1 ||
    str.indexOf('.mp4') !== -1 ||
    str.indexOf('.webm') !== -1 ||
    str.indexOf('.mov') !== -1 ||
    str.indexOf('.m4v') !== -1 ||
    str.indexOf('.ogg') !== -1 ||
    str.indexOf('.mkv') !== -1 ||
    str.indexOf('data:video') !== -1
  );
}

/**
 * Save Base64 file into Google Drive & return preview URLs
 */
function saveBase64ToDrive(base64Uri, fileNamePrefix, isVideoFile) {
  try {
    if (!base64Uri || typeof base64Uri !== 'string') return null;

    // If it is already a web URL, don't attempt Base64 decoding
    if (base64Uri.indexOf('http://') === 0 || base64Uri.indexOf('https://') === 0) {
      return {
        fileUrl: base64Uri,
        mediaUrl: base64Uri,
        driveId: extractDriveId(base64Uri)
      };
    }

    var folderName = 'Eternal Love Wishes (Queen Nishika)';
    var folders = DriveApp.getFoldersByName(folderName);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
    try {
      folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (fErr) {}

    var commaIdx = base64Uri.indexOf(',');
    var headerPart = commaIdx > 0 ? base64Uri.substring(0, commaIdx) : '';
    var rawBase64 = commaIdx > 0 ? base64Uri.substring(commaIdx + 1) : base64Uri;
    if (rawBase64.indexOf('\n') !== -1 || rawBase64.indexOf('\r') !== -1 || rawBase64.indexOf(' ') !== -1) {
      rawBase64 = rawBase64.replace(/[\r\n\s]+/g, '');
    }

    var mimeType = isVideoFile ? 'video/mp4' : 'image/jpeg';
    if (headerPart.indexOf('data:') === 0 && headerPart.indexOf(';') > 5) {
      mimeType = headerPart.substring(5, headerPart.indexOf(';'));
    }

    var dateFormatted = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'GMT+0530', 'yyyy-MM-dd_HH-mm-ss');
    var ext = '.mp4';
    if (isVideoFile) {
      if (mimeType.indexOf('webm') !== -1) ext = '.webm';
      else if (mimeType.indexOf('ogg') !== -1) ext = '.ogg';
      else if (mimeType.indexOf('quicktime') !== -1 || mimeType.indexOf('mov') !== -1) ext = '.mov';
      else if (mimeType.indexOf('m4v') !== -1) ext = '.m4v';
      else if (mimeType.indexOf('x-matroska') !== -1 || mimeType.indexOf('mkv') !== -1) ext = '.mkv';
      else ext = '.mp4';
    } else {
      if (mimeType.indexOf('png') !== -1) ext = '.png';
      else if (mimeType.indexOf('webp') !== -1) ext = '.webp';
      else if (mimeType.indexOf('gif') !== -1) ext = '.gif';
      else if (mimeType.indexOf('svg') !== -1) ext = '.svg';
      else ext = '.jpg';
    }

    var safePrefix = (fileNamePrefix || (isVideoFile ? 'Video' : 'Photo')).replace(/[^a-zA-Z0-9_-]/g, '_');
    var fileName = safePrefix + '_' + dateFormatted + ext;

    var decodedBytes = Utilities.base64Decode(rawBase64);
    var blob = Utilities.newBlob(decodedBytes, mimeType, fileName);
    var file = folder.createFile(blob);

    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (shareErr) {
      // Ignore domain permission restriction errors so file creation still succeeds
    }

    var fileId = file.getId();
    if (isVideoFile) {
      return {
        fileUrl: file.getUrl(),
        mediaUrl: 'https://drive.google.com/file/d/' + fileId + '/preview',
        driveId: fileId
      };
    } else {
      return {
        fileUrl: file.getUrl(),
        mediaUrl: 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w1000',
        driveId: fileId
      };
    }
  } catch (driveErr) {
    Logger.log('Drive upload error: ' + driveErr.toString());
    return null;
  }
}

// ============================================================================
// 1. GET HANDLER (Fetch Live Wishes, Photos & Videos for Website Display)
// ============================================================================
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = (e && e.parameter && e.parameter.action) || 'getAll';

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
          var likes = row[9] ? parseInt(row[9], 10) || 0 : Math.floor(Math.random() * 8) + 3;

          // Auto-detect media type & format URLs
          if (mediaUrl) {
            if (mediaUrl.indexOf('blob:') === 0) {
              mediaUrl = '';
              mediaType = 'none';
            } else {
              var driveId = extractDriveId(mediaUrl);
              if (mediaType === 'video' || isVideoUrl(mediaUrl)) {
                mediaType = 'video';
                if (driveId) {
                  mediaUrl = 'https://drive.google.com/file/d/' + driveId + '/preview';
                }
              } else if (mediaType === 'photo' || mediaUrl.match(/(\.jpg|\.jpeg|\.png|\.gif|\.webp|data:image|drive\.google)/i)) {
                mediaType = 'photo';
                if (driveId) {
                  mediaUrl = 'https://drive.google.com/thumbnail?id=' + driveId + '&sz=w1000';
                }
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
      var photoValues = photoSheet.getRange(2, 1, photoSheet.getLastRow() - 1, Math.max(photoSheet.getLastColumn(), 8)).getValues();
      for (var j = photoValues.length - 1; j >= 0; j--) { // Newest first
        var pRow = photoValues[j];
        var driveLink = pRow[6] ? pRow[6].toString().trim() : '';
        var directImgUrl = '';
        var fId = extractDriveId(driveLink);

        var isVideo = isVideoUrl(driveLink);
        if (fId) {
          if (isVideo) {
            directImgUrl = 'https://drive.google.com/file/d/' + fId + '/preview';
          } else {
            directImgUrl = 'https://drive.google.com/thumbnail?id=' + fId + '&sz=w1000';
          }
        }

        var caption = pRow[4] ? pRow[4].toString().trim() : 'Our unforgettable memory';
        var tag = pRow[5] ? pRow[5].toString().trim() : (isVideo ? 'Video Reel 🎬' : 'Real Moment 📸');
        var dedicatedBy = pRow[3] ? pRow[3].toString().trim() : 'Dilip';

        if (directImgUrl || driveLink || caption) {
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
            mediaType: isVideo ? 'video' : 'photo',
            driveUrl: driveLink,
            imgUrl: directImgUrl || driveLink,
            mediaUrl: directImgUrl || driveLink
          });
        }
      }
    }

    // C. FETCH VIDEOS
    var videos = [];
    var videoSheet = ss.getSheetByName('Videos');
    if (videoSheet && videoSheet.getLastRow() > 1) {
      var videoValues = videoSheet.getRange(2, 1, videoSheet.getLastRow() - 1, Math.max(videoSheet.getLastColumn(), 7)).getValues();
      for (var k = videoValues.length - 1; k >= 0; k--) {
        var vRow = videoValues[k];
        var vLink = vRow[6] ? vRow[6].toString().trim() : '';
        var vId = extractDriveId(vLink);
        var previewUrl = vLink;

        if (vId) {
          previewUrl = 'https://drive.google.com/file/d/' + vId + '/preview';
        }

        var vCaption = vRow[4] ? vRow[4].toString().trim() : 'Royal video dedication for Queen Nishika 🎬';
        var vTag = vRow[5] ? vRow[5].toString().trim() : 'Video Reel 🎬';
        var vSender = vRow[3] ? vRow[3].toString().trim() : 'Dilip';

        if (previewUrl || vCaption) {
          videos.push({
            id: 'gs_video_' + (k + 2),
            timestamp: vRow[0],
            localTime: vRow[1] || 'Recently',
            celebrant: vRow[2] || 'Nishika',
            dedicatedBy: vSender,
            author: vSender,
            name: vSender,
            caption: vCaption,
            title: vCaption,
            message: vCaption,
            tag: vTag,
            mediaType: 'video',
            driveUrl: vLink,
            mediaUrl: previewUrl,
            videoUrl: previewUrl
          });
        }
      }
    }

    var response = {
      status: 'success',
      title: 'Eternal Love Cloud Hub 👑💖',
      countWishes: wishes.length,
      countPhotos: photos.length,
      countVideos: videos.length,
      wishes: wishes,
      photos: photos,
      videos: videos,
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
// 2. POST HANDLER (Webhook Data Receiver: Wishes, Photos, Videos, Capsule)
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
    // CASE A: STICKY WISH NOTE SUBMISSION (With optional Photo or Video)
    // ------------------------------------------------------------------------
    if (type === 'wish') {
      var sheet = ss.getSheetByName('Wishes') || ss.insertSheet('Wishes');
      
      // Auto-initialize or ensure 10-column header
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
      var mediaUrl = data.mediaUrl || data.mediaLink || data.mediaData || data.dataUrl || data.videoUrl || '';

      var isVideo = (mediaType === 'video') || (mediaUrl && (mediaUrl.indexOf('data:video') === 0 || isVideoUrl(mediaUrl)));
      var isPhoto = !isVideo && ((mediaType === 'photo') || (mediaUrl && (mediaUrl.indexOf('data:image') === 0 || mediaUrl.match(/(\.jpg|\.jpeg|\.png|\.gif|\.webp)/i))));

      if (isVideo) mediaType = 'video';
      else if (isPhoto) mediaType = 'photo';

      // If Base64 image or video is uploaded, store in Google Drive
      if (mediaUrl && (mediaUrl.indexOf('data:image') === 0 || mediaUrl.indexOf('data:video') === 0)) {
        var driveResult = saveBase64ToDrive(mediaUrl, (isVideo ? 'Wish_Video_' : 'Wish_Photo_') + author, isVideo);
        if (driveResult && driveResult.mediaUrl) {
          mediaUrl = driveResult.mediaUrl;
        } else if (driveResult && driveResult.fileUrl) {
          mediaUrl = driveResult.fileUrl;
        } else {
          mediaUrl = isVideo ? '[Video Attached: ' + author + ']' : '[Photo Attached: ' + author + ']';
        }
      } else if (mediaUrl) {
        // Direct link normalizer (Google Drive / YouTube / Vimeo / etc.)
        if (mediaUrl.indexOf('drive.google.com') !== -1 || mediaUrl.indexOf('docs.google.com') !== -1 || mediaUrl.indexOf('googleusercontent.com') !== -1) {
          var dId = extractDriveId(mediaUrl);
          if (dId) {
            if (mediaType === 'video') {
              mediaUrl = 'https://drive.google.com/file/d/' + dId + '/preview';
            } else if (mediaType === 'photo') {
              mediaUrl = 'https://drive.google.com/thumbnail?id=' + dId + '&sz=w1000';
            }
          }
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

      // If video attached, cross-log to Videos tab
      if (mediaType === 'video') {
        var videoSheet = ss.getSheetByName('Videos') || ss.insertSheet('Videos');
        if (videoSheet.getLastRow() === 0) {
          videoSheet.appendRow(['Timestamp', 'Local Time', 'Celebrant', 'Dedicated By', 'Video Caption', 'Moment Tag', 'Video Link / Stream URL']);
          var vHeader = videoSheet.getRange(1, 1, 1, 7);
          vHeader.setFontWeight('bold').setFontFamily('Arial').setFontColor('#831843').setBackground('#fce7f3').setHorizontalAlignment('center');
          videoSheet.setFrozenRows(1);
        }
        videoSheet.appendRow([
          new Date(),
          data.localTime || new Date().toLocaleString(),
          data.celebrant || 'Nishika',
          author,
          message || 'Royal video dedication for Queen Nishika 🎬',
          data.tag || 'Video Reel 🎬',
          mediaUrl || 'Uploaded Video'
        ]);
      } else if (mediaType === 'photo' && mediaUrl) {
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
        message: 'Wish note saved to Google Sheet & Google Drive successfully!'
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
      var dataUrl = data.dataUrl || data.base64 || data.mediaData || data.mediaUrl || '';
      var sender = data.author || data.name || data.dedicatedBy || 'Dilip';
      var caption = data.caption || data.message || data.title || 'Our unforgettable memory';

      if (dataUrl && dataUrl.indexOf('data:image') === 0) {
        var driveResult = saveBase64ToDrive(dataUrl, 'Photo_' + sender, false);
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

      // Also log into Wishes tab for live Sticky Wall visibility
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
    // CASE C: VIDEO REEL UPLOAD (Saved to Drive + Logged in Videos & Wishes Tab)
    // ------------------------------------------------------------------------
    else if (type === 'video') {
      var sheet = ss.getSheetByName('Videos') || ss.insertSheet('Videos');

      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Timestamp', 'Local Time', 'Celebrant', 'Dedicated By', 'Video Caption', 'Moment Tag', 'Video Link / Stream URL']);
        var header = sheet.getRange(1, 1, 1, 7);
        header.setFontWeight('bold')
              .setFontFamily('Arial')
              .setFontColor('#831843')
              .setBackground('#fce7f3')
              .setHorizontalAlignment('center');
        sheet.setFrozenRows(1);
      }

      var videoLink = data.videoUrl || data.mediaUrl || data.mediaData || data.dataUrl || data.mediaLink || '';
      var sender = data.author || data.name || data.dedicatedBy || 'Dilip';
      var caption = data.caption || data.message || data.title || 'Royal video dedication for Queen Nishika 🎬';

      if (videoLink && videoLink.indexOf('data:video') === 0) {
        var driveResult = saveBase64ToDrive(videoLink, 'Video_' + sender, true);
        if (driveResult && driveResult.mediaUrl) {
          videoLink = driveResult.mediaUrl;
        } else if (driveResult && driveResult.fileUrl) {
          videoLink = driveResult.fileUrl;
        } else {
          videoLink = '[Uploaded Video: ' + sender + ']';
        }
      } else if (videoLink) {
        if (videoLink.indexOf('drive.google.com') !== -1 || videoLink.indexOf('docs.google.com') !== -1 || videoLink.indexOf('googleusercontent.com') !== -1) {
          var dId = extractDriveId(videoLink);
          if (dId) {
            videoLink = 'https://drive.google.com/file/d/' + dId + '/preview';
          }
        }
      }

      sheet.appendRow([
        new Date(),
        data.localTime || new Date().toLocaleString(),
        data.celebrant || 'Nishika',
        sender,
        caption,
        data.tag || 'Video Reel 🎬',
        videoLink
      ]);

      // Also log into Wishes tab for live Sticky Wall visibility
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
        'video',
        videoLink,
        1
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        type: 'video',
        mediaUrl: videoLink,
        mediaType: 'video',
        message: 'Video reel saved to Google Drive and logged in Google Sheet!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ------------------------------------------------------------------------
    // CASE D: SECRET TIME CAPSULE WISH
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

  // 3. Videos Tab
  var videoSheet = ss.getSheetByName('Videos') || ss.insertSheet('Videos');
  var videoHeaders = ['Timestamp', 'Local Time', 'Celebrant', 'Dedicated By', 'Video Caption', 'Moment Tag', 'Video Link / Stream URL'];
  videoSheet.getRange(1, 1, 1, 7).setValues([videoHeaders]);
  videoSheet.getRange(1, 1, 1, 7)
    .setFontWeight('bold')
    .setFontFamily('Arial')
    .setFontColor('#831843')
    .setBackground('#fce7f3')
    .setHorizontalAlignment('center');
  videoSheet.setFrozenRows(1);

  // 4. Secret Wishes Tab
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

  Logger.log('👑 All 4 Eternal Love Sheet Tabs Initialized & Formatted Successfully!');
}
