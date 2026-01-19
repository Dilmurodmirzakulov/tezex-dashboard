/**
 * Tezex Dashboard - Clients Management
 */

'use strict';

(function () {
  let clients = JSON.parse(localStorage.getItem('tezex_clients') || '[]');
  let filteredClients = [...clients];

  // Load clients table
  function loadClientsTable() {
    const tableBody = document.getElementById('clientsTableBody');

    if (!tableBody) return;

    if (filteredClients.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4">
            <div class="empty-state">
              <i class="bx bx-user bx-lg"></i>
              <h5>No clients found</h5>
              <p>Add your first client to get started</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filteredClients
      .map(client => {
        const joinDate = new Date(client.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        return `
        <tr>
          <td>
            <div class="d-flex align-items-center">
              <div class="avatar avatar-sm me-3">
                <span class="avatar-initial rounded-circle bg-label-primary">
                  ${client.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h6 class="mb-0">${client.name}</h6>
              </div>
            </div>
          </td>
          <td>${client.email}</td>
          <td>${client.phone}</td>
          <td>
            <span class="badge rounded-pill bg-label-info">${client.totalShipments} shipments</span>
          </td>
          <td>${joinDate}</td>
          <td>
            <div class="dropdown">
              <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                <i class="bx bx-dots-vertical-rounded"></i>
              </button>
              <div class="dropdown-menu">
                <a class="dropdown-item" href="details.html?id=${client.id}">
                  <i class="bx bx-show me-1"></i> View Details
                </a>
                <a class="dropdown-item" href="javascript:void(0);" onclick="editClient(${client.id})">
                  <i class="bx bx-edit me-1"></i> Edit
                </a>
                <a class="dropdown-item text-danger" href="javascript:void(0);" onclick="deleteClient(${client.id})">
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
        filteredClients = [...clients];
      } else {
        filteredClients = clients.filter(
          client =>
            client.name.toLowerCase().includes(searchTerm) ||
            client.email.toLowerCase().includes(searchTerm) ||
            client.phone.includes(searchTerm)
        );
      }

      loadClientsTable();
    });
  }

  // Add client form submission
  const addClientForm = document.getElementById('addClientForm');
  if (addClientForm) {
    addClientForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const newClient = {
        id: clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1,
        name: document.getElementById('clientName').value,
        email: document.getElementById('clientEmail').value,
        phone: document.getElementById('clientPhone').value,
        address: document.getElementById('clientAddress').value,
        createdAt: new Date().toISOString(),
        totalShipments: 0
      };

      clients.push(newClient);
      localStorage.setItem('tezex_clients', JSON.stringify(clients));

      // Reset form and close modal
      addClientForm.reset();
      const modal = bootstrap.Modal.getInstance(document.getElementById('addClientModal'));
      modal.hide();

      // Reload table
      filteredClients = [...clients];
      loadClientsTable();

      // Show success message
      alert('Client added successfully!');
    });
  }

  // Edit client function
  window.editClient = function (clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    document.getElementById('editClientId').value = client.id;
    document.getElementById('editClientName').value = client.name;
    document.getElementById('editClientEmail').value = client.email;
    document.getElementById('editClientPhone').value = client.phone;
    document.getElementById('editClientAddress').value = client.address;

    const editModal = new bootstrap.Modal(document.getElementById('editClientModal'));
    editModal.show();
  };

  // Edit client form submission
  const editClientForm = document.getElementById('editClientForm');
  if (editClientForm) {
    editClientForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const clientId = parseInt(document.getElementById('editClientId').value);
      const clientIndex = clients.findIndex(c => c.id === clientId);

      if (clientIndex !== -1) {
        clients[clientIndex].name = document.getElementById('editClientName').value;
        clients[clientIndex].email = document.getElementById('editClientEmail').value;
        clients[clientIndex].phone = document.getElementById('editClientPhone').value;
        clients[clientIndex].address = document.getElementById('editClientAddress').value;

        localStorage.setItem('tezex_clients', JSON.stringify(clients));

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editClientModal'));
        modal.hide();

        // Reload table
        filteredClients = [...clients];
        loadClientsTable();

        // Show success message
        alert('Client updated successfully!');
      }
    });
  }

  // Delete client function
  window.deleteClient = function (clientId) {
    if (!confirm('Are you sure you want to delete this client?')) return;

    clients = clients.filter(c => c.id !== clientId);
    localStorage.setItem('tezex_clients', JSON.stringify(clients));

    // Reload table
    filteredClients = [...clients];
    loadClientsTable();

    // Show success message
    alert('Client deleted successfully!');
  };

  // Initial load
  loadClientsTable();
})();
