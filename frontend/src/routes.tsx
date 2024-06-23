import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import App from '~/pages/App';
import Login from '~/pages/Login';
import ProtectedRoute from '~/components/ProtectedRoute';

const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
    </Route>
  )
);

export default router;
