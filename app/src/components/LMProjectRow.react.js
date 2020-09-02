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

const taiwaneseYearOffset = 1911;
const etaRegex = /^(\d{2,3})(?:\.(\d{1,2}))?$/;

const getProjectEta = function(geoData) {
  if (geoData == null || geoData.eta == null) {
    return "不明";
  }
  const match = geoData.eta.match(etaRegex);
  if (match == null || match[1] == null) {
    return "不明";
  }
  return (
    `${parseInt(match[1]) + taiwaneseYearOffset}` +
    (match[2] != null ? `/${match[2]}` : "")
  );
};

export default function LMProjectRow(props) {
  const geoData = props.geoData;
  const eta = getProjectEta(geoData);
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
            {(new Date(eta) < Date.now() ? "已完工：" : "預計完工：") + eta}
          </div>
          <div className="projectRowDescription">
            <p>
              {geoData.county != null && geoData.district != null && (
                <>
                  {geoData.county} {geoData.district}
                  <br></br>
                </>
              )}
              {/* {geoData.address != null && (
                <>
                  {geoData.address}
                  <br></br>
                </>
              )} */}
              {geoData.landlord != null && (
                <>
                  土地權: {geoData.landlord}
                  <br></br>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}
