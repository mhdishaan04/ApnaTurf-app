import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

type Props = { children: JSX.Element };

export default function PrivateRoute({ children }: Props) {
  // We only get user and loading now, no profile
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // All the complicated profile-checking logic is gone!
  return children;
}