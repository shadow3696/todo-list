import React from 'react';
import { Navigate } from 'react-router-dom';

const GuardedRoute = ({ element: Element, auth }) => {
  return auth ? Element  : <Navigate to="/login" />;
};

export default GuardedRoute;