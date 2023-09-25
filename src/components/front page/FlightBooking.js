import React, { useState } from 'react';
import './FlightBooking.css';
import axios from 'axios';

const FlightBooking = () => {
  const [tripType, setTripType] = useState('oneWay');
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalCity, setArrivalCity] = useState('');
  const [flightClass, setFlightClass] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showFlightResults, setShowFlightResults] = useState(false);

  const cities = [
    { cityName: 'New York', iataCode: 'JFK' },
    { cityName: 'Los Angeles', iataCode: 'LAX' },
    // Add more cities and IATA codes as needed
  ];

  const [selected, setSelected] = useState({
    departureCity: '',
    arrivalCity: '',
  });

  const handleSelect = (value, type) => {
    if (type === 'departure') {
      setSelected({ ...selected, departureCity: value });
    }
    if (type === 'arrival') {
      setSelected({ ...selected, arrivalCity: value });
    }

    setCitySuggestions([]);
    setArrivalCitySuggestions([]);
  };

  const [citySuggestions, setCitySuggestions] = useState([]);
  const [arrivalCitySuggestions, setArrivalCitySuggestions] = useState([]);

  const getSuggestionList = async (value, type) => {
    if (type === 'departure') {
      setDepartureCity(value);
      const { data } = await axios.get(`http://localhost:8085/searchAirport/${value}`);
      setCitySuggestions(data);
    } else if (type === 'arrival') {
      setArrivalCity(value);
      const { data } = await axios.get(`http://localhost:8085/searchAirport/${value}`);
      setArrivalCitySuggestions(data);
    }
  };

  const handleValueChange = async (event, type) => {
    const inputValue = event.target.value;
    setSelected({ ...selected, [type]: inputValue });
    if (inputValue !== '') {
      const { data } = await axios.get(`http://localhost:8085/searchAirport/${inputValue}`);
      if (type === 'departure') {
        setCitySuggestions(data);
      } else if (type === 'arrival') {
        setArrivalCitySuggestions(data);
      }
    }
  };

  const handleTripTypeChange = (e) => {
    setTripType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement flight search logic here
    const mockResults = {
      iataF: selected.departureCity,
      iataT: selected.arrivalCity,
      classType: flightClass,
      date: departureDate,
    };
    try {
      // Make the POST request using Axios
      const response = await axios.post('http://localhost:8089/routes', mockResults);
      setSearchResults(response.data);
      setShowFlightResults(true); // Show flight results
      // Handle the response here (e.g., display a success message)
      console.log('Response:', response.data);
    } catch (error) {
      // Handle errors (e.g., display an error message)
      console.error('Error:', error);
    }
    console.log('Searching for flights...');
  };

  return (
    <div className="flight-booking-container">
      <div className="booking-header">
        <h1 className="booking-heading">Book Your Flight</h1>
        <div className="trip-type-selection">
          <button
            type="button"
            className={`btn ${tripType === 'oneWay' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTripType('oneWay')}
          >
            One Way
          </button>
          <button
            type="button"
            className={`btn ${tripType === 'roundTrip' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTripType('roundTrip')}
          >
            Round Trip
          </button>
        </div>
      </div>
      <br></br>
      {showFlightResults ? (
        <div className="flight-results">
          {/* Display flight search results here */}
          {searchResults.map((result, index) => (
            <div className="result-card" key={index}>
              <h3>Flight Details</h3>
              <p><strong>Airline</strong> {result.airLineIata}</p>
              <p><strong>Maximum Duration</strong> {result.max_duration}</p>
              {/* Display other flight details as needed */}
            </div>
          ))}
          <button onClick={() => setShowFlightResults(false)}>Back to Search</button>
        </div>
      ) : (
        <form className="flight-booking-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Departure City:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter departure city"
              value={selected.departureCity}
              onChange={(e) => handleValueChange(e, 'departure')}
            />
            <ul>
              {citySuggestions.map((city) => (
                <li key={city.id} onClick={() => handleSelect(city.code, 'departure')}>{city.name} ({city.code})</li>
              ))}
            </ul>
          </div>
          <div className="form-group">
            <label>Arrival City:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter arrival city"
              value={selected.arrivalCity}
              onChange={(e) => handleValueChange(e, 'arrival')}
            />
            <ul>
              {arrivalCitySuggestions.map((city) => (
                <li key={city.id} onClick={() => handleSelect(city.code, 'arrival')}>{city.name} ({city.code})</li>
              ))}
            </ul>
          </div>
          <div className="form-group mt-3">
            <label>Choose class:</label>
            <select className="form-control mr-2" value={flightClass} onChange={(e) => setFlightClass(e.target.value)}>
              <option value="Economy">Economy Class</option>
              <option value="Business">Business Class</option>
              <option value="First">First Class </option>
            </select>
          </div>
          <div className="form-group">
            <label>Departure Date:</label>
            <input
              type="date"
              className="form-control"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          </div>
          {tripType === 'roundTrip' && (
            <div className="form-group">
              <label>Return Date:</label>
              <input
                type="date"
                className="form-control"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            Search Flights
          </button>
        </form>
      )}
    </div>
  );
};

export default FlightBooking;
