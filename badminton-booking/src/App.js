
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';
import routes from './routes';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div></div>}>
          <div className="App">
            <Routes>
              {routes.map((route, index) => {
                const Layout = route.layout || Fragment;
                const Page = route.element;
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <Layout>
                        <Page />
                      </Layout>
                    }
                  />
                );
              })}
            </Routes>
          </div>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
