import { supabase } from '@/lib/supabase'
import Loading from 'components/Loading/Loading'
import { Button } from 'components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from 'components/ui/dialog'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { useState } from 'react'

interface DialogForgotPasswordProps{
    isLoading: boolean,
    setIsLoading: (value:boolean) => void,
    email: string,
    setEmail: (value: string) => void
    forgotPasswordModal: boolean,
    setForgotPasswordModal: (value: boolean) => void
}

const DialogForgotPassword = (props: DialogForgotPasswordProps) => {
    const [resetMessage, setResetMessage] = useState('');

    const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    
        e.preventDefault();
        setResetMessage('');
        props.setIsLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(props.email);
        if (error) {
          setResetMessage('Erro ao tentar recuperar senha. Verifique o email inserido.');
        } else {
          setResetMessage('Um email de recuperação foi enviado. Por favor, verifique sua caixa de entrada.');
        }
    
        props.setIsLoading(false)
      };

  return (
    <Dialog open={props.forgotPasswordModal} onOpenChange={props.setForgotPasswordModal}>
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
            value={props.email}
            onChange={(e) => props.setEmail(e.target.value)}
            required
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Enviar Email de Recuperação</Button>
      </form>
      {resetMessage && (
        <p className="mt-4 text-green-500 text-sm">{resetMessage}</p>
      )} {props.isLoading && (<Loading/>)}
    </DialogContent>
  </Dialog>
  )
}

export default DialogForgotPassword