import Loading from 'components/Loading/Loading'
import { Button } from 'components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card'
import { Bell, CheckCircle, XCircle } from 'lucide-react'

interface ApprovalStatusProps{
    approvalStatus: string,
    setShowApprovalStatus: (value: boolean) => void,
    isLoading: boolean
}

const ApprovalStatus = (props: ApprovalStatusProps) => {
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
          {props.approvalStatus === "PENDENTE" && (
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
          {props.approvalStatus === "APROVADO" && (
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
          {props.approvalStatus === "LISTA DE ESPERA" && (
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
            onClick={() => props.setShowApprovalStatus(false)}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Voltar para Login
          </Button>
        </div>
      </CardContent>
    
    </Card>
    {props.isLoading && (<Loading/>)}
  </div>
  )
}

export default ApprovalStatus