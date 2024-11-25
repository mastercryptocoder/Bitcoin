import React, { useState } from "react";
import "./App.css";
import { fetchFact } from "./api/utils";
import StarsLoop from "./StarsLoop.mp4"; // Background video
import TestOverlay from "./TestOverlay.webm"; // Transition video
import TimePortalGif from "./TimePortal.gif"; // Logo GIF
import TwitterLogo from "./TwitterPng.png"; // Social media logos
import InstagramLogo from "./IgPng.png";
import PhotonLogo from "./PhotonPng.png";
import PortalLogo from "./PortalLogo.png";

function App() {
  const [dateInput, setDateInput] = useState("");
  const [facts, setFacts] = useState([]); // New state to hold fact objects
  const [message, setMessage] = useState(""); // Separate state for messages
  const [transitionActive, setTransitionActive] = useState(false);
  const [factDisplayed, setFactDisplayed] = useState(false);

  async function generateFact() {
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
        setFactDisplayed(true);
      } else if (allFacts.length > 0) {
        setFacts(allFacts);
        setMessage(
          `(No specific events found for ${year}. Here's everything from this date!)`
        );
        setFactDisplayed(true);
      } else {
        setMessage("No significant events found.");
        setFacts([]);
        setFactDisplayed(true);
      }
    } catch (error) {
      console.error(error);
      setMessage("Error fetching data. Please try again later.");
      setFacts([]);
    } finally {
      // Add a slight delay before disabling the transition video
      setTimeout(() => {
        setTransitionActive(false);
      }, 1000); // Adjust the duration (2000ms = 2 seconds) to match your video's length
    }
  }

  function searchDate() {
    // Activate transition first
    setTransitionActive(true);

    // Delay `generateFact` slightly to ensure the UI updates
    setTimeout(() => {
      generateFact();
    }, 3000); // Small delay to allow `transitionActive` to take effect
  }

  function resetPage() {
    setDateInput("");
    setFacts([]);
    setMessage("");
    setFactDisplayed(false);
  }

  return (
    <div className="overflow-auto font-sans space-gas-bg text-white relative">
      <img id="coinLogo" src={PortalLogo} alt="Spinning Coin Logo" />

      {/* Background Video */}
      <video
        id="backgroundVideo"
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src={StarsLoop} type="video/mp4" />
      </video>

      {/* Transition Video */}
      {transitionActive && (
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-50"
          autoPlay
          loop
          muted
        >
          <source src={TestOverlay} type="video/webm" />
        </video>
      )}

      {/* Main Content */}
      <div className="relative flex flex-col items-center justify-center min-h-screen text-center">
        <img
          src={TimePortalGif}
          alt="Time Portal Logo"
          className="mb-4 fade-in glitch"
          width="1000"
        />
        <p className="text-lg text-gray-300 mb-6">Enter The Date</p>

        <div className="flex space-x-4 justify-center mb-8">
          <input
            type="date"
            className="px-4 py-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
          <button
            onClick={searchDate}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md"
          >
            Start
          </button>
        </div>

        {/* Output Section */}
        {factDisplayed && (
          <div
            id="output"
            className="w-10/12 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg p-6"
          >
            {message && <p className="text-gray-300 mb-4">{message}</p>}
            {facts.map((fact, index) => (
              <div
                key={index}
                className="bg-gray-700 bg-opacity-80 text-white p-4 rounded-lg mb-4"
              >
                <strong>{fact.year}:</strong> {fact.text}
              </div>
            ))}
          </div>
        )}

        {factDisplayed && (
          <button
            onClick={resetPage}
            className={`bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md mt-6 ${
              facts.length === 0 ? "hidden" : ""
            }`}
          >
            Go Back In Time
          </button>
        )}

        {/* Social Media Links */}
        <div className="flex space-x-4 justify-center mt-8 fade-in">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="float-wave hover-stop"
          >
            <img src={TwitterLogo} alt="Twitter Logo" className="w-8 h-8" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="float-wave hover-stop"
          >
            <img src={InstagramLogo} alt="Instagram Logo" className="w-8 h-8" />
          </a>
          <a
            href="https://photon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="float-wave hover-stop"
          >
            <img src={PhotonLogo} alt="Photon Logo" className="w-8 h-8" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
