// App.tsx
import AuthComponent from 'components/AuthComponent/AuthComponent';
import Activities from '@/pages/Activities/Activities';
import HomePage from '@/pages/home';
import PrivateRoute from 'components/PrivateRoute/PrivateRoute';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthComponent />} />
        
        <Route path='/home' element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
          }></Route>
        <Route path='/home/activites' element={<Activities/>}></Route>
        {/* Adicione mais rotas conforme necessário */}
      </Routes>
    </Router>
  );
};

export default App;
