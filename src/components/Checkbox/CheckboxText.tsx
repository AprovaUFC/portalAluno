"use client"

import { Checkbox } from "@/components/ui/checkbox"

interface CheckboxProps {
    isChecked: boolean;
    handleCheckboxChange: (checked: boolean) => void; // Corrigido o tipo
  }

export function CheckboxText(props: CheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" checked={props.isChecked} onCheckedChange={props.handleCheckboxChange} required/>
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        <a
          href="https://zdfhrqkkdxrrwxgmkjia.supabase.co/storage/v1/object/public/termo/Termo_de_uso.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Li e aceito os termos e condições
        </a>
      </label>
    </div>
  );
}
