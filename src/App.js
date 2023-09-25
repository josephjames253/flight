import React from 'react';
import './App.css';
import FlightBooking from './components/front page/FlightBooking';

// Import your logo image
import logo from 'C:/Users/249408/Desktop/front end/hack23-team116-frontend/flight/src/components/images/logo.png'; // Replace with the actual path to your logo image

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* Add the logo image */}
        <img src={logo} alt="Uyare.com Logo" className="App-logo" />
        <h1>UYARE.com</h1>
      </header>
      <main style={{ marginBottom: '20px' }}>
        <FlightBooking />
      </main>
      {/* Add the footer here */}
      <footer className="App-footer">
        {/* Your footer content goes here */}
        &copy; 2023 Traceback PVT.LTD All rights reserved.
      </footer>
    </div>
  );
}



export default App;
