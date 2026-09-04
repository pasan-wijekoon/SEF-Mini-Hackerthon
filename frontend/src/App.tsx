import { Routes, Route, Link, NavLink } from 'react-router-dom';
import BrowseListings from './pages/BrowseListings';
import ListingDetail from './pages/ListingDetail';
import ClaimConfirmation from './pages/ClaimConfirmation';
import About from './pages/About';
import NotFound from './pages/NotFound';
import DonationAssistant from './components/DonationAssistant';
import './styles/recipient.css';

// NOTE: This is a temporary nav so the Recipient pages are reachable.
// Member 1 owns the real Navbar / RoleSwitcher — swap this out at integration.
function TempNav() {
  return (
    <nav className="tempnav">
      <Link to="/" className="tempnav-brand">🍲 FoodShare LK</Link>
      <div className="tempnav-links">
        <NavLink to="/browse">Browse</NavLink>
        <NavLink to="/about">About</NavLink>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <>
      <TempNav />
      <main>
        <Routes>
          {/* Recipient side (Member 2) */}
          <Route path="/browse" element={<BrowseListings />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/listings/:id/confirmed" element={<ClaimConfirmation />} />
          <Route path="/about" element={<About />} />

          {/* Placeholder home until Member 1's Home page lands */}
          <Route path="/" element={<BrowseListings />} />

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* AI donation assistant — floating chat, available on every page */}
      <DonationAssistant />
    </>
  );
}
