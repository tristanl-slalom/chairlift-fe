import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import TasksPage from './pages/TasksPage';
import StatusManagementPage from './pages/StatusManagementPage';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-gray-900">Concepto</h1>
            <div className="flex gap-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Tasks
              </Link>
              <Link
                to="/admin/statuses"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  location.pathname === '/admin/statuses'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Status Management
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
          <Route path="/" element={<TasksPage />} />
          <Route path="/admin/statuses" element={<StatusManagementPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
