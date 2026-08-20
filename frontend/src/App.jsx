import { NavLink, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import BookingPage from './pages/BookingPage';

function Navigation() {
  return (
    <nav className="navigation">
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/doctors">Doctors</NavLink>
      <NavLink to="/booking">Book appointment</NavLink>
    </nav>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <h1>MedCare Plus</h1>
        <Navigation />
      </header>
      <main className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </main>
    </div>
  );
}
