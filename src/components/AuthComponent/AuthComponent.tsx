import { supabase } from '@/lib/supabase'
import { Button } from 'components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs'
import { Bell, CheckCircle, XCircle } from 'lucide-react'
import {  useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const AuthComponent = () => {
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [showApprovalStatus, setShowApprovalStatus] = useState(false);
    const [approvalStatus, setApprovalStatus] = useState<'Aprovado' | 'Pendente' | 'ListaEspera'>('Aprovado');
    const navigate = useNavigate();
    
    // Função de login
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginError(''); // Reseta o erro ao tentar login novamente
    
        try {
            const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
    
            // Verifica se ocorreu um erro de autenticação
            if (authError || !user) {
                setLoginError('Email ou senha inválido.'); // Mensagem de erro mais clara para o usuário
                return;
            }
    
            // Login bem-sucedido
            console.log('Login bem-sucedido', user);
            navigate('/home'); // Redireciona para a página principal
        } catch (err) {
            console.error('Erro ao fazer login:', err);
            setLoginError('Erro ao fazer login. Tente novamente.'); // Em caso de erro inesperado
        }
    };
    
      

    // Função de registro
    const handleRegister = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setApprovalStatus('Pendente')
        // Primeiro, tentamos registrar o usuário no Supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,  // Adiciona o nome completo ao perfil do usuário
                },
            },
        });
    
        if (error) {
            console.error('Erro ao cadastrar:', error.message);
            return;
        }
    
        // Se o cadastro for bem-sucedido, insira o usuário na tabela 'aluno'
        const user = data?.user;
        if (!user) {
            console.error('Erro: Usuário não foi criado corretamente.');
            return;
          }
        console.log(user)
        // Aqui vamos adicionar os dados do usuário na tabela 'aluno'
        const { error: insertError } = await supabase
            .from('Aluno')
            .insert([
                {
                    name: name,
                    dataNascimento: new Date().toISOString(),  // Ajuste para a data de nascimento correta
                    email: user.email,
                    Status: approvalStatus,  // Inicialmente, o status pode ser 'pending'
                },
            ]);
    
        if (insertError) {
            console.error('Erro ao inserir dados na tabela aluno:', insertError.message);
        } else {
            console.log('Usuário registrado com sucesso e inserido na tabela aluno');
            setShowApprovalStatus(true); // Redireciona para verificar status de aprovação
        }
    };
    


    const handleCheckApprovalStatus = async () =>{
        const { data, error } = await supabase
            .from('Aluno')
            .select('Status')  // Seleciona apenas a coluna 'status'
            .eq('email', email);  // Filtra pela coluna 'email'

            if (error) {
            console.error('Erro ao buscar o status:', error);
            } else if (data && data.length > 0) {
            const status = data[0].Status;
            console.log('Status encontrado:', status);
            setApprovalStatus(status)
            } else {
            console.log('Nenhum usuário encontrado com esse email.');
            }
        
        
        setShowApprovalStatus(true)
    }


    // Exibir a tela de status de aprovação
    if (showApprovalStatus) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-green-50">
                <Card className="w-[400px]">
                    <CardHeader className="bg-green-600 text-white rounded-t-lg">
                        <CardTitle>Status de Aprovação</CardTitle>
                        <CardDescription className="text-green-100">
                            Verifique o status do seu processo seletivo
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            {approvalStatus === "Pendente" && (
                                <>
                                    <div className="text-yellow-500 flex items-center justify-center">
                                        <Bell className="h-12 w-12" />
                                    </div>
                                    <p className="text-lg font-semibold">
                                        Seu cadastro está em análise
                                    </p>
                                    <p>Aguarde a aprovação para acessar o portal</p>
                                </>
                            )}
                            {approvalStatus === "Aprovado" && (
                                <>
                                    <div className="text-green-500 flex items-center justify-center">
                                        <CheckCircle className="h-12 w-12" />
                                    </div>
                                    <p className="text-lg font-semibold">
                                        Parabéns! Seu cadastro foi aprovado
                                    </p>
                                    <p>Você já pode fazer login no portal</p>
                                </>
                            )}
                            {approvalStatus === "ListaEspera" && (
                                <>
                                    <div className="text-yellow-500 flex items-center justify-center">
                                        <XCircle className="h-12 w-12" />
                                    </div>
                                    <p className="text-lg font-semibold">
                                        Desculpe, seu cadastro foi para a Lista de Espera
                                    </p>
                                    <p>
                                        Entre em contato com a instituição para mais informações
                                    </p>
                                </>
                            )}
                            <Button
                                onClick={() => setShowApprovalStatus(false)}
                                className="w-full bg-green-600 hover:bg-green-700"
                            >
                                Voltar para Login
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return( 
    <div className="flex items-center justify-center min-h-screen bg-green-50">
                <Card className="w-[400px]">
                    <CardHeader className="bg-green-600 text-white rounded-t-lg">
                        <CardTitle>Portal do Aluno</CardTitle>
                        <CardDescription className="text-green-100">
                            Faça login ou cadastre-se para acessar o portal
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="register">Cadastro</TabsTrigger>
                            </TabsList>
                            <TabsContent value="login">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="Email">Email</Label>
                                        <Input
                                            id="username"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="border-green-300 focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Senha</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="border-green-300 focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>
                                            {/* Exibe a mensagem de erro se houver */}
                                            {loginError && (
                                                <p className="text-red-500 text-sm">
                                                    {loginError}
                                                </p>
                                            )}
                                    <Button
                                        type="submit"
                                        className="w-full bg-green-600 hover:bg-green-700"
                                    >
                                         <Link to={'/Home'}>Entrar</Link>
                                        
                                    </Button>
                                </form>
                                <div className="mt-4 text-center">
                                    <Button
                                        variant="link"
                                        onClick={handleCheckApprovalStatus}
                                        className="text-green-600"
                                    >
                                        Verificar Status de Aprovação
                                    </Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="register">
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nome Completo</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="border-green-300 focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">E-mail</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="border-green-300 focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">Senha</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="border-green-300 focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-green-600 hover:bg-green-700"
                                    >
                                        Cadastrar
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        )
    }


export default AuthComponent;
