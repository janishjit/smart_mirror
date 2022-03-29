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
socket.emit("connection", "hello world")

// Look at figma for modules, claim modules with a comment on the figma file
// https://www.figma.com/file/yrqrIB1452Kw8NM9943uOt/Magic-Mirror-Wireframes?node-id=2%3A17
const EXAMPLE_SCHEDULE = [
  { time: "8:00am", event: "STAT 251 " },
  { time: "11:00am", event: " CPEN 391" },
  { time: "1:00pm", event: "Lunch" },
  { time: "2:00pm", event: "ELEC 331" },
  { time: "4:00pm", event: "CPSC 320" },
  { time: "8:00pm", event: "Movie Night at Josh’s" },
];

const EXAMPLE_REMINDERS = [
  "Buy Tickets to Rex Orange County",
  "Pack your headphones before you leave",
  "Book Dental Appt.",
  "Buy Dad's B-Day Gift"
]

const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/gmail.readonly";


/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  /* @ts-ignore */
  gapi.client.calendar.events
    .list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    })
    .then(function (response: any) {
      var events = response.result.items;
      console.log("Upcoming events:");

      if (events.length > 0) {
        for (let i = 0; i < events.length; i++) {
          var event = events[i];
          var when = event.start.dateTime;
          if (!when) {
            when = event.start.date;
          }
          console.log(event.summary + " (" + when + ")");
        }
      } else {
        console.log("No upcoming events found.");
      }
    });
}

function updateSigninStatus(isSignedIn: boolean) {
  console.log(isSignedIn);
  if (isSignedIn) {
    listUpcomingEvents();
  } else {
    console.log("not signed in");
  }
}

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
  BLANK,
  CLOSET,
  SCHEDULE,
}

function App() {
  const [events, setEvents] = useState<any>([]);
  const [loaded, setLoaded] = useState(false);
  const [showState, setShowState] = useState<ShowState>(ShowState.BLANK);
  useEffect(() => {
    socket.on("voiceresponse", voiceResponse => {
      const intentName = voiceResponse.intentName;
      if (intentName === "ShowCloset") {
        setShowState(ShowState.CLOSET);
      }
      else if (intentName === "ShowDay") {
        setShowState(ShowState.SCHEDULE);
      }
    })
  }, []);
  useEffect(() => {
    // @ts-ignore
    gapi.load("client:auth2", () => {
      // @ts-ignore
      console.log(gapi);

      initClient(() => {
        // @ts-ignore
        console.log(gapi.auth2.BasicProfile);
        // @ts-ignore
        let auth = gapi.auth2.getAuthInstance();
        const isSignedIn = auth.isSignedIn.get();
        if (!isSignedIn) auth.signIn();
        setLoaded(true);
      });
    })
  }, [])
  if (!loaded) return <div></div>
  return (
    <div className="App">
      <div className="col1">
        <Welcome
          name={ "Trevor" }
          quote={
            "Growing old is mandatory, growing up is optional. - Anonymous"
          }
        />
        <EventsProvider>
          <Directions />
          <Schedule />
        </EventsProvider>
      </div>
      <div className="reflection-area">
        { showState === ShowState.CLOSET && <ClosetDetailed /> }
        { showState === ShowState.SCHEDULE && <ScheduleDetailed /> }
        <Speech />
      </div>
      <div className="col3">
        <DateTime
        />
        <RemindersProvider>
          <Reminders />
        </RemindersProvider>
        <Weather />
        <div className="closet">
          <Emails />
          <Closet />
        </div>
      </div>
    </div>
  );
}

export default App;
