import { Redirect, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, ...routeProps }) {
  const { token, loading } = useAuth();

  return (
    <Route {...routeProps}>
      {loading ? <div className="route-state">Checking your session...</div> : token ? children : <Redirect to="/login" />}
    </Route>
  );
}

export default ProtectedRoute;
