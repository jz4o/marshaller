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

/**
 * POST用のトークンをスクリプトプロパティにセットする.
 */
function setPostToken() {
  var token = generateRandomString(24);
  PropertiesService.getScriptProperties().setProperty('POST_TOKEN', token);
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
