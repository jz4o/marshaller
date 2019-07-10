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
}
