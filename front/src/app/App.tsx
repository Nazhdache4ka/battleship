import { AppLayout } from '../widgets';
import { Routes, Route } from 'react-router-dom';
import { LoginPage, RegisterPage } from '../pages';

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<AppLayout />}
        >
          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route
            path="/register"
            element={<RegisterPage />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
