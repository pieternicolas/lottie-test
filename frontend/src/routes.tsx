import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import Login from '~/pages/Login';
import Home from '~/pages/Home';
import ProtectedRoute from '~/components/ProtectedRoute';

const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
    </Route>
  )
);

export default router;
