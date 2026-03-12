import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Rps_routes from './routes/Rps_routes.jsx';
import { Toaster } from 'react-hot-toast';
import socketEvents from '../games/rps/utils/socketFiles/socketEvents.js';
import Rps_home from '../games/rps/components/Rps_home.jsx'
function App() {
  return (
    <>
      <Router>
        {/* Same as */}
        <Toaster />
        <Routes>
          {/* {Rps_routes().map((element) => {
            return element
          })} */}
          <Route path="/rps/:bettingId/:type/:game/:userId" element={<Rps_home />} />
          <Route path='*' element={<h4>page not found</h4>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;