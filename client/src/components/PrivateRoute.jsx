import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { fetchMe } from '../api.js';

const PrivateRoute = ({ children }) => {
  const { token, user, login, logout } = useContext(AuthContext);
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setAuthorized(false);
        setChecking(false);
        return;
      }

      try {
        const data = await fetchMe(token);
        login(token, data); // refresh user info
        setAuthorized(true);
      } catch {
        logout();
        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    };

    verifyToken();
  }, [token]);

  if (checking) {
    return (
      <div
        style={{
          color: 'white',
          background: 'black',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1rem',
        }}
      >
        Checking authentication...
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
