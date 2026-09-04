import { Routes, Route } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import { Navbar } from './components/Navbar';
import { RoleSwitcher } from './components/RoleSwitcher';
import { Home } from './pages/Home';
import { DonateForm } from './pages/DonateForm';
import { MyListings } from './pages/MyListings';
import BrowseListings from './pages/BrowseListings';
import ListingDetail from './pages/ListingDetail';
import ClaimConfirmation from './pages/ClaimConfirmation';
import About from './pages/About';
import NotFound from './pages/NotFound';
import DonationAssistant from './components/DonationAssistant';
import './App.css';
import './styles/recipient.css';

function App() {
  return (
    <RoleProvider>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <div className="container">
            <RoleSwitcher />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/donate" element={<DonateForm />} />
              <Route path="/my-listings" element={<MyListings />} />
              <Route path="/browse" element={<BrowseListings />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
              <Route path="/listings/:id/confirmed" element={<ClaimConfirmation />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
        <DonationAssistant />
      </div>
    </RoleProvider>
  );
}

export default App;