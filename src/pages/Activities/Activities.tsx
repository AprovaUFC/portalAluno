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
  dataDisponivel: string
}

const MotionCard = motion(Card)

export default function Activities() {
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<Atividade | null>(null)
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [IsLoading, setIsLoading] = useState(true)
  const [alunoId, setAlunoId] = useState<number | null>()

  const fetchAlunoLogado = async () => {
    const { data: sessionData, error } = await supabase.auth.getSession()

    if (error || !sessionData.session) {
      console.error("Erro ao obter sessão ou usuário não está logado: ", error)
      return
    }

    const user = sessionData.session.user
    const userEmail = user?.email
    
    if (!userEmail) {
      console.error("Email do usuário não encontrado.")
      return
    }

    const { data: alunoData, error: alunoError } = await supabase
      .from('Aluno')
      .select('id')
      .eq('email', userEmail)
      .single()

    if (alunoError || !alunoData) {
      console.error("Erro ao buscar aluno pelo email: ", alunoError)
      return
    }

    setAlunoId(alunoData.id)
  }

  useEffect(() => {
    fetchAlunoLogado()
  }, [])

  useEffect(() => {
    if (!alunoId) return

    const fetchAtividades = async () => {
      setIsLoading(true)
      try {
        // Buscar todas as atividades
        const { data: atividadesData, error: atividadesError } = await supabase
          .from('Atividade')
          .select('*')

        if (atividadesError) {
          console.error('Erro ao buscar atividades:', atividadesError)
          return
        }

        // Buscar todas as notas do aluno logado
        const { data: notasData, error: notasError } = await supabase
          .from('Nota')
          .select('atividade_id')
          .eq('aluno_id', alunoId)

        if (notasError) {
          console.error('Erro ao buscar notas:', notasError)
          return
        }

        const atividadesEnviadasIds = notasData?.map(nota => nota.atividade_id) || []

        // Filtrar atividades que não têm registros na tabela Nota
        const atividadesFiltradas = atividadesData.filter((atividade: Atividade) => {
          const [diaDisponivel, mesDisponivel, anoDisponivel] = atividade.dataDisponivel.split('/')
          const [dia, mes, ano] = atividade.dataLimite.split('/')
          const dataDisponivel = new Date(`${anoDisponivel}-${mesDisponivel}-${diaDisponivel}`)
          const dataLimite = new Date(`${ano}-${mes}-${dia}`)
          const dataAtual = new Date()

          // Verifica se a atividade já foi enviada e se o prazo ainda não expirou
          return (
            !atividadesEnviadasIds.includes(atividade.id) &&
            dataAtual >= dataDisponivel &&
            dataAtual <= dataLimite
          )
        })

        setAtividades(atividadesFiltradas)
      } catch (err) {
        console.error('Erro inesperado:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAtividades()

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [alunoId, isDialogOpen])

  const handleEnviarResposta = async () => {
    if (!arquivo || !atividadeSelecionada || !alunoId) {
      alert('Nenhum arquivo, atividade selecionada ou aluno logado.')
      return
    }

    try {
      setIsLoading(true)

      const fileExt = arquivo.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `arquivos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('respostas_atividades')
        .upload(filePath, arquivo)

      if (uploadError) {
        console.error('Erro ao enviar arquivo:', uploadError.message)
        return
      }

      const { data: publicURL } = supabase.storage.from('respostas_atividades').getPublicUrl(filePath)
      if (!publicURL) {
        console.error('Erro ao obter URL do arquivo.')
        return
      }

      // Atualizar o registro da atividade com o URL do arquivo
      const { error: atividadeError } = await supabase
        .from('Atividade')
        .update({ arquivo: publicURL.publicUrl }) // Atualiza a coluna 'arquivo' com o URL do arquivo
        .eq('id', atividadeSelecionada.id)

      if (atividadeError) {
        console.error('Erro ao atualizar a tabela Atividade:', atividadeError.message)
        return
      }

      // Inserir o registro na tabela Nota
      const { error: notaError } = await supabase
        .from('Nota')
        .insert({
          aluno_id: alunoId,
          atividade_id: atividadeSelecionada.id,
          nota: null,
          dataEntrega: new Date().toISOString()
        })

      if (notaError) {
        console.error('Erro ao inserir na tabela Nota:', notaError.message)
        return
      }


      // Remover a atividade do estado atividades
      setAtividades((prevAtividades) =>
        prevAtividades.filter((atividade) => atividade.id !== atividadeSelecionada.id)
      )

      setIsDialogOpen(false)
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
          {atividades.map((atividade, index) => (
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
                    <Loading />
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
