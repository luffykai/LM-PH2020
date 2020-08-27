import ReactDOM from "react-dom";
import LMNavBar from "./LMNavBar.react";
import React, { useEffect, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "./LMFirebase.react";

export default function LMSignInRoot() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(user => setIsSignedIn(!!user));
    return function cleanup() {
      unregisterAuthObserver();
    };
  });

  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID
      // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };

  return (
    <>
      <LMNavBar />
      <div id="root">
        <div id="root-bg">
          <div className="container">
            <div style={{ height: "40px", width: "100%" }} />
            {!isSignedIn && (
              <>
                <p>Please sign-in:</p>
                <StyledFirebaseAuth
                  uiConfig={uiConfig}
                  firebaseAuth={firebase.auth()}
                />
              </>
            )}
            {isSignedIn && (
              <>
                <p>
                  Welcome {firebase.auth().currentUser.displayName}! You are now
                  signed-in!
                </p>
                <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

let domContainer = document.querySelector("#lm_signin_root");
ReactDOM.render(<LMSignInRoot />, domContainer);
