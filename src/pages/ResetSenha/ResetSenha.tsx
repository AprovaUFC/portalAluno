import { useState } from "react"
import { useSearchParams } from "react-router-dom" // Certifique-se de estar usando a versão correta
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { supabase } from "@/lib/supabase" // Ajuste o caminho da importação do Supabase

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
}

export default function ResetSenha() {
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState(false)
  
  const [searchParams] = useSearchParams() // O primeiro valor é o URLSearchParams
  const token = searchParams.get('token') // Usar o método get no searchParams para pegar o token da URL
  const email = searchParams.get('email') // Capturando o e-mail da URL para o processo de verificação
  console.log(token)
  console.log(email)
  const validarSenha = (senha: string) => {
    return senha.length >= 6
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    setSucesso(false)

    if (!validarSenha(novaSenha)) {
      setErro("A senha deve ter pelo menos 6 caracteres.")
      return
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.")
      return
    }

    // Verifica se o token e o e-mail estão presentes
    if (!token || !email) {
      setErro("Token de redefinição ou e-mail não encontrado.")
      return
    }

    // Verificando o token de recuperação
    const { error: verifyError } = await supabase.auth.verifyOtp({
      type: 'recovery', // Tipo de OTP para redefinição de senha
      token: token, // Token obtido da URL
      email: email // E-mail do usuário
    })


    if (verifyError) {
      setErro("Houve um erro ao validar o token. Por favor, tente novamente.")
      console.error(verifyError)
      return
    }

    // Atualizando a senha do usuário no Supabase
    const { error: updateError } = await supabase.auth.updateUser({
      password: novaSenha
    })

    if (updateError) {
      setErro("Houve um erro ao redefinir sua senha. Por favor, tente novamente.")
      console.error(updateError)
    } else {
      setSucesso(true)
      toast.success("Senha redefinida com sucesso!")
      setNovaSenha("")
      setConfirmarSenha("")
    }
  }

  return (
    <div className="min-h-screen bg-green-50 rounded-sm shadow-black shadow-2xl p-4 flex items-center justify-center">
      <motion.div
        className="w-full max-w-md"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-500">
            <CardTitle className="text-2xl text-white text-center">Redefinir Senha</CardTitle>
            <CardDescription className="text-green-100 text-center">
              Crie uma nova senha para sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="novaSenha">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="novaSenha"
                    type={mostrarSenha ? "text" : "password"}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    required
                    className="pr-10"
                    placeholder="Mínimo de 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                <Input
                  id="confirmarSenha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  placeholder="Digite a senha novamente"
                />
              </div>
              {erro && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{erro}</AlertDescription>
                </Alert>
              )}
              {sucesso && (
                <Alert variant="default" className="bg-green-100 text-green-800 border-green-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Sucesso</AlertTitle>
                  <AlertDescription>Sua senha foi redefinida com sucesso.</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Redefinir Senha
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  )
}
