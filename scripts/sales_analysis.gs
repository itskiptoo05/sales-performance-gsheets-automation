function categorizePerformance() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Master');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const totalSaleIndex = headers.indexOf("Total Sale (KES)");
  const dateIndex = headers.indexOf("Date");
  const productIndex = headers.indexOf("Product");

  // Ensure the new columns exist or create them
  const ensureColumn = (colName) => {
    let index = headers.indexOf(colName);
    if (index === -1) {
      index = headers.length;
      sheet.getRange(1, index + 1).setValue(colName);
      headers.push(colName); // Keep local headers updated
    }
    return index;
  };

  const categoryIndex = ensureColumn("Performance Category");
  const monthIndex = ensureColumn("Month");
  const prodCatIndex = ensureColumn("Product Category");
  const prodModelIndex = ensureColumn("Product Model");

  for (let i = 1; i < data.length; i++) {
    const total = data[i][totalSaleIndex];
    const date = data[i][dateIndex];
    const product = data[i][productIndex];

    if (typeof total !== 'number') continue;

    // 🟢 Performance Category
    let category = '';
    if (total > 100000) category = 'High';
    else if (total >= 50000) category = 'Medium';
    else category = 'Low';

    // 🟢 Month
    let month = '';
    if (date instanceof Date) {
      month = Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM");
    }

    // 🟢 Product Category & Model
    let prodCat = '', prodModel = '';
    if (product && typeof product === 'string' && product.includes(' - ')) {
      const parts = product.split(' - ');
      prodCat = parts[0].trim();
      prodModel = parts.slice(1).join(' - ').trim(); // In case of multiple hyphens
    }

    // 📝 Set values in respective columns
    sheet.getRange(i + 1, categoryIndex + 1).setValue(category);
    sheet.getRange(i + 1, monthIndex + 1).setValue(month);
    sheet.getRange(i + 1, prodCatIndex + 1).setValue(prodCat);
    sheet.getRange(i + 1, prodModelIndex + 1).setValue(prodModel);
  }
}
