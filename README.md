# 📊 PO Dashboard – Purchase Order Automation

## Project Overview

This project automates the extraction of Purchase Order (PO) data from PDF files and provides a web-based dashboard for analysis. It eliminates manual PDF-to-Excel conversions and provides a centralized system to store, analyze, and visualize PO data in real-time.

---

## Backend Setup

1. Navigate to the backend folder and install dependencies:

cd backend
npm install

2. Create a `.env` file:

MONGO_URI=<Your MongoDB URI>
PORT=5000

3. Run the backend server:

npm start

The backend API will be available at: [http://localhost:5000](http://localhost:5000)

---

## Frontend Setup

1. Navigate to the frontend folder and install dependencies:

cd frontend
npm install

2. Start the frontend:

npm start

The frontend will be available at: [http://localhost:3000](http://localhost:3000)

---

## Features

### 1. PDF Upload

* Click **Choose & Upload PDF** to upload PO files.
* The system extracts data from PDFs and stores it in the database.
* Uploaded files are listed with a **View** button to open PDFs in a new tab.
* Duplicate uploads can be prevented by comparing file names or hashes (suggested improvement).

### 2. Filters

* Filter PO data by:

  * Date Range (From – To)
  * Supplier
  * Buyer
  * Category

### 3. Dashboard

* **Summary Cards** – Display total orders, total quantity, total value in GBP.
* **Supplier Quantity Chart** – Quantity per supplier visualized in a bar chart.
* **Delivery Timeline Chart** – On-time vs delayed deliveries per supplier.
* **Orders Table** – Displays all orders with details including Supplier, Buyer, Category, Quantity, Total, and Delivery Date.

### 4. Export

* **Download Report** – Exports filtered data as an Excel `.xlsx` file.
* Ensures all relevant fields are included:

  * Supplier, Buyer, Brand, Style Number, Quantity, Price, Total, Delivery Date, Ex-Factory Date, Category

---

## Folder Structure

po-dashboard/
│
├─ backend/
│   ├─ controllers/
│   │   └─ uploadController.js
│   ├─ models/
│   │   └─ Order.js
│   ├─ routes/
│   │   └─ uploadRoutes.js
│   ├─ server.js
│
├─ frontend/
│   ├─ src/
│   │   ├─ components/
│   │   │   ├─ Dashboard.js
│   │   │   ├─ SummaryCards.js
│   │   │   ├─ Charts.js
│   │   │   └─ OrderTable.js
│   │   └─ App.js
│   └─ package.json
│
└─ README.md

---

## Improvements & Notes

* **Category Field:** Ensure PDFs have a consistent format. If missing, the system sets `"-"` as default.
* **Duplicate Uploads:** Currently allowed; can implement hash check to avoid duplicates.
* **Currency Conversion:** Static; can integrate a live API for USD → GBP conversion.
* **Authentication:** Can be added for secure access.
* **Error Handling:** Robust handling for missing or malformed PDF fields.

---

## Demo Workflow

### 1. Upload a Sample PO PDF

* Click **Choose & Upload PDF**.
* Data is automatically extracted and saved.

### 2. Filter Orders

* Apply filters by date, supplier, buyer, or category.
* Dashboard and charts update dynamically.

### 3. Visualize Data

* Summary cards show total orders, quantity, and value.
* Charts display quantity per supplier and delivery timelines.

### 4. Export Data

* Click **Download Report** to save filtered orders in Excel format.
