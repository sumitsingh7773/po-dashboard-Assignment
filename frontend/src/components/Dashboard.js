import React, { useEffect, useState } from "react";
import { Box, Heading, Input, SimpleGrid, Button, List, ListItem, Flex, Spacer } from "@chakra-ui/react";
import axios from "axios";
import * as XLSX from "xlsx";
import SummaryCards from "./SummaryCards";
import Charts from "./Charts";
import OrderTable from "./OrderTable";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [supplierFilter, setSupplierFilter] = useState("");
  const [buyerFilter, setBuyerFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/uploaded-files");
      setUploadedFiles(res.data);
    } catch (err) {
      console.error("Failed to fetch uploaded files:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUploadedFiles();
  }, []);

  const filtered = orders.filter((o) => {
    const delivery = o.deliveryDate
      ? new Date(o.deliveryDate.split("/").reverse().join("-"))
      : null;
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    return (
      (!from || (delivery && delivery >= from)) &&
      (!to || (delivery && delivery <= to)) &&
      (o.supplier || "").toLowerCase().includes(supplierFilter.toLowerCase()) &&
      (o.buyer || "").toLowerCase().includes(buyerFilter.toLowerCase()) &&
      (o.category || "").toLowerCase().includes(categoryFilter.toLowerCase())
    );
  });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      await axios.post("http://localhost:5000/api/upload", formData);
      fetchOrders();
      fetchUploadedFiles();
    } catch (err) {
      alert("Upload failed!");
      console.error(err);
    }
  };

  const handleDownloadExcel = () => {
  const exportData = filtered.map(({ supplier, brand, buyer, styleNumber, quantity, price, totalAmount, deliveryDate, exFactoryDate, category }) => ({
    supplier,
    brand,
    buyer,
    styleNumber,
    quantity,
    price,
    totalAmount,
    deliveryDate,
    exFactoryDate,
    category
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Orders");
  XLSX.writeFile(wb, "PO_Report.xlsx");
};
  return (
    <Box p={6} bg="gray.100" minH="100vh">
      <Heading mb={6}>📊 PO Dashboard</Heading>

      <Box mb={4}>
        <Flex mb={2}>
          <Button colorScheme="blue" onClick={() => document.getElementById("fileInput").click()}>
            Choose & Upload PDF
          </Button>
          <Spacer />
          <Button colorScheme="green" onClick={handleDownloadExcel}>
            Download Report
          </Button>
        </Flex>

        <input
          id="fileInput"
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={handleUpload}
        />

        {uploadedFiles.length > 0 && (
          <List mt={2}>
            {uploadedFiles.map((f) => (
              <ListItem key={f._id}>
                {f.name}{" "}
                <Button
                  size="sm"
                  colorScheme="teal"
                  onClick={() => window.open(`http://localhost:5000/uploads/${f.name}`, "_blank")}
                >
                  View
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <SimpleGrid columns={[1, 2]} spacing={4} mb={4}>
        <Input
          type="date"
          placeholder="From Date"
          bg="white"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <Input
          type="date"
          placeholder="To Date"
          bg="white"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </SimpleGrid>

      <SimpleGrid columns={[1, 3]} spacing={4} mb={4}>
        <Input
          placeholder="Filter by Supplier..."
          bg="white"
          value={supplierFilter}
          onChange={(e) => setSupplierFilter(e.target.value)}
        />
        <Input
          placeholder="Filter by Buyer..."
          bg="white"
          value={buyerFilter}
          onChange={(e) => setBuyerFilter(e.target.value)}
        />
        <Input
          placeholder="Filter by Category..."
          bg="white"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />
      </SimpleGrid>

      <SummaryCards orders={filtered} />

      <SimpleGrid columns={[1, 1, 2]} spacing={6} mt={6}>
        <Charts orders={filtered} />
      </SimpleGrid>

      <Box mt={6}>
        <OrderTable orders={filtered} />
      </Box>
    </Box>
  );
};

export default Dashboard;