import AuthComponent from 'components/AuthComponent/AuthComponent';
import Activities from '@/pages/Activities/Activities';

import PrivateRoute from 'components/PrivateRoute/PrivateRoute';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PerfilAluno from '@/pages/Perfil/perfil';
import PaginaNotas from '@/pages/Notas/notas';
import HomePage from '@/pages/Home/home';



const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthComponent />} />
        <Route path='/avisos' element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
          }></Route>
        <Route path='/atividades' element={
          <PrivateRoute>
            <Activities/>
          </PrivateRoute>
          }></Route>
        <Route path='/perfil' element={
          <PrivateRoute>
            <PerfilAluno/>
          </PrivateRoute>
          }></Route>
        <Route path='/nota' element={
          <PrivateRoute>
            <PaginaNotas/>
          </PrivateRoute>
          }></Route>
      </Routes>
    </Router>
  );
};

export default App;
