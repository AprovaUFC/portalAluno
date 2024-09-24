import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // Importe sua instância do Supabase
import HomePage from '@/pages/home';
import Loading from 'components/Loading/Loading';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user); // Define como true se o usuário estiver logado
      setLoading(false); // Finaliza o carregamento
    };

    checkUser();
  }, []);

  if (loading) {
    return <Loading/>; // Opcional: Exibe um carregando enquanto verifica a autenticação
  }

  return isAuthenticated ? (
    <HomePage /> // Se estiver logado, renderiza a página inicial
  ) : (
    <Navigate to="/" /> // Se não estiver, redireciona para a página de login
  );
};

export default PrivateRoute;
