"use strict";

import React from "react";

export default function LMAwardItems(props) {
  const items = props.items;
  if (!Array.isArray(items) || items.length == 0) {
    return null;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => {
          return (
            <tr>
              <td className="s5">{item.description}</td>
              <td className="s1">{item.quantity}</td>
              <td className="s3">{item.unit.value.amount}</td>
              <td className="s3">
                {item.quantity * item.unit.value.amount}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
