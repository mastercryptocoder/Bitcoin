import React, { useState } from "react";
import "./App.css";
import hourglassLoop from "./hourglassLoop.mp4"

const App = () => {
  const [dateInput, setDateInput] = useState("");
  const [output, setOutput] = useState("");

  const generateFact = async () => {
    if (!dateInput) {
      setOutput("Please enter a valid date!");
      return;
    }

    const [year, month, day] = dateInput.split("-");
    const apiUrl = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();

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
        setOutput(
          factsForYear
            .map(
              (fact) =>
                `<div class="event"><strong>${fact.year} (${fact.category}):</strong> ${fact.text}</div>`
            )
            .join("")
        );
      } else if (allFacts.length > 0) {
        setOutput(
          allFacts
            .map(
              (fact) =>
                `<div class="event"><strong>${fact.year} (${fact.category}):</strong> ${fact.text}</div>`
            )
            .join("") +
            `<p>(No specific events found for ${year}. Here's everything from this date!)</p>`
        );
      } else {
        setOutput("No significant events found.");
      }
    } catch (error) {
      console.error(error);
      setOutput("Error fetching data. Please try again later.");
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

        {/* Results container */}
        <div
          id="output"
          dangerouslySetInnerHTML={{ __html: output }}
        ></div>
      </div>
    </div>
  );
};

export default App;
