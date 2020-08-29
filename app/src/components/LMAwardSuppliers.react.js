"use strict";

import React from "react";

export default function LMAwardSuppliers(props) {
  const suppliers = props.suppliers;
  if (!Array.isArray(suppliers) || suppliers.length == 0) {
    return null;
  }

  return (
    <>
      {suppliers.map(supplier => {
        return (
          <div className="row">
            <div className="col s12">{supplier.name}</div>
          </div>
        );
      })}
    </>
  );
}
