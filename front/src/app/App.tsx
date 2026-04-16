import { AppLayout } from '../widgets';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from '../pages';

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
        </Route>
      </Routes>
    </>
  );
}

export default App;
