import { useAtomValue } from 'jotai';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { currentUserAtom } from '~/store/auth';
import Layout from './Layout';

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const currentUser = useAtomValue(currentUserAtom);

  if (!currentUser?.id) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;
