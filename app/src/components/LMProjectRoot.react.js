"use strict";

import firebase from "./LMFirebase.react";
import LMProcurement from "./LMProcurement.react";
import LMNavBar from "./LMNavBar.react";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const db = firebase.firestore();

export default function LMProjectRoot() {
  const dataDiv = document.getElementById("project-data");
  const county = dataDiv.getAttribute("county");
  const projectID = dataDiv.getAttribute("projectID");

  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    db.collection("counties")
      .doc(county)
      .collection("projects")
      .doc(projectID)
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          setProjectData(doc.data());
        } else {
          console.log("No such document!");
        }
      });
  }, [county]);

  if (county == null || projectID == null) {
    throw `At least one of county:${county} or projectID: ${projectID} is null in LWIProjectRoot`;
  }

  if (projectData == null) {
    return (
      <>
        <LMNavBar />
        Loading Data...
      </>
    );
  }

  // Currently, there is always only one project.
  const project = projectData.projects[0];
  const projectTitle = project.title;
  const releases = project.contractingProcesses[0].releases;
  if (!Array.isArray(releases) || releases.length == 0) {
    return (
      <>
        <LMNavBar />
        No releases found.
      </>
    );
  }
  const firstParty = releases[0].parties[0];
  const buyerName = firstParty.name;
  const buyerContact = firstParty.contactPoint.name;

  return (
    <>
      <LMNavBar />
      <div id="root">
        <div className="container">
          <h2>{projectTitle}</h2>

          <h3 className="lm-h2">POC Information</h3>

          <div id="pocBox">
            <div className="pocRow">
              <div>Buyer: {buyerName}</div>
              <div>{buyerContact}</div>
            </div>
          </div>

          {/* {JSON.stringify(projectData)} */}
          {project.contractingProcesses.map((progress, index) => {
            return (
              <LMProcurement
                projectData={projectData}
                contractingProgress={progress}
                contractIndex={index}
                projectID={projectID}
                county={county}
              />
            );
          })}

          <div>
            <button
              onClick={() => {
                document.getElementById("download-form").submit();
              }}
            >
              Download oc4ids data for this project
            </button>
            <form action="../download" id="download-form" method="post">
              <input
                name="data"
                type="hidden"
                value={JSON.stringify(projectData)}
              />
              <input name="filename" type="hidden" value={projectID} />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

const domContainer = document.querySelector("#lm_project_root");
ReactDOM.render(<LMProjectRoot />, domContainer);
