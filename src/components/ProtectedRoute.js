import { Route, redirect } from 'react-router-dom';
import { useUserRole } from '../context/UserContext';

const ProtectedRoute = ({ component: Component, requiredRole, ...rest }) => {
  const { role } = useUserRole();

  return (
    <Route
      {...rest}
      render={(props) =>
        role === requiredRole ? (
          <Component {...props} />
        ) : (
          <redirect to="/" />
        )
      }
    />
  );
};

export default ProtectedRoute;
