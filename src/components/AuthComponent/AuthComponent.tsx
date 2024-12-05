import { supabase } from "@/lib/supabase";
import { CheckboxText } from "components/Checkbox/CheckboxText";
import Loading from "components/Loading/Loading";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "components/ui/dialog";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Bell, CheckCircle, FileText, X, XCircle } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Arquivo = {
  nome: string
  tipo: "imagem" | "documento"
  url: string
  arquivo: File
}

const AuthComponent = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showModal,setShowModal] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [showApprovalStatus, setShowApprovalStatus] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<
    "APROVADO" | "PENDENTE" | "LISTA DE ESPERA"
  >("PENDENTE");
  const [arquivos, setArquivos] = useState<Arquivo[]>([])
  const navigate = useNavigate();

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Substitui o arquivo existente com o novo
      const file = files[0];
      const tipo: "imagem" | "documento" = file.type.startsWith("image/") ? "imagem" : "documento";
  
      const novoArquivo: Arquivo = {
        
        nome: file.name,
        tipo: tipo,
        url: URL.createObjectURL(file),
        arquivo: file,
      };
  
      setArquivos([novoArquivo]); // Substitui o array de arquivos com o novo arquivo
    }
  };

  const removerArquivo = (index: number) => {
    const novosArquivos = [...arquivos];
    URL.revokeObjectURL(novosArquivos[index].url);
    novosArquivos.splice(index, 1);
    setArquivos(novosArquivos);
  };

  // Função de login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(""); // Reseta o erro ao tentar login novamente
    setIsLoading(true); // Inicia o estado de carregamento
  
    try {
      // Verifica o status do usuário antes de permitir o login
      const { data: userStatusData, error: userStatusError } = await supabase
        .from("Aluno")
        .select("Status,termAccepted")
        .eq("email", email);
  
      if (userStatusError) {
        setIsLoading(false);
        console.error("Erro ao verificar o status do usuário:", userStatusError.message);
        setLoginError("Erro ao verificar o status do usuário. Tente novamente.");
        return;
      }
  
      if (!userStatusData || userStatusData.length === 0) {
        setIsLoading(false);
        setLoginError("Usuário não encontrado. Verifique suas credenciais.");
        return;
      }
  
      const status = userStatusData[0].Status;
      const termAccepted = userStatusData[0].termAccepted
      if (status === "PENDENTE") {
        setIsLoading(false);
        setLoginError("Seu cadastro ainda não foi aprovado. Aguarde a aprovação.");
        return;
      }else if (status === "LISTA DE ESPERA") {
        setIsLoading(false);
        setLoginError("Seu cadastro foi colocado na lista de espera. Entre em contato com a instituição para mais informações.");
        return;
      }else if (termAccepted == false){
        setIsLoading(false);
        setLoginError('Você não aceitou os termos e condições de uso. Fale com a organização do projeto para rever isto');
        return;
      }
  
      // Prossegue com o login se o status for APROVADO
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      // Verifica se ocorreu um erro de autenticação
      if (authError || !user) {
        setIsLoading(false);
        setLoginError("Email ou senha inválido."); // Mensagem de erro mais clara para o usuário
        return;
      }
  
      // Login bem-sucedido
      navigate("/avisos"); // Redireciona para a página principal
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setLoginError("Erro ao fazer login. Tente novamente."); // Em caso de erro inesperado
    } finally {
      setIsLoading(false); // Finaliza o estado de carregamento
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    setResetMessage('');
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setResetMessage('Erro ao tentar recuperar senha. Verifique o email inserido.');
    } else {
      setResetMessage('Um email de recuperação foi enviado. Por favor, verifique sua caixa de entrada.');
    }

    setIsLoading(false)
  };

  // Função de registro
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApprovalStatus("PENDENTE");
    setIsLoading(true);
    if(arquivos.length < 1){
      setIsLoading(false)
      alert('Lembre-se de inserir o documento no anexo para efetuar o cadastro.');
      return;
    }
  
    // Verifica se o email já existe na tabela 'Aluno' antes de tentar cadastrar o usuário
    const { data: existingUserData, error: existingUserError } = await supabase
      .from("Aluno")
      .select("email")
      .eq("email", email);
  
    if (existingUserError) {
      setIsLoading(false);
      console.error("Erro ao verificar se o email já existe:", existingUserError.message);
      return;
    }
  
    if (existingUserData && existingUserData.length > 0) {
      setIsLoading(false);
      setRegisterError("Email já cadastrado, tente efetuar login");
      console.error("Erro: Email já está cadastrado na tabela de alunos.");
      return;
    }
  
    // Envia os arquivos para o storage e obtém as URLs
    const arquivo = arquivos[0]; // Pega o único arquivo, já que o array é sempre substituído

    const { error: uploadError } = await supabase.storage
      .from("doc_alunos")
      .upload(`${arquivo.nome}`, arquivo.arquivo);
    
    if (uploadError) {
      console.error("Erro ao enviar arquivo para o storage:", uploadError.message);
      return;
    }
    
    // Obtém a URL pública do arquivo
    const { data: publicURLData } = supabase.storage
      .from("doc_alunos")
      .getPublicUrl(`${arquivo.nome}`);
    
    const publicURL = publicURLData?.publicUrl ?? null;
    
    // Insere o aluno na tabela 'Aluno' com a URL do arquivo
    const { data: alunoData, error: insertError } = await supabase
      .from("Aluno")
      .insert([
        {
          name: name,
          email: email,
          Status: approvalStatus,
          documentos: publicURL, // Armazena a URL como string
          termAccepted: isChecked, 
        },
      ])
      .select("id")
      .single();
    
    if (insertError || !alunoData) {
      setIsLoading(false);
      console.error("Erro ao inserir dados na tabela aluno:", insertError?.message);
      return;
    }
    
  
    const alunoId = alunoData.id;
  
    // Registra o usuário no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          aluno_id: alunoId
        },
      },
    });
  
    if (error) {
      setIsLoading(false);
      if (error.message.includes("already registered")) {
        console.error("Erro: Email já está registrado no Supabase Auth.");
      } else {
        console.error("Erro ao cadastrar:", error.message);
      }
      return;
    }
  
    const user = data?.user;
    if (!user) {
      setIsLoading(false);
      console.error("Erro: Usuário não foi criado corretamente.");
      return;
    }
  
    setIsLoading(false); // Finaliza o estado de carregamento
    setShowApprovalStatus(true);
    setShowModal(true);
  };
  

  const handleCheckApprovalStatus = async () => {
    setIsLoading(true); // Inicia o estado de carregamento

    const { data, error } = await supabase
      .from("Aluno")
      .select("Status") // Seleciona apenas a coluna 'Status'
      .eq("email", email); // Filtra pela coluna 'email'

    setIsLoading(false); // Finaliza o estado de carregamento após a operação

    if (error) {
      console.error("Erro ao buscar o status:", error);
    } else if (data && data.length > 0) {
      const status = data[0].Status;
      setApprovalStatus(status);
    } else {
      setShowApprovalStatus(false);
      console.error("Nenhum usuário encontrado com esse email.");
      return;
    }

    setShowApprovalStatus(true);
  };



  // Exibir a tela de status de aprovação
  if (showApprovalStatus) {
    return (
          <div className="flex items-center justify-center min-h-screen bg-green-50 max-sm:p-6">
            <Card className="w-[400px]">
              <CardHeader className="bg-green-600 text-white rounded-t-lg">
                <CardTitle>Status de Aprovação</CardTitle>
                <CardDescription className="text-green-100">
                  Verifique o status do seu processo seletivo
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  {approvalStatus === "PENDENTE" && (
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
                  {approvalStatus === "APROVADO" && (
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
                  {approvalStatus === "LISTA DE ESPERA" && (
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
            {isLoading && (<Loading/>)}
          </div>
    );
  }

  return (
   
    <div className="flex items-center justify-center min-h-screen bg-green-50 max-sm:p-6">
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
                  <p className="text-red-500 text-sm">{loginError}</p>
                )}
                {registerError && (
                  <p className="text-red-500 text-sm">{registerError}</p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Link to={"/avisos"}>Entrar</Link>
                </Button>
              <Button type="button" variant="link" onClick={() => setForgotPasswordModal(true)} className="mt-2 w-full self-center">
                Esqueceu sua senha?
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
                <div>
                <Label>Anexos/Documentos</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-green-100 text-green-700 hover:bg-green-200"
                    >
                      Adicionar Arquivo
                    </Button>
                    <Input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf"
                      
                    />
                    
                    <div>
                      {arquivos.map((arquivo, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded-md shadow">
                          {arquivo.tipo === "imagem" ? (
                            <div className="relative aspect-video">
                              <img
                                src={arquivo.url}
                                alt={arquivo.nome}
                                className="rounded-md object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <FileText className="text-green-600" size={24} />
                              <span className="text-sm truncate">{arquivo.nome}</span>
                            </div>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-white"
                            onClick={() => removerArquivo(index)}
                          >
                            <X size={16}  />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <CheckboxText
                  handleCheckboxChange={handleCheckboxChange}
                  isChecked={isChecked}
                />
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

      <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastro Realizado!</DialogTitle>
            <DialogDescription>
              Verifique a caixa de mensagens do email inserido no cadastro para confirmar o email.
            </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>

    <Dialog open={forgotPasswordModal} onOpenChange={setForgotPasswordModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recuperar Senha</DialogTitle>
          <DialogDescription>
            Insira seu email para receber instruções de redefinição de senha.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-green-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Enviar Email de Recuperação</Button>
        </form>
        {resetMessage && (
          <p className="mt-4 text-green-500 text-sm">{resetMessage}</p>
        )} {isLoading && (<Loading/>)}
      </DialogContent>
    </Dialog>
    {isLoading && (<Loading/>)}
    </div>
  );
};

export default AuthComponent;
