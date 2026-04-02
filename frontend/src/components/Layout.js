import { Box, Flex, Text } from "@chakra-ui/react";

const Layout = ({ children }) => {
  return (
    <Flex>
      <Box
        w="220px"
        h="100vh"
        bg="blue.600"
        color="white"
        p={5}
      >
        <Text fontSize="xl" fontWeight="bold" mb={6}>
          PO System
        </Text>

        <Text mb={3}>Dashboard</Text>
        <Text mb={3}>Orders</Text>
        <Text mb={3}>Suppliers</Text>
      </Box>

      <Box flex="1" bg="gray.100" minH="100vh" p={6}>
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;