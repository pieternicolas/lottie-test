import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import ProtectedRoute from '~/components/ProtectedRoute';

import Login from '~/pages/Login';
import Home from '~/pages/Home';
import ProjectView from '~/pages/Project';

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
      <Route
        path="/project/:projectId"
        element={
          <ProtectedRoute>
            <ProjectView />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
    </Route>
  )
);

export default router;
