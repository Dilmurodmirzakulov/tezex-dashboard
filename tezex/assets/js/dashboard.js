/**
 * Tezex Dashboard - Main Dashboard Page
 */

'use strict';

(function () {
  // Load data from localStorage
  const parcels = JSON.parse(localStorage.getItem('tezex_parcels') || '[]');
  const clients = JSON.parse(localStorage.getItem('tezex_clients') || '[]');

  // Update last updated time
  document.getElementById('lastUpdated').textContent = new Date().toLocaleString();

  // Calculate statistics
  const totalParcels = parcels.length;
  const totalClients = clients.length;

  // Active shipments (not Delivered or Returned)
  const activeShipments = parcels.filter(p => !['Delivered', 'Returned'].includes(p.status)).length;

  // Calculate monthly revenue (current month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = parcels
    .filter(p => {
      const date = new Date(p.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, p) => sum + (p.price || 0), 0);

  // Update statistics cards
  document.getElementById('totalParcels').textContent = totalParcels;
  document.getElementById('activeShipments').textContent = activeShipments;
  document.getElementById('totalClients').textContent = totalClients;
  document.getElementById('monthlyRevenue').textContent = '$' + monthlyRevenue.toFixed(2);

  // Status distribution
  const statusCounts = {
    Delivered: 0,
    'In Transit': 0,
    Processing: 0,
    Received: 0,
    Returned: 0
  };

  parcels.forEach(p => {
    if (statusCounts.hasOwnProperty(p.status)) {
      statusCounts[p.status]++;
    }
  });

  document.getElementById('deliveredCount').textContent = statusCounts['Delivered'];
  document.getElementById('inTransitCount').textContent = statusCounts['In Transit'];
  document.getElementById('processingCount').textContent = statusCounts['Processing'];
  document.getElementById('receivedCount').textContent = statusCounts['Received'];
  document.getElementById('returnedCount').textContent = statusCounts['Returned'];

  // Delivery Trends Chart
  const last7Days = [];
  const deliveredData = [];
  const inTransitData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    last7Days.push(dateStr);

    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));

    const delivered = parcels.filter(p => {
      const updatedDate = new Date(p.updatedAt);
      return p.status === 'Delivered' && updatedDate >= dayStart && updatedDate <= dayEnd;
    }).length;

    const inTransit = parcels.filter(p => {
      const createdDate = new Date(p.createdAt);
      return (
        ['In Transit', 'Out for Delivery', 'Sent to Dubay'].includes(p.status) &&
        createdDate >= dayStart &&
        createdDate <= dayEnd
      );
    }).length;

    deliveredData.push(delivered);
    inTransitData.push(inTransit);
  }

  // ApexCharts configuration
  const deliveryTrendsChartEl = document.querySelector('#deliveryTrendsChart');

  if (deliveryTrendsChartEl) {
    const deliveryTrendsConfig = {
      chart: {
        height: 300,
        type: 'area',
        toolbar: {
          show: false
        }
      },
      series: [
        {
          name: 'Delivered',
          data: deliveredData
        },
        {
          name: 'In Transit',
          data: inTransitData
        }
      ],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left'
      },
      colors: ['#28c76f', '#00cfe8'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        categories: last7Days,
        labels: {
          style: {
            colors: '#6c757d',
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#6c757d',
            fontSize: '12px'
          }
        }
      },
      grid: {
        borderColor: '#f1f1f1',
        padding: {
          top: -20,
          bottom: -10,
          left: 20
        }
      },
      tooltip: {
        shared: true,
        intersect: false
      }
    };

    const deliveryTrendsChart = new ApexCharts(deliveryTrendsChartEl, deliveryTrendsConfig);
    deliveryTrendsChart.render();
  }

  // Recent Parcels Table
  const recentParcelsTable = document.getElementById('recentParcelsTable');
  const recentParcels = parcels.slice(0, 10); // Get last 10 parcels

  if (recentParcelsTable) {
    if (recentParcels.length === 0) {
      recentParcelsTable.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-4">
            <i class="bx bx-package bx-lg text-muted mb-3"></i>
            <p class="text-muted">No parcels found</p>
          </td>
        </tr>
      `;
    } else {
      recentParcelsTable.innerHTML = recentParcels
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
            <td>${parcel.clientName}</td>
            <td>${parcel.destination}</td>
            <td>${parcel.weight} kg</td>
            <td>${statusBadge}</td>
            <td>${formattedDate}</td>
            <td>
              <div class="dropdown">
                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                  <i class="bx bx-dots-vertical-rounded"></i>
                </button>
                <div class="dropdown-menu">
                  <a class="dropdown-item" href="parcels/details.html?id=${parcel.id}">
                    <i class="bx bx-show me-1"></i> View Details
                  </a>
                  <a class="dropdown-item" href="tracking-management.html?tracking=${parcel.trackingNumber}">
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
})();
