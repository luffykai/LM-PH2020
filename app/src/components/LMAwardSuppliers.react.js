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
            <div className="col s12">
              <span className="lm-pink-text-2">得標廠商: </span>
              <span className="lm-pink-text-1">{supplier.name}</span>
            </div>
          </div>
        );
      })}
    </>
  );
}
