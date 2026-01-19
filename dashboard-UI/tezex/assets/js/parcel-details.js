/**
 * Tezex Dashboard - Parcel Details Page
 */

'use strict';

(function () {
  // Get parcel ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const parcelId = parseInt(urlParams.get('id'));

  if (!parcelId) {
    alert('Parcel ID not found');
    window.location.href = 'list.html';
    return;
  }

  // Load data from localStorage
  const parcels = JSON.parse(localStorage.getItem('tezex_parcels') || '[]');
  const parcel = parcels.find(p => p.id === parcelId);

  if (!parcel) {
    alert('Parcel not found');
    window.location.href = 'list.html';
    return;
  }

  // Display parcel information
  document.getElementById('trackingNumber').textContent = parcel.trackingNumber;
  document.getElementById('parcelStatus').innerHTML = getStatusBadge(parcel.status);
  document.getElementById('clientName').textContent = parcel.clientName;
  document.getElementById('destination').textContent = parcel.destination;
  document.getElementById('weight').textContent = parcel.weight + ' kg';
  document.getElementById('price').textContent = '$' + parcel.price.toFixed(2);
  document.getElementById('description').textContent = parcel.description || 'No description provided';
  document.getElementById('dubayTracking').textContent = parcel.dubayTracking || 'Not assigned yet';

  const createdDate = new Date(parcel.createdAt).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  document.getElementById('createdAt').textContent = createdDate;

  const updatedDate = new Date(parcel.updatedAt).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  document.getElementById('updatedAt').textContent = updatedDate;

  // Status timeline
  const statusTimeline = document.getElementById('statusTimeline');
  const allStatuses = ['Received', 'Processing', 'Sent to Dubay', 'In Transit', 'Out for Delivery', 'Delivered'];
  const currentStatusIndex = allStatuses.indexOf(parcel.status);

  if (statusTimeline) {
    statusTimeline.innerHTML = allStatuses
      .map((status, index) => {
        const isCompleted = index <= currentStatusIndex;
        const isCurrent = index === currentStatusIndex;

        return `
        <div class="status-timeline-item ${isCompleted ? 'completed' : ''}">
          <div class="d-flex align-items-center mb-2">
            ${isCompleted ? '<i class="bx bx-check-circle text-success me-2"></i>' : '<i class="bx bx-circle text-muted me-2"></i>'}
            <h6 class="mb-0 ${isCurrent ? 'text-primary' : ''}">${status}</h6>
          </div>
          ${isCurrent ? '<small class="text-muted">Current status</small>' : ''}
        </div>
      `;
      })
      .join('');
  }

  // Update status form
  const updateStatusForm = document.getElementById('updateStatusForm');
  if (updateStatusForm) {
    const statusSelect = document.getElementById('newStatus');
    statusSelect.value = parcel.status;

    updateStatusForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const newStatus = statusSelect.value;
      const dubayTracking = document.getElementById('newDubayTracking').value;

      parcel.status = newStatus;
      if (dubayTracking) {
        parcel.dubayTracking = dubayTracking;
      }
      parcel.updatedAt = new Date().toISOString();

      const parcelIndex = parcels.findIndex(p => p.id === parcelId);
      if (parcelIndex !== -1) {
        parcels[parcelIndex] = parcel;
        localStorage.setItem('tezex_parcels', JSON.stringify(parcels));

        alert('Parcel status updated successfully!');
        location.reload();
      }
    });
  }

  // Helper function
  function getStatusBadge(status) {
    const badges = {
      Received: '<span class="badge bg-primary">Received</span>',
      Processing: '<span class="badge bg-warning">Processing</span>',
      'Sent to Dubay': '<span class="badge bg-info">Sent to Dubay</span>',
      'In Transit': '<span class="badge bg-info">In Transit</span>',
      'Out for Delivery': '<span class="badge" style="background-color: #00cfe8;">Out for Delivery</span>',
      Delivered: '<span class="badge bg-success">Delivered</span>',
      Returned: '<span class="badge bg-danger">Returned</span>'
    };
    return badges[status] || `<span class="badge bg-secondary">${status}</span>`;
  }
})();
