"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Clock, Calendar, Upload } from "lucide-react"
import NavBarComponent from "components/NavBar/NavBarComponent"
import { supabase } from "@/lib/supabase"
import Loading from "components/Loading/Loading"

type Atividade = {
  id: number
  titulo: string
  descricao: string
  dataEntrega: string
  status: "PENDENTE" | "ENTREGUE" | "AVALIADO"
  dataLimite: string
}


const MotionCard = motion(Card)

export default function Activities() {
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<Atividade | null>(null)
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [IsLoading,setIsLoading] = useState(true)

  useEffect(() => {
    // Gerencia o overflow da página baseado no estado do diálogo
    if (isDialogOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Função para buscar as atividades do Supabase
    const fetchAtividades = async () => {
      try {
        const { data, error } = await supabase
          .from('Atividade')
          .select('*')

        if (error) {
          console.error('Erro ao buscar atividades:', error)
        } else {
          setAtividades(data ) // Armazena as atividades no estado
        }
      } catch (err) {
        console.error('Erro inesperado:', err)
      }finally{
        setIsLoading(false)
      }
    }

    // Chama a função para buscar as atividades
    fetchAtividades()

    // Cleanup para quando o componente for desmontado
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isDialogOpen])

  const handleEnviarResposta = async () => {
    if (!arquivo || !atividadeSelecionada) {
      console.error('Nenhum arquivo ou atividade selecionada.')
      return
    }

    try {
      setIsLoading(true)

      // Gerar nome único para o arquivo
      const fileExt = arquivo.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `arquivos/${fileName}`
      console.log(filePath)
      // Upload do arquivo para o bucket no Supabase
      const { error: uploadError } = await supabase.storage
        .from('respostas_atividades') // Certifique-se de que este seja o nome do bucket
        .upload(filePath, arquivo)

      if (uploadError) {
        console.error('Erro ao enviar arquivo:', uploadError.message)
        return
      }

      // Obter URL público do arquivo enviado
      const { data: publicURL } = supabase.storage.from('respostas_atividades').getPublicUrl(filePath)
      if (!publicURL) {
        console.error('Erro ao obter URL do arquivo.')
        return
      }

      // Inserir atividade na tabela com o URL do arquivo
      const { data: atividadeData, error: atividadeError } = await supabase
        .from('Atividade') // Certifique-se de que o nome da tabela está correto
        .update({ 
          arquivo: publicURL,
          status: 'ENTREGUE'
        }) // Atualiza a atividade selecionada com o URL do arquivo
        .eq('id', atividadeSelecionada.id) // Define qual atividade está sendo atualizada

      if (atividadeError) {
        console.error('Erro ao atualizar a atividade:', atividadeError.message)
        return
      }

      console.log('Atividade atualizada com sucesso:', atividadeData)
      setIsDialogOpen(false) // Fecha o diálogo após o sucesso
    } catch (err) {
      console.error('Erro inesperado:', err)
    } finally {
      setIsLoading(false)
      
    }
  }

  return (
    <div className="flex h-screen bg-green-50">
      <NavBarComponent />

      <div className="container mx-auto p-4 relative max-xl:pl-14 rounded-xl w-screen flex-1 h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
        <motion.h1 
          className="text-3xl font-bold mb-6 text-green-800 "
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Atividades
        </motion.h1>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {atividades.map((atividade,index) => (
            <MotionCard 
              key={index} 
              className="flex flex-col"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <CardHeader className="bg-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2" />
                  {atividade.titulo}
                </CardTitle>
                
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="mb-2">{atividade.descricao}</p>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Clock className="mr-1" size={16} />
                  <span>Entrega: {atividade.dataLimite}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="mr-1" size={16} />
                  <span>Status: {atividade.status}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setAtividadeSelecionada(atividade)
                    setIsDialogOpen(true)
                  }}
                >
                  Ver Detalhes
                </Button>
              </CardFooter>
            </MotionCard>
          ))}
        </motion.div>

        <AnimatePresence>
          {isDialogOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{
                backdropFilter: "blur(5px)",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
              }}
              onClick={() => setIsDialogOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                {IsLoading && (
                  <Loading/>
                )}
                  <h2 className="text-2xl font-bold mb-4">{atividadeSelecionada?.titulo}</h2>
                  <p className="text-gray-600 mb-4">{atividadeSelecionada?.descricao}</p>
                  <div className="grid gap-4 py-4">
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="mr-1" size={16} />
                      <span>Entrega: {atividadeSelecionada?.dataLimite}</span>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="arquivo">Anexar Arquivo </Label>
                      <Input
                        id="arquivo"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setArquivo(e.target.files ? e.target.files[0] : null)}
                      />
                      {arquivo && (
                        <p className="text-sm text-gray-500 mt-2">
                          Arquivo selecionado: {arquivo.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="mr-2">
                      Cancelar
                    </Button>
                    <Button onClick={handleEnviarResposta} className="bg-green-600 hover:bg-green-700">
                      <Upload className="mr-2 h-4 w-4" />
                      Enviar Resposta
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
