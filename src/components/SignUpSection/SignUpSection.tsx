import { CheckboxText } from "components/Checkbox/CheckboxText"
import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { Eye, EyeOff, FileText, X } from "lucide-react"
import { useState } from "react"

type Arquivo = {
    nome: string
    tipo: "imagem" | "documento"
    url: string
    arquivo: File
  }

interface SignUpSectionProps{
    name: string
    setName: (value: string) => void,
    email: string,
    setEmail: (value:string) => void,
    password: string,
    setPassword: (value:string) => void,
    fileInputRef: React.RefObject<HTMLInputElement>,
    handleFileChange: (value: React.ChangeEvent<HTMLInputElement>) => void,
    arquivos: Arquivo[],
    removerArquivo: (value:number) => void,
    isChecked: boolean,
    handleCheckboxChange: (value:boolean) => void
}


const SignUpSection = (props: SignUpSectionProps) => {
  const [showPassword, setShowPassword] = useState(false);


  return (
    <>
    <div className="space-y-2">
      <Label htmlFor="name">Nome Completo</Label>
      <Input
        id="name"
        type="text"
        value={props.name}
        onChange={(e) => props.setName(e.target.value)}
        required
        className="border-green-300 focus:border-green-500 focus:ring-green-500"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="email">E-mail</Label>
      <Input
        id="email"
        type="email"
        value={props.email}
        onChange={(e) => props.setEmail(e.target.value)}
        required
        className="border-green-300 focus:border-green-500 focus:ring-green-500"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="newPassword">Senha</Label>
      <div className="relative">
      <Input
        id="newPassword"
        type={showPassword ? "text" : "password"}
        value={props.password}
        onChange={(e) => props.setPassword(e.target.value)}
        required
        className="border-green-300 focus:border-green-500 focus:ring-green-500"
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
        >
        {showPassword ? <Eye/> : <EyeOff/>}
      </button>
      </div>
    </div>
    <div>
    <Label>Anexos/Documentos</Label>
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => props.fileInputRef.current?.click()}
          className="bg-green-100 text-green-700 hover:bg-green-200"
        >
          Adicionar Arquivo
        </Button>
        <Input
          type="file"
          ref={props.fileInputRef}
          className="hidden"
          onChange={props.handleFileChange}
          accept=".pdf"
          
        />
        
        <div>
          {props.arquivos.map((arquivo, index) => (
            <div key={index} className="flex items-center justify-between bg-white p-2 rounded-md shadow">
              {arquivo.tipo === "imagem" ? (
                <div className="relative aspect-video">
                  <img
                    src={arquivo.url}
                    alt={arquivo.nome}
                    className="rounded-md object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <FileText className="text-green-600" size={24} />
                  <span className="text-sm truncate">{arquivo.nome}</span>
                </div>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-white"
                onClick={() => props.removerArquivo(index)}
              >
                <X size={16}  />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
    <CheckboxText
      handleCheckboxChange={props.handleCheckboxChange}
      isChecked={props.isChecked}
    />
    <Button
      type="submit"
      className="w-full bg-green-600 hover:bg-green-700"
    >
      Cadastrar
    </Button>
  </>
  )
}

export default SignUpSection