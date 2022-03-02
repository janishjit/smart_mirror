import React from "react";
import "./App.css";
import Placeholder from "./Placeholder";
import Schedule from "./Schedule";
import Weather from "./Weather";
import Welcome from "./Welcome";
import Reminders from "./Reminders";
import DateTime from "./DateTime"

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



function App() {
  return (
    <div className="App">
      <div className="col1">
        <Welcome
          name={ "Trevor" }
          quote={
            "Growing old is mandatory, growing up is optional. - Anonymous"
          }
        />
        <Placeholder />
        <Schedule schedule={ EXAMPLE_SCHEDULE } />
      </div>
      <div className="reflection-area">reflection area</div>
      <div className="col3">
        <DateTime
          date={ "1:00 pm" }
          time={ "Tuesday, February 22nd" }
        />
        <Reminders
          reminders={
            EXAMPLE_REMINDERS
          }
        />
        <Weather />
        <Placeholder />
      </div>
    </div>
  );
}

export default App;
