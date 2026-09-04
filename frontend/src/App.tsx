import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import { Navbar } from './components/Navbar';
import { RoleSwitcher } from './components/RoleSwitcher';
import { Home } from './pages/Home';
import { DonateForm } from './pages/DonateForm';
import { MyListings } from './pages/MyListings';
import './App.css';

function App() {
  return (
    <BrowserRouter>
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
                {/* Placeholder routes for Member 2's pages */}
                <Route path="/browse" element={<div className="placeholder-page"><h2>Browse Listings</h2><p>Coming soon - Member 2</p></div>} />
                <Route path="/listings/:id" element={<div className="placeholder-page"><h2>Listing Detail</h2><p>Coming soon - Member 2</p></div>} />
                <Route path="/listings/:id/confirmed" element={<div className="placeholder-page"><h2>Claim Confirmation</h2><p>Coming soon - Member 2</p></div>} />
                <Route path="/about" element={<div className="placeholder-page"><h2>About</h2><p>Coming soon - Member 2</p></div>} />
                <Route path="*" element={<div className="placeholder-page"><h2>404 - Not Found</h2><p>Page not found</p></div>} />
              </Routes>
            </div>
          </main>
        </div>
      </RoleProvider>
    </BrowserRouter>
  );
}

export default App;
