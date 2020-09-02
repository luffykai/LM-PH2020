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
    <a
      className="collection-item hoverable"
      href={`/project?county=${props.county}&project_id=${props.id}`}
    >
      <div className="projectRowRoot">
        <div className="projectRowImageWrap">
          <img
            className="projectRowImage"
            src="https://x.webdo.cc/userfiles/53670197/image/_D8A6613.jpg"
          />
        </div>
        <div className="projectRowInfo">
          <div className="projectRowStatus statusPlanning">Planning</div>
          <div className="projectRowName">{props.name}</div>
          <div className="projectRowDate">
            {(new Date(props.eta) < Date.now() ? "已完工：" : "預計完工：") +
              props.eta}
          </div>
          <div className="projectRowDescription">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
            interdum enim quam, in interdum lectus vulputate vel. Duis volutpat
            augue ligula, sit amet sagittis odio ultricies rhoncus. Vivamus
            gravida pellentesque nibh, vel ornare nulla varius eu. Vestibulum ac
            ultrices justo. Suspendisse dolor ex, rhoncus in mi pretium,
            placerat lobortis nunc.
          </div>
        </div>
      </div>
    </a>
  );
}
