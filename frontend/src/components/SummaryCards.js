import React, { useState, useEffect } from "react";
import { Box, Text, SimpleGrid } from "@chakra-ui/react";

const SummaryCards = ({ orders }) => {
  const totalOrders = orders.length;
  const totalQuantity = orders.reduce((sum, o) => sum + Number(o.quantity || 0), 0);
  const totalValue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  const [rate, setRate] = useState(1); // default USD → GBP
  const [loadingRate, setLoadingRate] = useState(true);

  useEffect(() => {
    fetch("https://api.exchangerate.host/latest?base=USD")
      .then(res => res.json())
      .then(data => {
        const gbpRate = data?.rates?.GBP ?? 1;
        setRate(gbpRate);
      })
      .catch(() => setRate(1))
      .finally(() => setLoadingRate(false));
  }, []);

  if (loadingRate) return <Text>Loading dashboard...</Text>; 

  return (
    <SimpleGrid columns={[1, 3]} spacing={6}>
      <Box bg="blue.500" color="white" p={5} borderRadius="xl" boxShadow="md">
        <Text fontSize="lg">Total Orders</Text>
        <Text fontSize="2xl" fontWeight="bold">{totalOrders}</Text>
      </Box>
      <Box bg="green.500" color="white" p={5} borderRadius="xl" boxShadow="md">
        <Text fontSize="lg">Total Quantity</Text>
        <Text fontSize="2xl" fontWeight="bold">{totalQuantity}</Text>
      </Box>
      <Box bg="purple.500" color="white" p={5} borderRadius="xl" boxShadow="md">
        <Text fontSize="lg">Total Value (GBP)</Text>
        <Text fontSize="2xl" fontWeight="bold">
          £{((totalValue || 0) * (rate || 1)).toFixed(2)}
        </Text>
      </Box>
    </SimpleGrid>
  );
};

export default SummaryCards;