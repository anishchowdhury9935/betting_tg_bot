import React from 'react';
import { useState } from 'react';
import { Route } from "react-router-dom";
import Rps_home from '../../games/rps/components/Rps_home.jsx';

export default function Rps_routes() {
  const [routes, setRoutes] = useState([
    <Route path="/rps/:bettingId/:type/:game/:userId" element={<Rps_home />} />,
  ])
  return routes;
}