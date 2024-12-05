import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { Link } from 'react-router-dom'

interface LoginSectionProps{
    email: string,
    setEmail: (value: string) => void,
    password: string,
    setPassword: (value: string) => void,
    loginError: string,
    registerError: string,
    setForgotPasswordModal: (value: boolean) => void
}

const LoginSection = (props: LoginSectionProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="Email">Email</Label>
        <Input
          id="username"
          type="email"
          value={props.email}
          onChange={(e) => props.setEmail(e.target.value)}
          required
          className="border-green-300 focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          value={props.password}
          onChange={(e) => props.setPassword(e.target.value)}
          required
          className="border-green-300 focus:border-green-500 focus:ring-green-500"
        />
      </div>
      {/* Exibe a mensagem de erro se houver */}
      {props.loginError && (
        <p className="text-red-500 text-sm">{props.loginError}</p>
      )}
      {props.registerError && (
        <p className="text-red-500 text-sm">{props.registerError}</p>
      )}
      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700"
      >
        <Link to={"/avisos"}>Entrar</Link>
      </Button>
      </>
  
  )
}

export default LoginSection