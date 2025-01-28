import { supabase } from "@/lib/supabase";
import ApprovalStatus from "components/ApprovalStatus/ApprovalStatus";
import DialogForgotPassword from "components/DialogForgotPassword/DialogForgotPassword";
import DialogSignUp from "components/DialogSignUp/DialogSignUp";
import Loading from "components/Loading/Loading";
import LoginSection from "components/LoginSection/LoginSection";
import SignUpSection from "components/SignUpSection/SignUpSection";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useRef, useState } from "react";
import {  useNavigate } from "react-router-dom";

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
      }else if(status === "REPROVADO"){
        setIsLoading(false);
        setLoginError("Seu cadastro foi reprovado.");
      }
      else if (status === "LISTA DE ESPERA") {
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
        <ApprovalStatus
          isLoading = {isLoading}
          approvalStatus= {approvalStatus}
          setShowApprovalStatus={setShowApprovalStatus}
        />
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
                <LoginSection
                  loginError={loginError}
                  registerError={registerError}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  setForgotPasswordModal={setForgotPasswordModal}

                />
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
                <SignUpSection
                  name={name}
                  setName={setName}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  fileInputRef={fileInputRef}
                  handleFileChange={handleFileChange}
                  arquivos={arquivos}
                  removerArquivo={removerArquivo}
                  handleCheckboxChange={handleCheckboxChange}
                  isChecked={isChecked}
                />
              </form>
            </TabsContent>
          </Tabs>
          
        </CardContent>
      </Card>

      <DialogSignUp
        showModal={showModal}
        setShowModal={setShowModal}
      />

      <DialogForgotPassword
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        email={email}
        setEmail={setEmail}
        setForgotPasswordModal={setForgotPasswordModal}
        forgotPasswordModal={forgotPasswordModal}
      />
    {isLoading && (<Loading/>)}
    </div>
  );
};

export default AuthComponent;
