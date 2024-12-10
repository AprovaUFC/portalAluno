import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from 'components/ui/dialog'


interface DialogSignUpProp{
    showModal: boolean,
    setShowModal: (value: boolean) => void,
}

const DialogSignUp = ({showModal,setShowModal}: DialogSignUpProp) => {
    
  return (
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
  )
}

export default DialogSignUp