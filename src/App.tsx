import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import FlightSearch from './pages/FlightSearch';
import BookingFlow from './pages/BookingFlow';
import CustomerDashboard from './pages/CustomerDashboard';
import BookingDetails from './pages/BookingDetails';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
              Slalom Chairlift
            </Link>
            <div className="flex gap-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Search Flights
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<FlightSearch />} />
          <Route path="/booking" element={<BookingFlow />} />
          <Route path="/customers/:id/dashboard" element={<CustomerDashboard />} />
          <Route path="/bookings/:id" element={<BookingDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
