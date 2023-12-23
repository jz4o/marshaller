var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();

/**
 * 受取った引数をもとにシートに行を追加.
 *
 * @param hash json シートに登録する内容
 *   {
 *     'sheet': '<sheetName>',
 *     'data' : {
 *       '<columnName1>': '<value1>',
 *       '<columnName2>': '<value2>',
 *       ...
 *       '<columnNameN>': '<valueN>'
 *     }
 *   }
 */
function marshall(json) {
  var sheet = spreadSheet.getSheetByName(json['sheet']);
  if (sheet == null) {
    sheet = spreadSheet.insertSheet(json['sheet']);
  }

  var column_names = sheet.getLastColumn() > 0 ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues().shift() : [];
  var add_column_names = [];
  for (column in json['data']) {
    if (column_names.indexOf(column) < 0) {
      add_column_names.push(column);
    }
  }
  if (add_column_names.length > 0) {
    sheet.getRange(1, column_names.length + 1, 1, add_column_names.length).setValues([add_column_names]);
    column_names = column_names.concat(add_column_names);
  }

  var values = [];
  for (var i = 0; i < column_names.length; i++) {
    values.push(json['data'][column_names[i]] || null);
  }
  sheet.appendRow(values);
}

function doGet(e) {
  if (e.parameter.token !== PropertiesService.getScriptProperties().getProperty('API_TOKEN')) {
    return;
  }

  var sheetName = e.parameter.sheet;
  var sheet = spreadSheet.getSheetByName(sheetName);
  if (sheet == null) {
    return [];
  }

  var rows = sheet.getDataRange().getValues();
  var columnNames = rows.shift();

  var responseBody;
  if (e.parameter.columns == undefined) {
    responseBody = rows.map(row => {
      var object = {};
      row.forEach((value, columnIndex) => {
        object[columnNames[columnIndex]] = value;
      });

      return object;
    });
  } else {
    var parameterColumnNames = e.parameter.columns?.split(',').filter(columnName => columnName);
    if (parameterColumnNames.length == 0) {
      responseBody = [];
    } else if (parameterColumnNames.length == 1) {
      var targetColumnName = parameterColumnNames[0];
      var targetColumnIndex = columnNames.indexOf(targetColumnName);

      responseBody = rows.map(row => row[targetColumnIndex]);
    } else {
      responseBody = rows.map(row => {
        var object = {};
        parameterColumnNames.forEach(parameterColumnName => {
          var columnIndex = columnNames.indexOf(parameterColumnName);
          object[parameterColumnName] = row[columnIndex];
        });

        return object;
      });
    }
  }

  var response = ContentService.createTextOutput();
  response.setMimeType(ContentService.MimeType.JSON);
  response.setContent(JSON.stringify({ rows: responseBody }));

  return response;
}

function doPost(e) {
  var request = JSON.parse(e['postData']['contents']);
  if (request['token'] != PropertiesService.getScriptProperties().getProperty('API_TOKEN')) {
    return;
  }

  marshall(request['parameter']);
}

/**
 * API用のトークンをスクリプトプロパティにセットする.
 */
function setAPIToken() {
  var token = generateRandomString(24);
  PropertiesService.getScriptProperties().setProperty('API_TOKEN', token);
}

/**
 * 指定の長さのランダムな英数字文字列を生成して返す.
 *
 * @param integer length 文字数
 *
 * @return string 英数字文字列
 */
function generateRandomString(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';

    for (var i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }

    return result;
}
