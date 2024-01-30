import React, { useState, useEffect } from "react";
import backgroundImage from "./images/aeroplane.png";
import axios from "axios";

const FlightSearchForm = () => {
  const [formData, setFormData] = useState({
    departureDate: "",
    arrivalDate: "",
    source: "",
    destination: "",
    stoppage: "",
    airline: "",
  });

  const [flightPrice, setFlightPrice] = useState(null);
  const sources = ["Delhi", "Mumbai", "Kolkata", "Chennai", "Banglore"];
  const destinations = [
    "Cochin",
    "Banglore",
    "Hyderabad",
    "New Delhi",
    "Kolkata",
    "Delhi",
  ];
  const stoppage = [1, 2, 3, 4, 5];
  const airlines = [
    "Jet Airways",
    "IndiGo",
    "Air India",
    "Multiple carriers",
    "SpiceJet",
    "Vistara",
    "Air Asia",
    "GoAir",
    "Multiple carriers Premium economy",
    "Jet Airways Business",
    "Vistara Premium economy",
  ];
  const [maxArrivalDate, setMaxArrivalDate] = useState("");
  useEffect(() => {
    if (formData.departureDate) {
      const departureDate = new Date(formData.departureDate);
      const maxDate = new Date(departureDate);
      maxDate.setDate(maxDate.getDate() + 3); // Add 3 days to departure date

      const maxDateString = maxDate.toISOString().substring(0, 16);
      setMaxArrivalDate(maxDateString);

      // Functional update for arrivalDate
      setFormData((currentFormData) => {
        if (new Date(currentFormData.arrivalDate) > maxDate) {
          return { ...currentFormData, arrivalDate: maxDateString };
        }
        return currentFormData;
      });
    }
  }, [formData.departureDate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Filtered destinations based on selected source
  const filteredDestinations = destinations.filter(
    (destination) => destination !== formData.source
  );
  // Filtered sources based on selected destination
  const filteredSources = sources.filter(
    (source) => source !== formData.destination
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/predict", {
        departure_time: formData.departureDate,
        arrival_time: formData.arrivalDate,
        total_stops: formData.stoppage,
        airline: formData.airline,
        source: formData.source,
        destination: formData.destination,
      });
      setFlightPrice(response.data.flight_price);
    } catch (error) {
      console.error("Error fetching flight price:", error);
      // Handle the error appropriately
    }
  };

  return (
    <div
      className="flex justify-center items-start h-screen bg-gradient-to-b from-blue-400 to-blue-600"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white bg-opacity-50 p-8 rounded-t-3xl rounded-b-3xl shadow-3xl w-full max-w-3xl mt-12">
        {" "}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Flight Price Checker
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="departureDate"
              >
                Departure Date
              </label>
              <input
                type="datetime-local"
                name="departureDate"
                id="departureDate"
                required
                value={formData.departureDate}
                onChange={handleChange}
                className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="bg-gray-100  p-4 rounded-lg shadow">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="arrivalDate"
              >
                Arrival Date
              </label>
              <input
                type="datetime-local"
                name="arrivalDate"
                id="arrivalDate"
                value={formData.arrivalDate}
                required
                onChange={handleChange}
                className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                min={formData.departureDate} // Set minimum date
                max={maxArrivalDate} // Set maximum date
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="source"
              >
                Source
              </label>
              <select
                name="source"
                id="source"
                required
                value={formData.source}
                onChange={handleChange}
                className="shadow border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="">Select Source</option>
                {filteredSources.map((source, index) => (
                  <option key={index} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="destination"
              >
                Destination
              </label>
              <select
                name="destination"
                id="destination"
                required
                value={formData.destination}
                onChange={handleChange}
                className="shadow border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="">Select Destination</option>
                {filteredDestinations.map((destination, index) => (
                  <option key={index} value={destination}>
                    {destination}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="stoppage"
              >
                Stoppage
              </label>
              <select
                name="stoppage"
                id="stoppage"
                value={formData.stoppage}
                onChange={handleChange}
                required
                className="shadow border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="">Select Stoppage</option>
                {stoppage.map((stoppage, index) => (
                  <option key={index} value={stoppage}>
                    {stoppage}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="airline"
              >
                Airline
              </label>
              <select
                name="airline"
                id="airline"
                value={formData.airline}
                required
                onChange={handleChange}
                className="shadow border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="">Select Airline</option>
                {airlines.map((airline, index) => (
                  <option key={index} value={airline}>
                    {airline}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="w-full inline-block px-6 py-3 bg-blue-600 text-white font-medium text-sm leading-tight uppercase rounded-md shadow-md hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 transition duration-150 ease-in-out"
            >
              Check Prices
            </button>
          </div>
        </form>
        {flightPrice !== null && (
          <div className="mt-6 text-center">
            <div className="inline-block p-4 bg-white rounded-lg shadow-xl">
              <p className="text-2xl font-bold text-gray-800">
                Flight Price:
                <span className="text-green-500">{`Rs ${flightPrice}`}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSearchForm;
