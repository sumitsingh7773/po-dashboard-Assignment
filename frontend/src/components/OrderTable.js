import React from "react";
import './Dashboard.css';

const OrderTable = ({ orders }) => {
  const parseDate = (d) => {
    if (!d) return null;
    const [day, month, year] = d.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  return (
    <table className="dashboard-table">
      <thead>
        <tr>
          <th>Supplier</th>
          <th>Buyer</th>
          <th>Category</th>
          <th>Qty</th>
          <th>Total</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o, i) => (
          <tr key={i}>
            <td>{o.supplier || "-"}</td>
            <td>{o.buyer || "-"}</td>
            <td>{o.category || "-"}</td>
            <td>{Number(o.quantity || 0)}</td>
            <td>${Number(o.totalAmount || 0).toFixed(2)}</td>
            <td>{o.deliveryDate ? parseDate(o.deliveryDate).toLocaleDateString() : "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;