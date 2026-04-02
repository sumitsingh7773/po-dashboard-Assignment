import { Box, Heading } from "@chakra-ui/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const Charts = ({ orders }) => {
  const parseDate = (d) => {
    if (!d) return null;
    const [day, month, year] = d.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  const supplierMap = {};
  orders.forEach(o => {
    if (!supplierMap[o.supplier]) supplierMap[o.supplier] = 0;
    supplierMap[o.supplier] += Number(o.quantity || 0);
  });
  const supplierData = Object.keys(supplierMap).map(key => ({
    supplier: key,
    quantity: supplierMap[key],
  }));

  const deliveryMap = {};
  orders.forEach(o => {
    if (!deliveryMap[o.supplier]) deliveryMap[o.supplier] = { onTime: 0, delayed: 0 };
    const actual = parseDate(o.deliveryDate);
    const expected = parseDate(o.exFactoryDate || o.deliveryDate);
    if (!actual || !expected) return;
    if (actual <= expected) deliveryMap[o.supplier].onTime += Number(o.quantity || 0);
    else deliveryMap[o.supplier].delayed += Number(o.quantity || 0);
  });
  const deliveryData = Object.keys(deliveryMap).map(key => ({
    supplier: key,
    onTime: deliveryMap[key].onTime,
    delayed: deliveryMap[key].delayed,
  }));

  return (
    <>
      <Box bg="white" p={5} borderRadius="xl" boxShadow="md" height="350px">
        <Heading size="md" mb={4}>Supplier Quantity</Heading>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={supplierData}>
            <XAxis dataKey="supplier" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#2575fc" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Box bg="white" p={5} borderRadius="xl" boxShadow="md" mt={6} height="350px">
        <Heading size="md" mb={4}>Delivery Timeline</Heading>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={deliveryData}>
            <XAxis dataKey="supplier" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="onTime" stackId="a" fill="#28a745" name="On Time" />
            <Bar dataKey="delayed" stackId="a" fill="#dc3545" name="Delayed" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </>
  );
};

export default Charts;