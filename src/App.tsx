import React from "react";
import "./App.css";
import Placeholder from "./Placeholder";
import Schedule from "./Schedule";
import Weather from "./Weather";
import Welcome from "./Welcome";

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
        <Placeholder />
        <Placeholder />
        <Weather />
        <Placeholder />
      </div>
    </div>
  );
}

export default App;
