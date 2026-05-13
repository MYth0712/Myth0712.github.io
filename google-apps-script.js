/**
 * Google Apps Script — Portfolio Analytics Backend
 *
 * Setup:
 * 1. Go to script.google.com and create a new project
 * 2. Paste this entire file into Code.gs
 * 3. Click Deploy > New deployment > Web app
 * 4. Set "Execute as" = Me, "Who has access" = Anyone
 * 5. Copy the deployment URL
 * 6. Paste it into data.json as the "trackingUrl" value
 */

const SHEET_NAME = 'Events';

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'timestamp', 'type', 'session', 'page',
      'device', 'browser', 'screen', 'language', 'referrer',
      'city', 'region', 'country', 'ip',
      'element', 'label', 'query'
    ]);
    sheet.getRange(1, 1, 1, sheet.getLastColumn())
      .setFontWeight('bold')
      .setBackground('#1a1a2e')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    const d = data.detail || {};

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.type || '',
      data.session || '',
      data.page || '',
      d.device || '',
      d.browser || '',
      d.screen || '',
      d.language || '',
      d.referrer || '',
      d.city || '',
      d.region || '',
      d.country || '',
      d.ip || '',
      d.element || '',
      d.label || '',
      d.query || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const headers = rows[0];
    const events = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      events.push({
        timestamp: row[0],
        type: row[1],
        session: row[2],
        page: row[3],
        detail: {
          device: row[4],
          browser: row[5],
          screen: row[6],
          language: row[7],
          referrer: row[8],
          city: row[9],
          region: row[10],
          country: row[11],
          ip: row[12],
          element: row[13],
          label: row[14],
          query: row[15]
        }
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify(events))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
