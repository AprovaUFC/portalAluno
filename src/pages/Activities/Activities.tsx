"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, Clock, Calendar, Upload } from "lucide-react"
import NavBarComponent from "components/NavBar/NavBarComponent"

type Atividade = {
  id: number
  titulo: string
  disciplina: string
  descricao: string
  dataEntrega: string
  status: "pendente" | "entregue" | "avaliado"
}

const atividadesIniciais: Atividade[] = [
  { id: 1, titulo: "Resolução de Equações", disciplina: "Matemática", descricao: "Resolver as equações da página 42 do livro.", dataEntrega: "2023-06-30", status: "pendente" },
  { id: 2, titulo: "Redação sobre Meio Ambiente", disciplina: "Português", descricao: "Escrever uma redação de 30 linhas sobre a importância da preservação ambiental.", dataEntrega: "2023-07-05", status: "pendente" },
  { id: 3, titulo: "Experimento de Fotossíntese", disciplina: "Biologia", descricao: "Realizar o experimento de fotossíntese conforme as instruções fornecidas e elaborar um relatório.", dataEntrega: "2023-07-10", status: "pendente" },
]

const MotionCard = motion(Card)

export default function Activities() {
  const [atividades, setAtividades] = useState<Atividade[]>(atividadesIniciais)
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<Atividade | null>(null)
  const [resposta, setResposta] = useState("")
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (isDialogOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isDialogOpen])

  const handleEnviarResposta = () => {
    if (atividadeSelecionada) {
      setAtividades(atividades.map(atividade => 
        atividade.id === atividadeSelecionada.id 
          ? { ...atividade, status: "entregue" as const } 
          : atividade
      ))
      setAtividadeSelecionada(null)
      setResposta("")
      setArquivo(null)
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="flex bg-green-50">
      <NavBarComponent />
      <div className="container mx-auto p-4 relative">
        <motion.h1 
          className="text-3xl font-bold mb-6 text-green-800"
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
          {atividades.map((atividade) => (
            <MotionCard 
              key={atividade.id} 
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
                <CardDescription className="text-green-100">{atividade.disciplina}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="mb-2">{atividade.descricao}</p>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Clock className="mr-1" size={16} />
                  <span>Entrega: {atividade.dataEntrega}</span>
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
                  <h2 className="text-2xl font-bold mb-4">{atividadeSelecionada?.titulo}</h2>
                  <p className="text-gray-600 mb-4">{atividadeSelecionada?.disciplina}</p>
                  <div className="grid gap-4 py-4">
                    <p>{atividadeSelecionada?.descricao}</p>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="mr-1" size={16} />
                      <span>Entrega: {atividadeSelecionada?.dataEntrega}</span>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="resposta">Sua Resposta</Label>
                      <Textarea
                        id="resposta"
                        value={resposta}
                        onChange={(e) => setResposta(e.target.value)}
                        placeholder="Digite sua resposta aqui..."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="arquivo">Anexar Arquivo (opcional)</Label>
                      <Input
                        id="arquivo"
                        type="file"
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
