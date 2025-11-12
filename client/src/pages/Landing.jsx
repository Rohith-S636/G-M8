import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="landing">
      <h1>Landing Page</h1>
      <button onClick={() => navigate('/login')}>Go to Login</button>
    </div>
  );
};

export default Landing;