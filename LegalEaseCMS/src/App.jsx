import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import appRoutes from './routes'; 
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext'; // Import ThemeProvider

import './App.css';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <ThemeProvider> {/* Wrap your entire app with ThemeProvider */}
      <Navbar />
        <div>
          {/* Other components */}
          <Outlet /> {/* This will render child routes */}
        </div>
        <Routes>
          {appRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </ThemeProvider>
    </Router>
  );
};

export default App;

