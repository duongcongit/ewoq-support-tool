import './App.css';
import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';

import DefaultLayout from './components/Layout/DefaultLayout';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            // Set layout
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            }
            else if (route.layout === null) {
              Layout = Fragment;
            }

            // Set page
            const Page = route.component;

            return <Route
              key={index}
              path={route.path}
              element={
                <Layout><Page /></Layout>
              }
            />
          })}

        </Routes>
      </div>
    </Router>
  );
}

export default App;
