/**
 * Tezex Dashboard - Pricing Import Page (Excel)
 */

'use strict';

(function () {
  const fileInput = document.getElementById('excelFile');
  const previewSection = document.getElementById('previewSection');
  const previewTable = document.getElementById('previewTableBody');
  const importBtn = document.getElementById('importBtn');
  const previewCount = document.getElementById('previewCount');

  let parsedData = [];

  // Note: SheetJS library needs to be included for production
  // For demo purposes, we'll use a simple CSV parser

  if (fileInput) {
    fileInput.addEventListener('change', handleFileSelect);
  }

  function handleFileSelect(e) {
    const file = e.target.files[0];

    if (!file) return;

    // Check file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls') && !fileName.endsWith('.csv')) {
      alert('Please select an Excel file (.xlsx, .xls) or CSV file');
      return;
    }

    // For demo: Show manual entry instructions
    if (fileName.endsWith('.csv')) {
      readCSVFile(file);
    } else {
      showExcelMessage();
    }
  }

  function readCSVFile(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const text = e.target.result;
      parseCSV(text);
    };

    reader.readAsText(file);
  }

  function parseCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    parsedData = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;

      const values = lines[i].split(',').map(v => v.trim());
      const row = {};

      headers.forEach((header, index) => {
        row[header] = values[index];
      });

      if (row.country && row.country !== '') {
        parsedData.push(row);
      }
    }

    displayPreview();
  }

  function showExcelMessage() {
    previewSection.style.display = 'block';
    previewTable.innerHTML = `
      <tr>
        <td colspan="15" class="text-center py-4">
          <div class="alert alert-info">
            <h6><i class="bx bx-info-circle me-2"></i>Excel File Selected</h6>
            <p class="mb-3">For full Excel support, the SheetJS library needs to be integrated.</p>
            <p class="mb-0"><strong>Demo Mode:</strong> Use the sample data button or upload a CSV file instead.</p>
          </div>
        </td>
      </tr>
    `;

    if (importBtn) {
      importBtn.disabled = true;
    }
  }

  function displayPreview() {
    if (parsedData.length === 0) return;

    previewSection.style.display = 'block';

    if (previewCount) {
      previewCount.textContent = `${parsedData.length} countries found`;
    }

    previewTable.innerHTML = parsedData
      .slice(0, 10)
      .map(
        row => `
      <tr>
        <td>${row.country || row.Country}</td>
        <td>${row['0.5'] || row['0-5'] || '-'}</td>
        <td>${row['1'] || '-'}</td>
        <td>${row['2'] || '-'}</td>
        <td>${row['3'] || '-'}</td>
        <td>${row['5'] || '-'}</td>
        <td>${row['10'] || '-'}</td>
        <td>${row['15'] || '-'}</td>
        <td>${row['20'] || '-'}</td>
        <td>${row['30'] || '-'}</td>
        <td>${row['40'] || '-'}</td>
        <td>${row['50'] || '-'}</td>
        <td>${row['60'] || '-'}</td>
        <td>${row['70'] || '-'}</td>
        <td>${row['perKgAbove70'] || row['Per KG > 70'] || '-'}</td>
      </tr>
    `
      )
      .join('');

    if (parsedData.length > 10) {
      previewTable.innerHTML += `
        <tr>
          <td colspan="15" class="text-center text-muted">
            ... and ${parsedData.length - 10} more countries
          </td>
        </tr>
      `;
    }

    if (importBtn) {
      importBtn.disabled = false;
    }
  }

  // Import button
  if (importBtn) {
    importBtn.addEventListener('click', function () {
      if (parsedData.length === 0) {
        alert('No data to import');
        return;
      }

      // Transform data for import
      const transformedData = parsedData.map(row => ({
        country: row.country || row.Country,
        0.5: parseFloat(row['0.5'] || row['0-5']) || 0,
        1: parseFloat(row['1']) || 0,
        2: parseFloat(row['2']) || 0,
        3: parseFloat(row['3']) || 0,
        5: parseFloat(row['5']) || 0,
        10: parseFloat(row['10']) || 0,
        15: parseFloat(row['15']) || 0,
        20: parseFloat(row['20']) || 0,
        30: parseFloat(row['30']) || 0,
        40: parseFloat(row['40']) || 0,
        50: parseFloat(row['50']) || 0,
        60: parseFloat(row['60']) || 0,
        70: parseFloat(row['70']) || 0,
        perKgAbove70: parseFloat(row['perKgAbove70'] || row['Per KG > 70']) || 0
      }));

      const count = TezexPriceCalculator.importPricing(transformedData);

      alert(`Successfully imported pricing for ${count} countries!`);
      window.location.href = 'list.html';
    });
  }

  // Load sample data button
  const loadSampleBtn = document.getElementById('loadSampleBtn');
  if (loadSampleBtn) {
    loadSampleBtn.addEventListener('click', function () {
      // Use existing pricing data as sample
      const existingPricing = JSON.parse(localStorage.getItem('tezex_pricing') || '{}');
      parsedData = TezexPriceCalculator.exportPricing();

      displayPreview();
      alert('Sample data loaded! Click "Import Pricing" to save.');
    });
  }
})();
