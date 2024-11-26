import React, { useState, useRef } from "react";
import "./App.css";
import { fetchFact } from "./api/utils";
import StarsLoop from "./StarsLoop.mp4"; // Background video
import TestOverlay from "./TestOverlay.webm"; // Transition video
import TimePortalGif from "./TimePortal.gif"; // Logo GIF
import TwitterLogo from "./TwitterPng.png"; // Social media logos
import InstagramLogo from "./IgPng.png";
import PhotonLogo from "./PhotonPng.png";
import PortalLogo from "./PortalLogo.png";
import LoadingCircle from "./LoadingCircle.mp4";

function App() {
  const [dateInput, setDateInput] = useState(""); // State for date input
  const [data, setDataInput] = useState([]); // State for date input
  const [facts, setFacts] = useState([]); // State to hold fetched facts
  const [message, setMessage] = useState(""); // State for displaying messages
  const [transitionActive, setTransitionActive] = useState(false); // State to control transition video visibility
  const [loadingVisible, setLoadingVisible] = useState(false); // State to control loading video visibility
  const [factsReady, setFactsReady] = useState(false); // State to track when facts are ready to display
  const [transitionTriggered, setTransitionTriggered] = useState(false); // State to prevent multiple triggers
  const transitionRef = useRef(null); // Ref for transition video

  async function generateFact(){
      // Function to fetch and display facts based on the input date
    if (!dateInput) {
      setMessage("Please enter a valid date!"); // Display error if no date entered
      setFacts([]); // Clear facts
      return;
    }

    const [year, month, day] = dateInput.split("-"); // Split input date into components

    try {
      const dataReceived = await fetchFact(month, day); // Fetch facts using utility function
      setDataInput(dataReceived);
      setTransitionActive(true);
    }
    catch(error){
      console.error(error);
    }
  }

  // Function to fetch and display facts based on the input date
  async function applyFact() {
    if (!dateInput) {
      setMessage("Please enter a valid date!"); // Display error if no date entered
      setFacts([]); // Clear facts
      return;
    }

   const [year, month, day] = dateInput.split("-"); // Split input date into components

    try {
      // Activate transition once data is fetched
      const categories = ["selected", "events", "holidays", "births", "deaths"];
      let allFacts = [];

      // Combine all categories of facts into a single array
      categories.forEach((category) => {
        if (data[category] && data[category].length > 0) {
          allFacts = allFacts.concat(
            data[category].map((item) => ({ ...item, category }))
          );
        }
      });

      // Filter facts to match the specified year
      const factsForYear = allFacts.filter(
        (fact) => fact.year && parseInt(fact.year) === parseInt(year)
      );

      if (factsForYear.length > 0) {
        setFacts(factsForYear); // Set filtered facts
        setMessage(""); // Clear any previous messages
        console.log("set facts");

      } 
      // else if (allFacts.length > 0) {
      //   setFacts(allFacts); // Display all facts if no year-specific facts found
      //   setMessage(
      //     `(No specific events found for ${year}. Here's everything from this date!)`
      //   );
      // } 
      else {
        setMessage("No significant events found."); // Show message if no facts found
        setFacts([]);
      }

      // Indicate that facts are ready to be displayed
      setFactsReady(true);

    } catch (error) {
      console.error(error);
      setMessage("Error fetching data. Please try again later."); // Handle fetch errors
      setFacts([]);
      setFactsReady(false);
    } finally {
      setTransitionTriggered(false);
    }
  }

  // Function triggered when the "Start" button is clicked
  function searchDate() {
    setLoadingVisible(true); // Show loading video
    generateFact(); // Start fetching data
  }

  // Function to track video progress and start actions at 90%
  function handleTransitionProgress() {
    const video = transitionRef.current;
    if (!video || transitionTriggered) return;

    const progress = video.currentTime / video.duration;
    if (progress >= 0.7) {
      setTransitionTriggered(true); // Prevent multiple triggers
      applyFact();
    }
    if(progress >= 1){
      setTransitionActive(false); // Hide transition video
      // Stop loading video
      setLoadingVisible(false);
    }
  }

  // Function to reset the app state
  function resetPage() {
    setDateInput(""); // Clear date input
    setFacts([]); // Clear facts
    setMessage(""); // Clear messages
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
          ref={transitionRef}
          className="absolute top-0 left-0 w-full h-full object-cover z-50"
          autoPlay
          muted
          onTimeUpdate={handleTransitionProgress} // Track video progress
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
        <p className="text-lg text-gray-300 mb-6">Search a Significant Day! (9/11/2001)</p>

        <div className="flex space-x-4 justify-center mb-8">
          <input
            type="date"
            className="px-4 py-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 text-white-800"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
          <button
            onClick={searchDate}
            disabled={loadingVisible}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md"
          >
            {!loadingVisible && "Search!"}
            
            {/* Loading Video */}
            {loadingVisible && (
              <video
                id="loadingVideo"
                autoPlay
                muted
                loop
                className="absolute top-0 left-0 w-full h-full object-cover z-50"
              >
                <source src={LoadingCircle} type="video/mp4" />
              </video>
            )}
          </button>
        </div>

        {/* Facts Output */}
        {facts.length > 0 && (
          <div
            id="output"
            className="w-10/12 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg p-6 output">
            {message && <p className="text-gray-300 mb-4">{message}</p>}
            {facts.map((fact, index) => (
            <div
              key={index}
              className="fact-item flex bg-gray-700 bg-opacity-80 text-white p-4 rounded-lg mb-4">
              <div className="fact-text flex-0 pr-4">
                {/* Fact Text */}
                <strong>{fact.year}:</strong> {fact.text}
              </div>
              <div className="flex-shrink-1">
                {/* Fact Image */}
                {fact?.pages?.[0]?.originalimage?.source && (
                  <img
                    src={fact.pages[0].originalimage.source}
                    alt="Fact Image"
                    className="fact-image rounded-lg w-80 h-80 object-contain"
                  />
                )}
              </div>
            </div>
            ))}
            </div>

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
