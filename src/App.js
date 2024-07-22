import { BrowserRouter , Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/login/login';
import TablePage from './pages/customers/table';
import NoMatch from './pages/404/NoMatch';
import GuardedRoute from './components/gaurd/gaurd';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function login() {
    setIsAuthenticated(true);
  };

  function logout() {
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login login={login} logout={logout} />} />
        <Route path="/" element={<Login login={login} logout={logout} />} />
        <Route path="/table" element={<GuardedRoute auth={isAuthenticated} element={<TablePage logout={logout} auth={isAuthenticated}/> } />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
