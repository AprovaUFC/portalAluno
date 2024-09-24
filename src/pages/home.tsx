"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  BookOpen,
  GraduationCap,
  Bell,
} from "lucide-react";

import NavBarComponent from "components/NavBar/NavBarComponent";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Loading from "components/Loading/Loading";


export default function HomePage() {
  
  const [loading,setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      // Primeiro, obtenha o usuário logado
      try{
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error('Erro ao obter usuário logado:', userError);
        return;
      }

      if (user) {
        const userEmail = user.email; // Obtenha o email do usuário autenticado

        // Agora, faça a requisição para obter o nome baseado no email
        const { data, error } = await supabase
          .from('Aluno') // Supondo que a tabela se chama 'users'
          .select('name') // Seleciona apenas o campo 'name'
          .eq('email', userEmail); // Filtra pelo email do usuário logado

        if (error) {
          console.error('Erro ao buscar o nome do usuário:', error);
        } else if (data && data.length > 0) {
          setUserName(data[0].name); // Supondo que 'name' é o campo que contém o nome
        } else {
          console.log('Usuário não encontrado.');
        }
      }
      }catch(error){
        console.error("Erro durante o fetch:", error);
      }finally{
        setIsLoading(false)
      }
    };
    fetchData(); // Chamando a função assíncrona
    
  }, []);





  
  return (
    <div className="flex h-screen bg-green-50">
      {loading &&(
        <div>
          <Loading/>
        </div>
      )}
      {/* Navbar Lateral */}
      
      <NavBarComponent/>

      {/* Overlay para fechar o menu em telas móveis */}


      {/* Conteúdo Principal */}
      <main className="flex-1 p-8 bg-transparent overflow-auto mt-10 mr-8 ml-24">
      
        <h1 className="text-3xl font-bold mb-6 text-green-800">
           Bem-vindo, {userName}! 
          {/* Botão de Toggle para Navbar em Mobile */}
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
