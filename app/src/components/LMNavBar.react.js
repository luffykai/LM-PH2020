import React from "react";

export default function LMNavBar() {
  return (
    <nav>
      <div class="nav-wrapper">
        <a href="../" class="brand-logo lm-logo"></a>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li>
            <a href="#">About Us</a>
          </li>
          <li>
            <a href="#">Data</a>
          </li>
          <li>
            <a href="#">Official Center</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
