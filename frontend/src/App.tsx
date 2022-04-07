import React, { useEffect, useState } from "react";
import "./App.css";
import Placeholder from "./Placeholder";
import Schedule from "./Schedule";
import Weather from "./Weather";
import Welcome from "./Welcome";
import Reminders from "./Reminders";
import DateTime from "./DateTime"
import Directions from "./Directions";
import { EventsProvider } from "./EventsContext/EventsContext";
import { RemindersProvider } from "./Reminders/RemindersContext";
import Amplify from "aws-amplify";
import awsmobile from "./aws-exports";
import socket from "./Socket";
import Speech from "./Speech";
import Closet from "./Closet/Closet";
import ClosetDetailed from "./ClosetDetailed";
import ScheduleDetailed from "./ScheduleDetailed";
import Emails from "./Emails/Emails";
import { EmailsProvider } from "./EmailsContext/EmailsContext";
import EmailsDetailed from "./EmailsDetailed";
import { ActionIcon } from "@mantine/core";
import { Cross, X } from "tabler-icons-react";
socket.emit("connection", "hello world")

// Look at figma for modules, claim modules with a comment on the figma file
// https://www.figma.com/file/yrqrIB1452Kw8NM9943uOt/Magic-Mirror-Wireframes?node-id=2%3A17

const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"
];
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly", "https://www.googleapis.com/auth/gmail.readonly"].join(" ");


/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient(onSuccess: Function) {
  /* @ts-ignore */
  gapi.client
    .init({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    /* @ts-ignore */
    .then(
      function () {
        // Listen for sign-in state changes.
        /* @ts-ignore */
        onSuccess();
      },
      function (error: any) {
        console.log(JSON.stringify(error, null, 2));
      }
    );
}

Amplify.configure(awsmobile);

enum ShowState {
  Blank = "Blank",
  ShowCloset = "ShowCloset",
  ShowDay = "ShowDay",
  ShowUnread = "ShowUnread",
}

function App() {
  const [events, setEvents] = useState<any>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showState, setShowState] = useState<ShowState>(ShowState.Blank);
  const [travelMode, setTravelMode] = useState("TRANSIT");
  useEffect(() => {
    let listener = socket.on("voiceresponse", voiceResponse => {
      console.log(voiceResponse);

      const intentName = voiceResponse.intentName;

      switch (intentName) {
        // Events which change the UI
        case ShowState.ShowCloset:
        case ShowState.ShowDay:
        case ShowState.ShowUnread:
          setShowState(intentName);
          break;
        case "ChangeTravelMode":
          console.log(travelMode);
          setTravelMode(() => travelMode === "DRIVING" ? "TRANSIT" : "DRIVING");
          console.log(travelMode);

          break;
        default:
          break;
      }
    });

    return () => {
      listener.removeListener("voiceresponse");
    }
  }, [setTravelMode, setShowState, travelMode]);
  useEffect(() => {
    gapi.load("client:auth2", () => {

      initClient(() => {
        let auth = gapi.auth2.getAuthInstance();
        auth.isSignedIn.listen(() => {
          if (auth.isSignedIn.get()) {
            setLoggedIn(true);
          }
        });
        const isSignedIn = auth.isSignedIn.get();
        if (!isSignedIn) auth.signIn();
        else {
          setLoggedIn(true);
        }
      });
    })
  }, []);

  if (!loggedIn) return <div className="App">
    <div className="col1">
    </div>
    <div className="reflection-area">
      <button onClick={ () => gapi.auth2.getAuthInstance().signIn() }>Log in with Google</button>
    </div>
    <div className="col3">
      <div className="closet">
      </div>
    </div>
  </div>


  return (
    <div className="App">
      <EmailsProvider>
        <EventsProvider>
          <div className="col1">
            <Welcome
              name={ gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getGivenName() }
              quote={
                "Growing old is mandatory, growing up is optional. - Anonymous"
              }
            />
            <Directions setTravelMode={ setTravelMode } travelMode={ travelMode } />
            <Schedule onClickFocus={ () => setShowState(ShowState.ShowDay) } />
          </div>
          <div className="reflection-area">
            { showState !== ShowState.Blank && <ActionIcon style={ { zIndex: 200, position: "absolute", top: 10, right: 15 } } onClick={ () => setShowState(ShowState.Blank) }>
              <X />
            </ActionIcon> }
            { showState === ShowState.ShowCloset && <ClosetDetailed /> }
            { showState === ShowState.ShowDay && <ScheduleDetailed /> }
            { showState === ShowState.ShowUnread && <EmailsDetailed /> }
            <Speech />
          </div>
          <div className="col3">
            <DateTime />
            <RemindersProvider>
              <Reminders />
            </RemindersProvider>
            <Weather />
            <div className="closet">
              <Emails onClickFocus={ () => setShowState(ShowState.ShowUnread) } />
              <Closet onClickFocus={ () => setShowState(ShowState.ShowCloset) } />
            </div>
          </div>
        </EventsProvider>
      </EmailsProvider>
    </div>
  );
}

export default App;
