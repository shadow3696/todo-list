import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/form/login';
import TablePage from './pages/customers/table';
import NoMatch from './pages/404/NoMatch';
import GuardedRoute from './components/secure/gaurd';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function login() {
    setIsAuthenticated(true);
  }

  function logout() {
    setIsAuthenticated(false);
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login login={login} logout={logout} />} />
        <Route path="/" element={<Login login={login} logout={logout} />} />
        <Route path="/table" element={<GuardedRoute auth={isAuthenticated} element={<TablePage logout={logout} auth={isAuthenticated}/> } />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  );
}

export default App;
