# Tezex Parcel Delivery Dashboard

A comprehensive admin dashboard for Tezex parcel delivery company built with Bootstrap 5 and the Sneat template.

## Features

### 📊 Dashboard

- Real-time statistics (total parcels, active shipments, clients, revenue)
- Delivery trends chart with ApexCharts
- Status distribution visualization
- Recent parcels table

### 👥 Client Management

- View all clients with search functionality
- Add, edit, and delete clients
- Client details page with shipment history
- Client statistics (total shipments, delivered, active)

### 📦 Parcel Management

- View all parcels with status filters
- Create new parcels with real-time price calculator
- Parcel details with tracking information
- Link Tezex and Dubay tracking numbers

### 🗺️ Tracking Management

- Auto-generate Tezex tracking numbers (TZX-YYYYMMDD-XXX format)
- Daily counter reset at midnight
- Manual Dubay tracking number linking
- Update parcel status (admins can set any status)
- View tracking pairs (Tezex ↔ Dubay)

### 💰 Pricing Management

- Excel import for 234 countries pricing
- Weight-based pricing (0.5kg - 70kg)
- Per-kg rate for parcels over 70kg
- CRUD operations for country prices
- Real-time price calculator

## Project Structure

```
tezex/
├── index.html                      # Main entry point (redirects to dashboard)
├── pages/
│   ├── dashboard.html             # Main dashboard
│   ├── tracking-management.html   # Tracking number management
│   ├── clients/
│   │   ├── list.html             # All clients table
│   │   └── details.html          # Client profile & history
│   ├── parcels/
│   │   ├── list.html             # All parcels table
│   │   ├── create.html           # Create parcel form with calculator
│   │   └── details.html          # Parcel details & tracking
│   ├── pricing/
│   │   ├── import.html           # Excel import interface
│   │   ├── list.html             # Price list table
│   │   └── edit.html             # Edit country prices
│   └── auth/
│       └── login.html            # Admin login page
├── assets/
│   ├── js/
│   │   ├── init-data.js          # Mock data initialization
│   │   ├── dashboard.js          # Dashboard logic
│   │   ├── clients.js            # Client CRUD operations
│   │   ├── client-details.js     # Client details page
│   │   ├── parcels.js            # Parcel management
│   │   ├── pricing.js            # Price calculator & management
│   │   └── tracking.js           # Tracking number generation
│   ├── css/
│   │   └── tezex.css            # Custom Tezex styles
│   └── data/
│       └── PRICING_TEMPLATE_README.md  # Excel template guide
```

## Getting Started

### 1. Open the Dashboard

Simply open `/tezex/index.html` in your browser or navigate to:

```
file:///path/to/Tezex-dashboard/tezex/index.html
```

The system will automatically:

- Initialize mock data on first load
- Redirect to the dashboard
- Load sample clients, parcels, and pricing

### 2. Mock Data

The system includes pre-populated data:

- **15 sample clients** from various countries
- **35 sample parcels** with different statuses
- **20 countries** with complete pricing data

All data is stored in browser localStorage for demo purposes.

## Key Functionalities

### Tracking Number Format

Tezex tracking numbers follow the format: **TZX-YYYYMMDD-XXX**

- `TZX`: Tezex prefix
- `YYYYMMDD`: Date (e.g., 20260118 for Jan 18, 2026)
- `XXX`: Daily counter (001-999, resets at midnight)

Example: `TZX-20260118-001`

### Price Calculation

For parcels **≤ 70kg**: Use the corresponding weight bracket price

For parcels **> 70kg**:

```
Price = (70kg price) + ((weight - 70) × perKgAbove70 rate)
```

Example: 85kg parcel to USA

```
Price = $790 + ((85-70) × $12) = $790 + $180 = $970
```

### Parcel Status Workflow

Available statuses (admins can set any status manually):

1. **Received** - Just arrived at Tezex
2. **Processing** - Being prepared for shipping
3. **Sent to Dubay** - Handed over to Dubay company
4. **In Transit** - On the way to destination
5. **Out for Delivery** - Final delivery in progress
6. **Delivered** - Successfully delivered
7. **Returned** - Failed delivery

### Excel Import Format

Create an Excel file with these columns:

| Country | 0.5 | 1   | 2   | 3   | 5   | 10  | 15  | 20  | 30  | 40  | 50  | 60  | 70  | perKgAbove70 |
| ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------ |

See `/tezex/assets/data/PRICING_TEMPLATE_README.md` for detailed instructions.

## Technical Details

### Technologies Used

- **HTML5 & CSS3**
- **Bootstrap 5.3.3** - UI framework
- **JavaScript (ES6+)** - Application logic
- **ApexCharts 4.2.0** - Charts and graphs
- **jQuery 3.7.1** - DOM manipulation
- **LocalStorage** - Data persistence
- **SheetJS** - Excel import (to be integrated)

### Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

### Data Storage

All data is stored in browser localStorage:

- `tezex_clients` - Client records
- `tezex_parcels` - Parcel records
- `tezex_pricing` - Country pricing data
- `tezex_tracking_counter` - Tracking number counter
- `tezex_initialized` - Initialization flag

To reset data: Open browser console and run:

```javascript
localStorage.clear();
location.reload();
```

## Future Enhancements

### Integration Ready

- Backend API connection points prepared
- Dubay API integration placeholder
- Authentication system foundation

### Planned Features

- User roles and permissions
- Email notifications
- PDF invoice generation
- Advanced reporting and analytics
- Mobile app integration
- Real-time tracking updates

## Integration with Dubay Company

### Current Implementation

- Manual entry of Dubay tracking numbers
- Linking system between Tezex and Dubay tracking
- Status synchronization placeholder

### API Integration (Planned)

When Dubay API becomes available:

1. Replace manual entry with API call
2. Auto-sync tracking numbers
3. Real-time status updates
4. Webhook for delivery notifications

## Navigation Structure

```
Dashboard (/)
├── Clients
│   └── All Clients → Client Details
├── Parcels
│   ├── All Parcels → Parcel Details
│   └── Create Parcel (with price calculator)
├── Tracking Management
│   ├── Generate Tracking Number
│   ├── Link Dubay Tracking
│   └── Update Status
└── Pricing
    ├── Price List
    └── Import Prices (Excel)
```

## Notes

- **Client-facing portal**: Not included in this admin dashboard. A separate customer website is planned where clients can track parcels using their Tezex tracking number.

- **Dubay company integration**: Clients will only see Tezex branding and tracking information. The backend partnership with Dubay is transparent to customers.

- **Security**: This is a demo/prototype. For production:
  - Implement proper authentication
  - Add server-side validation
  - Use secure API endpoints
  - Encrypt sensitive data
  - Add role-based access control

## Support

For questions or issues:

1. Check the pricing template README
2. Review sample data in init-data.js
3. Examine browser console for errors

---

**© 2026 Tezex Parcel Delivery. All rights reserved.**
