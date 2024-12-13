"use client"

import { Checkbox } from "@/components/ui/checkbox"

interface CheckboxProps {
    isChecked: boolean;
    handleCheckboxChange: (checked: boolean) => void; // Corrigido o tipo
  }

export function CheckboxText(props: CheckboxProps) {
  return (
    <div className="items-top flex space-x-2">
      <Checkbox id="terms1" required checked={props.isChecked} onCheckedChange={props.handleCheckboxChange}/>
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms1"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Li e aceito os termos e condições
        </label>
        <p className="text-sm text-muted-foreground">
          <a href="https://zdfhrqkkdxrrwxgmkjia.supabase.co/storage/v1/object/public/termo/Termo_de_uso.pdf" target="_blank">
         Clique aqui para ler o termo
         </a>
        </p>
      </div>
    </div>
  );
}
