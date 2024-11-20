import React, { useState } from "react";
import "./App.css";

const TimePortal = () => {
  const [dateInput, setDateInput] = useState("");
  const [outputText, setOutputText] = useState("");
  const [animationColor, setAnimationColor] = useState("#ff7eb3");
  const [loading, setLoading] = useState(false);

  const generateFact = async () => {
    if (!dateInput) {
      setOutputText("Please enter a valid date!");
      return;
    }

    setLoading(true); // Set loading state

    const [year, month, day] = dateInput.split("-");
    const apiUrl = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Define the order of categories to prioritize
      const categories = ["selected", "events", "holidays", "births", "deaths"];
      let allFacts = [];

      // Gather facts in prioritized order
      categories.forEach((category) => {
        if (data[category] && data[category].length > 0) {
          allFacts = allFacts.concat(
            data[category].map((item) => ({ ...item, category }))
          );
        }
      });

      // Filter facts by the specified year
      const factsForYear = allFacts.filter(
        (fact) => fact.year && parseInt(fact.year) === parseInt(year)
      );

      if (factsForYear.length > 0) {
        const fact = factsForYear[0];
        setOutputText(
          `<strong>${fact.year} (${fact.category}):</strong> ${fact.text}`
        );
      } else if (allFacts.length > 0) {
        // If no year-specific fact, show a random fact
        const randomFact =
          allFacts[Math.floor(Math.random() * allFacts.length)];
        setOutputText(
          `<strong>${randomFact.year} (${randomFact.category}):</strong> ${randomFact.text}
          <br><a href="${randomFact.pages?.[0]?.content_urls?.desktop?.page || "#"}" target="_blank">Learn more</a>
          <p>(No specific events found for ${year}. Here's a random one from this date!)</p>`
        );
      } else {
        setOutputText(
          `No significant events found for ${month}/${day}, ${year}.`
        );
      }
    } catch (error) {
      setOutputText("Error fetching data. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false); // Clear loading state
    }

    // Randomize animation colors
    const colors = [
      "#ff7eb3",
      "#ff758c",
      "#f24e79",
      "#ffc078",
      "#85e3ff",
      "#b9fbc0",
      "#f9c74f",
    ];
    setAnimationColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  return (
    <div className="time-portal">
      <h1>Time Portal</h1>
      <p>Enter a date to discover something unique!</p>
      <input
        type="date"
        value={dateInput}
        onChange={(e) => setDateInput(e.target.value)}
      />
      <button onClick={generateFact}>See What Happens</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          className="result"
          dangerouslySetInnerHTML={{ __html: outputText }}
        ></div>
      )}
      <div
        className="animation"
        style={{
          background: `linear-gradient(45deg, ${animationColor}, ${animationColor})`,
        }}
      ></div>
    </div>
  );
};

export default TimePortal;
