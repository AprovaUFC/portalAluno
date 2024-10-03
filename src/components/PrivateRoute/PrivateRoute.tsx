import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase'; // Importe sua instância do Supabase
import Loading from 'components/Loading/Loading';

type PrivateRouteProps = {
  children: ReactNode;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica se o usuário está autenticado ao inicializar o componente
    const checkAuthentication = () => {
      const user = supabase.auth.getUser(); // Obtém o usuário atual
      setIsAuthenticated(!!user); // Define como true se houver um usuário logado
      setLoading(false); // Finaliza o carregamento
    };

    checkAuthentication();

    // Adiciona um listener para atualizar o status de autenticação quando a sessão mudar
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user); // Atualiza a autenticação baseada na existência do usuário na sessão
    });

    return () => {
      authListener.subscription.unsubscribe(); // Desinscreve-se ao desmontar o componente
    };
  }, []);

  if (loading) {
    return <Loading />; // Exibe algo enquanto carrega/verifica autenticação
  }

  return isAuthenticated ? (
    <>{children}</> // Renderiza os filhos se o usuário estiver autenticado
  ) : (
    <Navigate to="/" replace /> // Redireciona para a página de login se não estiver autenticado
  );
};

export default PrivateRoute;
