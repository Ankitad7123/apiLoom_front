import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Box, Center, Flex, Heading } from '@chakra-ui/react';
import Selection from './Section/Selection';
import Login from './Section/Login';
import Login2 from './Section/Login2';

// A component to protect the Login routes
const ProtectedRoute = ({ children }) => {
  const userApi = localStorage.getItem('userApi');

  // If userApi exists, redirect to the Selection page
  if (userApi) {
    return <Navigate to="/selection" replace />;
  }

  // If no userApi, render the child component (Login)
  return children;
};

const NotFound = () => {
  const navigate = useNavigate(); // Correct way to use `useNavigate` inside the component
  const handleRedirect = (e) => {
    e.preventDefault();
    navigate('/selection'); // Redirects to `/selection`
  };

  return (
    <Box fontFamily="monospace" textAlign="center" mt={150}>
      <Flex align="center" justify="center" fontSize="larger">
        <Heading>4</Heading>
        <img
          style={{ width: '80px' }}
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0LtwervqLAyyD_7nj-oQ0kYCaDlBmbXqyEw&s"
          alt="logo_apiloom"
        />
        <Heading>4</Heading>
      </Flex>
      <p>Page not found.</p>
      <a href="#" style={{ margin: '130px', textDecoration: 'underline' }} onClick={handleRedirect}>
        Try this?
      </a>
    </Box>
  );
};

function App() {
  const userApi = localStorage.getItem('userApi');

  return (
    <Router basename="/apiLoom_front"> {/* Set basename here */}
      <Center>
        <Box bg="white" minHeight="100vh"> {/* Changed height to minHeight for better responsiveness */}
          <Routes>
            {/* Root Route */}
            <Route
              path="/"
              element={userApi ? <Navigate to="/selection" replace /> : <Navigate to="/apiloom" replace />}
            />

            {/* Protect the Login2 page, redirect to selection if already logged in */}
            <Route
              path="/login"
              element={
                <ProtectedRoute>
                  <Login2 />
                </ProtectedRoute>
              }
            />

            {/* Protect the Login page, redirect to selection if already logged in */}
            <Route
              path="/apiloom"
              element={
                <ProtectedRoute>
                  <Login />
                </ProtectedRoute>
              }
            />

            {/* Selection page should be accessible after login */}
            <Route path="/selection" element={<Selection />} />

            {/* Handle NotFound route */}
            <Route path="*" element={<Selection />} />
          </Routes>
        </Box>
      </Center>
    </Router>
  );
}

export default App;
