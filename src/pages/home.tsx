"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  GraduationCap,
  Bell,
  Home,
  LogOut,
  User,
  CheckCircle,
  XCircle,
  Menu,
} from "lucide-react";

type ApprovalStatus = "pending" | "approved" | "rejected";

export default function PortalDoAluno() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [approvalStatus, setApprovalStatus] =
    useState<ApprovalStatus>("pending");
  const [showApprovalStatus, setShowApprovalStatus] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password && approvalStatus === "approved") {
      setIsLoggedIn(true);
    } else if (approvalStatus !== "approved") {
      setShowApprovalStatus(true);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registro:", { name, email, username, password });
    setApprovalStatus("pending");
    setShowApprovalStatus(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setEmail("");
    setName("");
    setShowApprovalStatus(false);
  };

  const checkApprovalStatus = () => {
    const randomStatus: ApprovalStatus = ["pending", "approved", "rejected"][
      Math.floor(Math.random() * 3)
    ] as ApprovalStatus;
    setApprovalStatus(randomStatus);
    setShowApprovalStatus(true);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

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
              {approvalStatus === "pending" && (
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
              {approvalStatus === "approved" && (
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
              {approvalStatus === "rejected" && (
                <>
                  <div className="text-red-500 flex items-center justify-center">
                    <XCircle className="h-12 w-12" />
                  </div>
                  <p className="text-lg font-semibold">
                    Desculpe, seu cadastro não foi aprovado
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

  if (!isLoggedIn) {
    return (
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
                    <Label htmlFor="username">Usuário</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Entrar
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <Button
                    variant="link"
                    onClick={checkApprovalStatus}
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
                    <Label htmlFor="newUsername">Usuário</Label>
                    <Input
                      id="newUsername"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
    );
  }

  return (
    <div className="flex h-screen bg-green-50">
      {/* Navbar Lateral */}
      <nav
        className={`w-64 bg-white shadow-md fixed inset-y-0 left-0 transform ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 ease-in-out lg:relative z-40`}
      >
        <div className="p-4 bg-green-600">
          <h2 className="text-2xl font-bold text-white">Portal do Aluno</h2>
        </div>
        <ul className="space-y-2 p-4">
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start text-green-700 hover:bg-green-100 hover:text-green-800"
            >
              <Home className="mr-2 h-4 w-4" />
              Início
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start text-green-700 hover:bg-green-100 hover:text-green-800"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Atividades
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start text-green-700 hover:bg-green-100 hover:text-green-800"
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Notas
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start text-green-700 hover:bg-green-100 hover:text-green-800"
            >
              <Bell className="mr-2 h-4 w-4" />
              Postagens
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start text-green-700 hover:bg-green-100 hover:text-green-800"
            >
              <User className="mr-2 h-4 w-4" />
              Perfil
            </Button>
          </li>
        </ul>
        <div className="p-4 mt-auto">
          <Button
            variant="outline"
            className="w-full border-green-600 text-green-600 hover:bg-green-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </nav>

      {/* Overlay para fechar o menu em telas móveis */}
      {isNavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsNavOpen(false)}
        ></div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8 bg-transparent overflow-auto lg:ml-64">
        <h1 className="text-3xl font-bold mb-6 text-green-800">
          Bem-vindo, {name || username}!
          {/* Botão de Toggle para Navbar em Mobile */}
          <Button
            variant="outline"
            size="icon"
            className={`fixed top-0.5 text-black bg-green-800 left-0.5 rounded-full z-50 lg:hidden ${
              isNavOpen ? "hidden" : ""
            }`}
            onClick={toggleNav}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only ">Toggle navigation menu</span>
          </Button>
        </h1>

        <Tabs defaultValue="atividades" className="space-y-4">
          <TabsList className="bg-green-100">
            <TabsTrigger
              value="atividades"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Atividades
            </TabsTrigger>
            <TabsTrigger
              value="notas"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Notas
            </TabsTrigger>
            <TabsTrigger
              value="postagens"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Postagens
            </TabsTrigger>
          </TabsList>
          <TabsContent value="atividades">
            <Card>
              <CardHeader className="bg-green-600 text-white rounded-t-lg">
                <CardTitle>Atividades Propostas</CardTitle>
                <CardDescription className="text-green-100">
                  Atividades atribuídas pelos professores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[
                    "Matemática: Exercícios de Álgebra",
                    "História: Trabalho sobre a Revolução Francesa",
                    "Biologia: Relatório de Experimento",
                  ].map((atividade, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-green-600" />
                      <span>{atividade}</span>
                      <Button
                        size="sm"
                        className="ml-auto bg-green-600 hover:bg-green-700"
                      >
                        Ver Detalhes
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notas">
            <Card>
              <CardHeader className="bg-green-600 text-white rounded-t-lg">
                <CardTitle>Notas</CardTitle>
                <CardDescription className="text-green-100">
                  Suas notas mais recentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[
                    { disciplina: "Matemática", nota: 8.5 },
                    { disciplina: "História", nota: 9.0 },
                    { disciplina: "Biologia", nota: 7.5 },
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-5 w-5 text-green-600" />
                        <span>{item.disciplina}</span>
                      </div>
                      <span className="font-semibold text-green-700">
                        {item.nota.toFixed(1)}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="postagens">
            <Card>
              <CardHeader className="bg-green-600 text-white rounded-t-lg">
                <CardTitle>Novas Postagens</CardTitle>
                <CardDescription className="text-green-100">
                  Atualizações e anúncios recentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[
                    {
                      titulo: "Calendário de Provas Atualizado",
                      data: "2023-06-15",
                    },
                    {
                      titulo: "Feira de Ciências: Inscrições Abertas",
                      data: "2023-06-10",
                    },
                    {
                      titulo: "Palestra sobre Orientação Profissional",
                      data: "2023-06-05",
                    },
                  ].map((post, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Bell className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">
                          {post.titulo}
                        </p>
                        <p className="text-sm text-green-600">{post.data}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
