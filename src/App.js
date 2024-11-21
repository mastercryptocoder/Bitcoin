import React, { useState } from "react";
import "./App.css";
import hourglassLoop from "./hourglassLoop.mp4";
import { fetchFact } from "./api/utils";

const App = () => {
  const [dateInput, setDateInput] = useState("");
  const [output, setOutput] = useState("");
  const [facts, setFacts] = useState([]); // New state to hold fact objects
  const [message, setMessage] = useState(""); // Separate state for messages

  const generateFact = async () => {
    if (!dateInput) {
      setMessage("Please enter a valid date!");
      setFacts([]);
      return;
    }

    const [year, month, day] = dateInput.split("-");

    try {
      const data = await fetchFact(month, day);

      const categories = ["selected", "events", "holidays", "births", "deaths"];
      let allFacts = [];

      categories.forEach((category) => {
        if (data[category] && data[category].length > 0) {
          allFacts = allFacts.concat(
            data[category].map((item) => ({ ...item, category }))
          );
        }
      });

      const factsForYear = allFacts.filter(
        (fact) => fact.year && parseInt(fact.year) === parseInt(year)
      );

      if (factsForYear.length > 0) {
        setFacts(factsForYear);
        setMessage(""); // Clear any previous message
      } else if (allFacts.length > 0) {
        setFacts(allFacts);
        setMessage(
          `(No specific events found for ${year}. Here's everything from this date!)`
        );
      } else {
        setMessage("No significant events found.");
        setFacts([]);
      }
    } catch (error) {
      console.error(error);
      setMessage("Error fetching data. Please try again later.");
      setFacts([]);
    }
  };

  return (
    <div>
      {/* Splash Screen */}
      <div id="splash">
        <video autoPlay muted loop id="splashVideo">
          <source src={hourglassLoop} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Time Portal</h1>
        <p>Enter a date to discover significant events.</p>

        <input
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
        />
        <button onClick={generateFact}>See What Happens</button>

        {/* Message container */}
        {message && <p>{message}</p>}

        {/* Facts container */}
        <div id="output">
          {facts.map((fact, index) => (
            <div className="event" key={index}>
              <strong>
                {fact.year} ({fact.category}):
              </strong>{" "}
              {fact.text}
              <img className="fact-image" src={fact.pages[0].originalimage.source} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
