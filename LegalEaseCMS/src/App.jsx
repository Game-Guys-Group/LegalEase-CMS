// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import appRoutes from './routes'; 
import { Outlet } from 'react-router-dom';

import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        {/* Other components */}
        <Outlet /> {/* This will render child routes */}
      </div>
      <Routes>
        {appRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
};

export default App;

