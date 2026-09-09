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

// 1. GET Handler (Fetch Live Wishes, Photos & Videos for Website Display)
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = (e && e.parameter && e.parameter.action) || 'getAll';

    // Helper: Extract Google Drive File ID
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

    // Helper: Detect if URL is a Video
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
        str.indexOf('data:video') !== -1
      );
    }

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
      var videoValues = videoSheet.getRange(2, 1, videoSheet.getLastRow() - 1, Math.max(videoSheet.getLastColumn(), 8)).getValues();
      for (var k = videoValues.length - 1; k >= 0; k--) {
        var vRow = videoValues[k];
        var vLink = vRow[6] ? vRow[6].toString().trim() : '';
        var vId = extractDriveId(vLink);
        var previewUrl = vLink;

        if (vId) {
          previewUrl = 'https://drive.google.com/file/d/' + vId + '/preview';
        }

        var vCaption = vRow[4] ? vRow[4].toString().trim() : 'Royal video memory 🎬';
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

// 2. POST Handler (Webhook Data Receiver: Wishes, Photos, Videos, Capsule)
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

    // Helper: Save Base64 file into Google Drive
    function saveBase64ToDrive(base64Uri, fileNamePrefix, isVideoFile) {
      try {
        var folderName = 'Eternal Love Wishes (Queen Nishika)';
        var folders = DriveApp.getFoldersByName(folderName);
        var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

        var mimeType = base64Uri.substring(5, base64Uri.indexOf(';')) || (isVideoFile ? 'video/mp4' : 'image/jpeg');
        var rawBase64 = base64Uri.substring(base64Uri.indexOf(',') + 1);
        var dateFormatted = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'GMT+0530', 'yyyy-MM-dd_HH-mm-ss');
        var ext = isVideoFile ? '.mp4' : '.jpg';
        var safePrefix = (fileNamePrefix || 'Memory').replace(/[^a-zA-Z0-9]/g, '_');
        var fileName = safePrefix + '_' + dateFormatted + ext;

        var blob = Utilities.newBlob(Utilities.base64Decode(rawBase64), mimeType, fileName);
        var file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

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
        return null;
      }
    }

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
      var mediaType = data.mediaType || 'none';
      var mediaUrl = data.mediaUrl || data.mediaLink || data.mediaData || data.dataUrl || data.videoUrl || '';

      // If Base64 image or video is uploaded, store in Google Drive
      if (mediaUrl && (mediaUrl.indexOf('data:image') === 0 || mediaUrl.indexOf('data:video') === 0)) {
        var isVideo = mediaUrl.indexOf('data:video') === 0 || mediaType === 'video';
        var driveResult = saveBase64ToDrive(mediaUrl, 'Wish_' + author, isVideo);
        if (driveResult) {
          mediaUrl = driveResult.mediaUrl;
          mediaType = isVideo ? 'video' : 'photo';
        } else {
          mediaUrl = '';
        }
      } else if (mediaUrl) {
        // Direct link normalizer (Google Drive / YouTube / Vimeo / etc.)
        if (mediaUrl.indexOf('drive.google.com') !== -1 || mediaUrl.indexOf('docs.google.com') !== -1) {
          var m1 = mediaUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
          var m2 = mediaUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
          var dId = (m1 && m1[1]) || (m2 && m2[1]);
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
      var dataUrl = data.dataUrl || data.base64 || data.mediaData || data.mediaUrl || '';
      var sender = data.author || data.name || data.dedicatedBy || 'Dilip';
      var caption = data.caption || data.message || data.title || 'Our unforgettable memory';

      if (dataUrl && dataUrl.indexOf('data:image') === 0) {
        var driveResult = saveBase64ToDrive(dataUrl, 'Photo_' + sender, false);
        if (driveResult) {
          fileUrl = driveResult.fileUrl;
          directImgUrl = driveResult.mediaUrl;
          imageFormula = '=IMAGE("' + directImgUrl + '")';
        }
      } else if (dataUrl) {
        directImgUrl = dataUrl;
        fileUrl = dataUrl;
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
      sheet.setRowHeight(lastRow, 90);

      // Also log into Wishes tab for live Sticky Wall visibility
      var wishSheet = ss.getSheetByName('Wishes') || ss.insertSheet('Wishes');
      wishSheet.appendRow([
        new Date(),
        data.localTime || new Date().toLocaleString(),
        data.celebrant || 'Nishika',
        sender,
        sender,
        caption,
        'gold',
        'photo',
        directImgUrl,
        1
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        type: 'photo',
        fileUrl: fileUrl,
        imgUrl: directImgUrl,
        mediaUrl: directImgUrl,
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

      var videoLink = data.videoUrl || data.mediaUrl || data.mediaData || data.dataUrl || '';
      var sender = data.author || data.name || data.dedicatedBy || 'Dilip';
      var caption = data.caption || data.message || data.title || 'Royal video dedication for Queen Nishika 🎬';

      if (videoLink && videoLink.indexOf('data:video') === 0) {
        var driveResult = saveBase64ToDrive(videoLink, 'Video_' + sender, true);
        if (driveResult) {
          videoLink = driveResult.mediaUrl;
        }
      } else if (videoLink) {
        if (videoLink.indexOf('drive.google.com') !== -1 || videoLink.indexOf('docs.google.com') !== -1) {
          var m1 = videoLink.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
          var m2 = videoLink.match(/[?&]id=([a-zA-Z0-9_-]+)/);
          var dId = (m1 && m1[1]) || (m2 && m2[1]);
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
