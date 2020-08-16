/*
This is a component rendered in LMCountyRoot when a specific county
is selected. This component would show
1. An image
2. Project Name
3. Expected construction complete date
4. construction status
5. description
*/

import React from "react";

export default function LMProjectRow(props) {
  return (
    <div className="projectRowRoot">
      <div className="projectRowImageWrap">
        <img className="projectRowImage" src="https://x.webdo.cc/userfiles/53670197/image/_D8A6613.jpg" />
      </div>
      <div className="projectRowInfo">
        <div className="projectRowStatus">Building</div>
        <div className="projectRowName">{props.name}</div>
        <div className="projectRowDate">預計完工：2024/07</div>
      </div>
    </div>
  );
}
