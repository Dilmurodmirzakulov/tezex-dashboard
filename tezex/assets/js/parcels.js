/**
 * Tezex Dashboard - Parcels Management
 */

'use strict';

(function () {
  let parcels = JSON.parse(localStorage.getItem('tezex_parcels') || '[]');
  let filteredParcels = [...parcels];

  // Load parcels table
  function loadParcelsTable() {
    const tableBody = document.getElementById('parcelsTableBody');

    if (!tableBody) return;

    if (filteredParcels.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-4">
            <div class="empty-state">
              <i class="bx bx-package bx-lg"></i>
              <h5>No parcels found</h5>
              <p>Create your first parcel to get started</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filteredParcels
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
            <span class="fw-medium tracking-number">${parcel.trackingNumber}</span>
          </td>
          <td>${parcel.clientName}</td>
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
                <a class="dropdown-item" href="details.html?id=${parcel.id}">
                  <i class="bx bx-show me-1"></i> View Details
                </a>
                <a class="dropdown-item" href="../tracking-management.html?tracking=${parcel.trackingNumber}">
                  <i class="bx bx-map me-1"></i> Track
                </a>
                <a class="dropdown-item text-danger" href="javascript:void(0);" onclick="deleteParcel(${parcel.id})">
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
      applyFilters();
    });
  }

  // Status filter
  const statusFilter = document.getElementById('statusFilter');
  if (statusFilter) {
    statusFilter.addEventListener('change', function () {
      applyFilters();
    });
  }

  // Apply filters
  function applyFilters() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const statusValue = statusFilter ? statusFilter.value : '';

    filteredParcels = parcels.filter(parcel => {
      const matchesSearch =
        searchTerm === '' ||
        parcel.trackingNumber.toLowerCase().includes(searchTerm) ||
        parcel.clientName.toLowerCase().includes(searchTerm) ||
        parcel.destination.toLowerCase().includes(searchTerm);

      const matchesStatus = statusValue === '' || parcel.status === statusValue;

      return matchesSearch && matchesStatus;
    });

    loadParcelsTable();
  }

  // Delete parcel function
  window.deleteParcel = function (parcelId) {
    if (!confirm('Are you sure you want to delete this parcel?')) return;

    parcels = parcels.filter(p => p.id !== parcelId);
    localStorage.setItem('tezex_parcels', JSON.stringify(parcels));

    // Update client's total shipments
    const parcel = parcels.find(p => p.id === parcelId);
    if (parcel) {
      updateClientShipmentCount(parcel.clientId, -1);
    }

    // Reload table
    filteredParcels = [...parcels];
    applyFilters();

    alert('Parcel deleted successfully!');
  };

  // Update client shipment count
  function updateClientShipmentCount(clientId, delta) {
    const clients = JSON.parse(localStorage.getItem('tezex_clients') || '[]');
    const clientIndex = clients.findIndex(c => c.id === clientId);
    if (clientIndex !== -1) {
      clients[clientIndex].totalShipments += delta;
      localStorage.setItem('tezex_clients', JSON.stringify(clients));
    }
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

  // Initial load
  if (document.getElementById('parcelsTableBody')) {
    loadParcelsTable();
  }
})();
