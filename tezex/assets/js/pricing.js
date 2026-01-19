/**
 * Tezex Dashboard - Pricing Management & Calculator
 */

'use strict';

// Price Calculator
window.TezexPriceCalculator = {
  /**
   * Calculate price for a parcel based on destination and weight
   * @param {string} country - Destination country
   * @param {number} weight - Weight in kg
   * @returns {number} - Calculated price
   */
  calculatePrice: function (country, weight) {
    const pricing = JSON.parse(localStorage.getItem('tezex_pricing') || '{}');

    if (!pricing[country]) {
      return 0;
    }

    const countryPricing = pricing[country];

    // If weight is greater than 70kg
    if (weight > 70) {
      const base70Price = parseFloat(countryPricing['70']);
      const perKgRate = parseFloat(countryPricing['perKgAbove70']);
      const excessWeight = weight - 70;
      return base70Price + excessWeight * perKgRate;
    }

    // Find the appropriate weight bracket
    const weightBrackets = Object.keys(countryPricing)
      .filter(key => key !== 'perKgAbove70')
      .map(Number)
      .sort((a, b) => a - b);

    // Find the exact match or closest higher bracket
    for (let bracket of weightBrackets) {
      if (weight <= bracket) {
        return parseFloat(countryPricing[bracket.toString()]);
      }
    }

    // If no bracket found, return the highest bracket price
    const highestBracket = weightBrackets[weightBrackets.length - 1];
    return parseFloat(countryPricing[highestBracket.toString()]);
  },

  /**
   * Get all available countries
   * @returns {Array} - Array of country names
   */
  getAvailableCountries: function () {
    const pricing = JSON.parse(localStorage.getItem('tezex_pricing') || '{}');
    return Object.keys(pricing).sort();
  },

  /**
   * Get pricing details for a country
   * @param {string} country - Country name
   * @returns {Object} - Pricing details
   */
  getCountryPricing: function (country) {
    const pricing = JSON.parse(localStorage.getItem('tezex_pricing') || '{}');
    return pricing[country] || null;
  },

  /**
   * Update pricing for a country
   * @param {string} country - Country name
   * @param {Object} priceData - Price data object
   */
  updateCountryPricing: function (country, priceData) {
    const pricing = JSON.parse(localStorage.getItem('tezex_pricing') || '{}');
    pricing[country] = priceData;
    localStorage.setItem('tezex_pricing', JSON.stringify(pricing));
  },

  /**
   * Delete pricing for a country
   * @param {string} country - Country name
   */
  deleteCountryPricing: function (country) {
    const pricing = JSON.parse(localStorage.getItem('tezex_pricing') || '{}');
    delete pricing[country];
    localStorage.setItem('tezex_pricing', JSON.stringify(pricing));
  },

  /**
   * Import pricing from parsed Excel data
   * @param {Array} data - Array of pricing data
   */
  importPricing: function (data) {
    const pricing = {};

    data.forEach(row => {
      if (row.country && row.country.trim() !== '') {
        pricing[row.country] = {
          0.5: parseFloat(row['0.5']) || 0,
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
          perKgAbove70: parseFloat(row['perKgAbove70']) || 0
        };
      }
    });

    localStorage.setItem('tezex_pricing', JSON.stringify(pricing));
    return Object.keys(pricing).length;
  },

  /**
   * Export pricing to downloadable format
   * @returns {Array} - Array of pricing data
   */
  exportPricing: function () {
    const pricing = JSON.parse(localStorage.getItem('tezex_pricing') || '{}');
    const data = [];

    Object.keys(pricing)
      .sort()
      .forEach(country => {
        const countryPricing = pricing[country];
        data.push({
          country: country,
          0.5: countryPricing['0.5'],
          1: countryPricing['1'],
          2: countryPricing['2'],
          3: countryPricing['3'],
          5: countryPricing['5'],
          10: countryPricing['10'],
          15: countryPricing['15'],
          20: countryPricing['20'],
          30: countryPricing['30'],
          40: countryPricing['40'],
          50: countryPricing['50'],
          60: countryPricing['60'],
          70: countryPricing['70'],
          perKgAbove70: countryPricing['perKgAbove70']
        });
      });

    return data;
  }
};

// Helper function to format currency
window.formatCurrency = function (amount) {
  return '$' + parseFloat(amount).toFixed(2);
};

// Helper function to get weight brackets
window.getWeightBrackets = function () {
  return ['0.5', '1', '2', '3', '5', '10', '15', '20', '30', '40', '50', '60', '70'];
};
