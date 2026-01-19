# Tezex Pricing Excel Template

## Format Requirements

Your Excel file should have the following columns in order:

| Country | 0.5 | 1   | 2   | 3   | 5   | 10  | 15  | 20  | 30  | 40  | 50  | 60  | 70  | Per KG > 70 |
| ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------- |
| USA     | 25  | 30  | 40  | 50  | 70  | 120 | 180 | 240 | 350 | 460 | 570 | 680 | 790 | 12          |
| UK      | 22  | 28  | 38  | 48  | 65  | 115 | 170 | 225 | 330 | 435 | 540 | 645 | 750 | 11          |
| UAE     | 18  | 24  | 32  | 42  | 58  | 100 | 145 | 190 | 280 | 370 | 460 | 550 | 640 | 10          |

## Column Descriptions

- **Country**: Name of the destination country
- **0.5 - 70**: Price for parcels in that weight bracket (in kg)
- **Per KG > 70**: Additional price per kg for parcels heavier than 70kg

## Weight Calculation Rules

1. For parcels **up to 70kg**: Use the price from the corresponding weight bracket
   - If exact weight match not found, use the next higher bracket
   - Example: 4kg parcel → uses 5kg price

2. For parcels **over 70kg**:
   - Price = (70kg price) + ((weight - 70) × Per KG > 70)
   - Example: 85kg parcel to USA → $790 + ((85-70) × $12) = $790 + $180 = $970

## Sample Data

The system comes pre-loaded with pricing for 20 major countries:

- USA, UK, UAE, Germany, France, Spain, Turkey, China, Japan, Canada
- Australia, Brazil, India, Russia, Egypt, South Korea, Italy, Mexico
- Netherlands, Singapore

## Import Instructions

1. Go to Pricing → Import Prices
2. Click "Choose File" and select your Excel file (.xlsx or .xls)
3. System will preview the data
4. Click "Import" to save the pricing

## Notes

- All prices should be in USD
- Maximum 234 countries supported
- Weight brackets are fixed (cannot be changed)
- Only country names and prices can be edited
