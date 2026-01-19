/**
 * Tezex Dashboard - Pricing List Page
 */

'use strict';

(function () {
  const pricing = JSON.parse(localStorage.getItem('tezex_pricing') || '{}');
  const countries = Object.keys(pricing).sort();
  let filteredCountries = [...countries];

  // Load pricing table
  function loadPricingTable() {
    const tableBody = document.getElementById('pricingTableBody');

    if (!tableBody) return;

    if (filteredCountries.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="15" class="text-center py-4">
            <div class="empty-state">
              <i class="bx bx-dollar bx-lg"></i>
              <h5>No pricing data found</h5>
              <p>Import pricing data to get started</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filteredCountries
      .map(country => {
        const countryPricing = pricing[country];
        return `
        <tr>
          <td><strong>${country}</strong></td>
          <td>$${countryPricing['0.5']}</td>
          <td>$${countryPricing['1']}</td>
          <td>$${countryPricing['2']}</td>
          <td>$${countryPricing['3']}</td>
          <td>$${countryPricing['5']}</td>
          <td>$${countryPricing['10']}</td>
          <td>$${countryPricing['15']}</td>
          <td>$${countryPricing['20']}</td>
          <td>$${countryPricing['30']}</td>
          <td>$${countryPricing['40']}</td>
          <td>$${countryPricing['50']}</td>
          <td>$${countryPricing['60']}</td>
          <td>$${countryPricing['70']}</td>
          <td class="text-primary"><strong>$${countryPricing['perKgAbove70']}</strong></td>
          <td>
            <div class="dropdown">
              <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                <i class="bx bx-dots-vertical-rounded"></i>
              </button>
              <div class="dropdown-menu">
                <a class="dropdown-item" href="edit.html?country=${encodeURIComponent(country)}">
                  <i class="bx bx-edit me-1"></i> Edit
                </a>
                <a class="dropdown-item text-danger" href="javascript:void(0);" onclick="deleteCountry('${country}')">
                  <i class="bx bx-trash me-1"></i> Delete
                </a>
              </div>
            </div>
          </td>
        </tr>
      `;
      })
      .join('');
  }

  // Search functionality
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      const searchTerm = e.target.value.toLowerCase();

      if (searchTerm === '') {
        filteredCountries = [...countries];
      } else {
        filteredCountries = countries.filter(country => country.toLowerCase().includes(searchTerm));
      }

      loadPricingTable();
    });
  }

  // Delete country function
  window.deleteCountry = function (country) {
    if (!confirm(`Are you sure you want to delete pricing for ${country}?`)) return;

    TezexPriceCalculator.deleteCountryPricing(country);

    alert('Country pricing deleted successfully!');
    location.reload();
  };

  // Initial load
  loadPricingTable();

  // Update count
  const totalCountriesElement = document.getElementById('totalCountries');
  if (totalCountriesElement) {
    totalCountriesElement.textContent = countries.length;
  }
})();
