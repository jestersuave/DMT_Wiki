const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  // Construct the file path for index.html relative to the script's execution directory
  const filePath = 'file://' + process.cwd() + '/index.html';
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  const tableData = await page.evaluate(() => {
    const table = document.getElementById('jsonTable');
    if (!table) return { headers: [], rows: [] };

    const headers = Array.from(table.querySelectorAll('thead tr th')).map(th => th.textContent.trim());
    const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => {
      return Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim());
    });
    return { headers, rows };
  });

  fs.writeFileSync('output.json', JSON.stringify(tableData, null, 2));
  console.log('Table data extracted to output.json');

  // For direct console output to check in the tool
  console.log('Headers:', tableData.headers.join(', '));
  tableData.rows.forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row.join(', '));
  });

  await browser.close();
})();
