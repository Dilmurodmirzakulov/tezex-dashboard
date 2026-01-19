/**
 * Tezex Dashboard - Create Parcel with Price Calculator
 */

'use strict';

(function () {
  const clients = JSON.parse(localStorage.getItem('tezex_clients') || '[]');
  const countries = TezexPriceCalculator.getAvailableCountries();

  // Populate client dropdown
  const clientSelect = document.getElementById('parcelClient');
  if (clientSelect) {
    clientSelect.innerHTML =
      '<option value="">Select Client</option>' +
      clients.map(client => `<option value="${client.id}">${client.name}</option>`).join('');
  }

  // Populate country dropdown
  const countrySelect = document.getElementById('parcelDestination');
  if (countrySelect) {
    countrySelect.innerHTML =
      '<option value="">Select Destination</option>' +
      countries.map(country => `<option value="${country}">${country}</option>`).join('');
  }

  // Price calculation
  const weightInput = document.getElementById('parcelWeight');
  const priceDisplay = document.getElementById('calculatedPrice');
  const priceBreakdown = document.getElementById('priceBreakdown');

  function calculateAndDisplayPrice() {
    const country = countrySelect ? countrySelect.value : '';
    const weight = weightInput ? parseFloat(weightInput.value) : 0;

    if (!country || !weight || weight <= 0) {
      if (priceDisplay) priceDisplay.textContent = '$0.00';
      if (priceBreakdown)
        priceBreakdown.innerHTML = '<small class="text-muted">Enter weight and destination to calculate price</small>';
      return;
    }

    const price = TezexPriceCalculator.calculatePrice(country, weight);

    if (priceDisplay) {
      priceDisplay.textContent = formatCurrency(price);
    }

    // Show breakdown for overweight parcels
    if (priceBreakdown && weight > 70) {
      const countryPricing = TezexPriceCalculator.getCountryPricing(country);
      const base70Price = parseFloat(countryPricing['70']);
      const perKgRate = parseFloat(countryPricing['perKgAbove70']);
      const excessWeight = weight - 70;
      const excessCharge = excessWeight * perKgRate;

      priceBreakdown.innerHTML = `
        <div class="alert alert-info mt-3">
          <small>
            <strong>Price Breakdown:</strong><br>
            Base (70kg): $${base70Price.toFixed(2)}<br>
            Excess (${excessWeight.toFixed(1)}kg × $${perKgRate.toFixed(2)}): $${excessCharge.toFixed(2)}<br>
            <strong>Total: $${price.toFixed(2)}</strong>
          </small>
        </div>
      `;
    } else if (priceBreakdown) {
      priceBreakdown.innerHTML = '';
    }
  }

  if (countrySelect) {
    countrySelect.addEventListener('change', calculateAndDisplayPrice);
  }

  if (weightInput) {
    weightInput.addEventListener('input', calculateAndDisplayPrice);
  }

  // Generate tracking number
  function generateTrackingNumber() {
    const counter = JSON.parse(localStorage.getItem('tezex_tracking_counter') || '{"lastDate":"","counter":0}');
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');

    // Reset counter if new day
    if (counter.lastDate !== dateStr) {
      counter.lastDate = dateStr;
      counter.counter = 1;
    } else {
      counter.counter++;
    }

    const trackingNumber = `TZX-${dateStr}-${String(counter.counter).padStart(3, '0')}`;

    localStorage.setItem('tezex_tracking_counter', JSON.stringify(counter));

    return trackingNumber;
  }

  // Form submission
  const createParcelForm = document.getElementById('createParcelForm');
  if (createParcelForm) {
    createParcelForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const clientId = parseInt(clientSelect.value);
      const client = clients.find(c => c.id === clientId);

      if (!client) {
        alert('Please select a valid client');
        return;
      }

      const destination = countrySelect.value;
      const weight = parseFloat(weightInput.value);
      const description = document.getElementById('parcelDescription').value;

      if (!destination || weight <= 0) {
        alert('Please fill in all required fields');
        return;
      }

      const price = TezexPriceCalculator.calculatePrice(destination, weight);
      const trackingNumber = generateTrackingNumber();

      const parcels = JSON.parse(localStorage.getItem('tezex_parcels') || '[]');
      const newParcel = {
        id: parcels.length > 0 ? Math.max(...parcels.map(p => p.id)) + 1 : 1,
        trackingNumber: trackingNumber,
        clientId: clientId,
        clientName: client.name,
        destination: destination,
        weight: weight,
        price: price,
        description: description,
        status: 'Received',
        dubayTracking: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      parcels.push(newParcel);
      localStorage.setItem('tezex_parcels', JSON.stringify(parcels));

      // Update client's total shipments
      client.totalShipments++;
      const clientsData = JSON.parse(localStorage.getItem('tezex_clients') || '[]');
      const clientIndex = clientsData.findIndex(c => c.id === clientId);
      if (clientIndex !== -1) {
        clientsData[clientIndex].totalShipments = client.totalShipments;
        localStorage.setItem('tezex_clients', JSON.stringify(clientsData));
      }

      alert(`Parcel created successfully!\nTracking Number: ${trackingNumber}`);
      window.location.href = 'list.html';
    });
  }
})();
