"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"
import NavBarComponent from "components/NavBar/NavBarComponent"
import { supabase } from "@/lib/supabase"

type Aula = {
  id: string
  dia: string
  horario: string
  disciplina: string
  Professor: string
  sala: string
  unidade: string
}

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]
const horarios = ["18:00", "19:00", "20:00", "21:00"]

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
}

// Simula uma chamada à API para obter os horários


export default function PageHorarios() {
  const [aulas, setAulas] = useState<Aula[]>([])
  const [isLoading, setIsLoading] = useState(true)



useEffect(()=>{
    const fetchHorarios = async () => {
      const {data:aulas,error:aulasError} = await supabase.from('Horario').select('dia,horario,sala,disciplina,id,Professor,unidade')
      if(aulasError){
          console.error('Erro ao buscar horarios',aulasError)
          return
      }
      setAulas(aulas)
      setIsLoading(false)
    }
  fetchHorarios()
},[])

  const renderGradeHorarios = () => (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="grid grid-cols-6 gap-4 mb-4">
          <div className="font-bold">Horário</div>
          {diasSemana.map(dia => (
            <div key={dia} className="font-bold">{dia}</div>
          ))}
        </div>
        {horarios.map(horario => (
          <div key={horario} className="grid grid-cols-6 gap-4 mb-2">
            <div className="flex items-center">{horario}</div>
            {diasSemana.map(dia => {
              const aulaAtual = aulas.find(a => a.dia === dia && a.horario === horario)
              return (
                <div key={`${dia}-${horario}`} className="relative">
                  {aulaAtual ? (
                    <div className="bg-green-100 p-2 rounded text-sm">
                      <p className="font-bold">{aulaAtual.disciplina}</p>
                      <p>Professor {aulaAtual.Professor}</p>
                      <p>Sala {aulaAtual.sala} Unidade {aulaAtual.unidade}</p>
                    </div>
                  ) : (
                    <div className="p-2 rounded text-sm text-gray-400">-</div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )

  const renderAcordeaoHorarios = () => (
    <Accordion type="single" collapsible className="w-full">
      {diasSemana.map(dia => (
        <AccordionItem key={dia} value={dia}>
          <AccordionTrigger>{dia}</AccordionTrigger>
          <AccordionContent>
            {horarios.map(horario => {
              const aulaAtual = aulas.find(a => a.dia === dia && a.horario === horario)
              return (
                <div key={`${dia}-${horario}`} className="mb-2 p-2 border rounded">
                  <div className="font-bold">{horario}</div>
                  {aulaAtual ? (
                    <div className="bg-green-100 p-2 rounded text-sm mt-1">
                      <p className="font-bold">{aulaAtual.disciplina}</p>
                      <p>Professor {aulaAtual.Professor}</p>
                      <p>Sala {aulaAtual.sala}</p>
                    </div>
                  ) : (
                    <div className="p-2 rounded text-sm text-gray-400">Sem aula</div>
                  )}
                </div>
              )
            })}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )

  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <Skeleton key={index} className="h-[100px] w-full" />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen flex bg-green-50 ">
        <NavBarComponent/>
      <motion.div
        className="max-w-6xl mx-auto pt-7 w-screen max-sm:m-6"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <Card className="w-full">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-500">
            <CardTitle className="text-2xl text-white text-center">Visualização do Horário Completo</CardTitle>
            <CardDescription className="text-green-100 text-center">
              Veja o horário semanal completo
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              renderLoadingSkeleton()
            ) : (
              <>
                <div className="hidden md:block">
                  {renderGradeHorarios()}
                </div>
                <div className="md:hidden">
                  {renderAcordeaoHorarios()}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}