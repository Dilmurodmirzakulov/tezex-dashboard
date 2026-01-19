/**
 * Tezex Dashboard - Client Details Page
 */

'use strict';

(function () {
  // Get client ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = parseInt(urlParams.get('id'));

  if (!clientId) {
    alert('Client ID not found');
    window.location.href = 'list.html';
    return;
  }

  // Load data from localStorage
  const clients = JSON.parse(localStorage.getItem('tezex_clients') || '[]');
  const parcels = JSON.parse(localStorage.getItem('tezex_parcels') || '[]');

  // Find client
  const client = clients.find(c => c.id === clientId);

  if (!client) {
    alert('Client not found');
    window.location.href = 'list.html';
    return;
  }

  // Get client's shipments
  const clientShipments = parcels.filter(p => p.clientId === clientId);

  // Display client information
  document.getElementById('clientNameTitle').textContent = client.name;
  document.getElementById('clientAvatar').textContent = client.name.charAt(0).toUpperCase();
  document.getElementById('clientName').textContent = client.name;
  document.getElementById('clientEmail').textContent = client.email;
  document.getElementById('clientPhone').textContent = client.phone;
  document.getElementById('clientAddress').textContent = client.address;

  const joinDate = new Date(client.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  document.getElementById('clientJoinDate').textContent = joinDate;

  // Calculate statistics
  const totalShipments = clientShipments.length;
  const deliveredShipments = clientShipments.filter(p => p.status === 'Delivered').length;
  const activeShipments = clientShipments.filter(p => !['Delivered', 'Returned'].includes(p.status)).length;

  document.getElementById('totalShipments').textContent = totalShipments;
  document.getElementById('deliveredShipments').textContent = deliveredShipments;
  document.getElementById('activeShipments').textContent = activeShipments;

  // Load shipments table
  const shipmentsTableBody = document.getElementById('shipmentsTableBody');

  if (clientShipments.length === 0) {
    shipmentsTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-4">
          <div class="empty-state">
            <i class="bx bx-package bx-lg"></i>
            <h5>No shipments found</h5>
            <p>This client hasn't made any shipments yet</p>
          </div>
        </td>
      </tr>
    `;
  } else {
    shipmentsTableBody.innerHTML = clientShipments
      .map(parcel => {
        const statusBadge = getStatusBadge(parcel.status);
        const formattedDate = new Date(parcel.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        return `
        <tr>
          <td>
            <span class="fw-medium">${parcel.trackingNumber}</span>
          </td>
          <td>${parcel.destination}</td>
          <td>${parcel.weight} kg</td>
          <td>$${parcel.price.toFixed(2)}</td>
          <td>${statusBadge}</td>
          <td>${formattedDate}</td>
          <td>
            <div class="dropdown">
              <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                <i class="bx bx-dots-vertical-rounded"></i>
              </button>
              <div class="dropdown-menu">
                <a class="dropdown-item" href="../parcels/details.html?id=${parcel.id}">
                  <i class="bx bx-show me-1"></i> View Details
                </a>
                <a class="dropdown-item" href="../tracking-management.html?tracking=${parcel.trackingNumber}">
                  <i class="bx bx-map me-1"></i> Track
                </a>
              </div>
            </div>
          </td>
        </tr>
      `;
      })
      .join('');
  }

  // Helper function to get status badge
  function getStatusBadge(status) {
    const badges = {
      Received: '<span class="badge rounded-pill bg-label-primary">Received</span>',
      Processing: '<span class="badge rounded-pill bg-label-warning">Processing</span>',
      'Sent to Dubay': '<span class="badge rounded-pill bg-label-info">Sent to Dubay</span>',
      'In Transit': '<span class="badge rounded-pill bg-label-info">In Transit</span>',
      'Out for Delivery': '<span class="badge rounded-pill bg-label-cyan">Out for Delivery</span>',
      Delivered: '<span class="badge rounded-pill bg-label-success">Delivered</span>',
      Returned: '<span class="badge rounded-pill bg-label-danger">Returned</span>'
    };
    return badges[status] || `<span class="badge rounded-pill bg-label-secondary">${status}</span>`;
  }

  // Edit client function
  window.editClientFromDetails = function () {
    window.location.href = `list.html?edit=${clientId}`;
  };
})();
