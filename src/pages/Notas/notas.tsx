import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // Importando o cliente configurado do Supabase
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import Loading from "components/Loading/Loading";
import NavBarComponent from "components/NavBar/NavBarComponent";

type Nota = {
  id: number;
  materia: string;
  nota: number;
  dataLimite: string;
};

export default function PaginaNotas() {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [notasFiltered, setNotasFiltered] = useState<Nota[]>([]);
  const [busca, setBusca] = useState("");
  const [alunoId, setAlunoId] = useState<number | null>(null); // Aluno logado
  const [isLoading, setIsLoading] = useState(true);
  // Função para buscar o aluno logado
  const fetchAlunoLogado = async () => {
    const { data: sessionData, error } = await supabase.auth.getSession();

    if (error || !sessionData.session) {
      console.error("Erro ao obter sessão ou usuário não está logado: ", error);
      return;
    }

    const user = sessionData.session.user;
    const userEmail = user?.email;

    if (!userEmail) {
      console.error("Email do usuário não encontrado.");
      return;
    }

    // Buscar o ID do aluno baseado no email do usuário logado
    const { data: alunoData, error: alunoError } = await supabase
      .from('Aluno')
      .select('id')
      .eq('email', userEmail)
      .single(); // Usando single porque queremos apenas um resultado

    if (alunoError || !alunoData) {
      console.error("Erro ao buscar aluno pelo email: ", alunoError);
      return;
    }

    setAlunoId(alunoData.id); // Definindo o alunoId
  };

  // Função para buscar as notas do Supabase


  useEffect(() => {
    fetchAlunoLogado(); // Busca o aluno logado ao carregar o componente
  }, []);

  useEffect(() => {
    const fetchNotas = async () => {
      setIsLoading(true); // Ativando o loading no início da busca
  
      if (!alunoId) return;
  
      const { data, error } = await supabase
        .from('Nota')
        .select(`
          id, 
          nota, 
          dataEntrega, 
          Atividade: atividade_id (titulo)
        `); // Buscando a atividade e o título relacionado

          
      if (error) {
        console.error("Erro ao buscar as notas: ", error);
      } else {
        // Mapeia os dados da API para o formato que será usado no componente
        const notasMapeadas: Nota[] = (data).map((nota:any) => ({
          id: nota.id,
          materia: nota.Atividade.titulo, // Acessa o primeiro item do array
          nota: nota.nota,
          dataLimite: nota.dataEntrega,
        }));
        
        
        setNotas(notasMapeadas || []);
        setNotasFiltered(notasMapeadas || []); // Inicializando o filtro com todas as notas
      }
      
      setIsLoading(false); // Desativando o loading após carregar as notas
    };

    
    if (alunoId) {
      fetchNotas(); // Busca as notas após obter o aluno logado
    }
  }, [alunoId]);

  // Atualiza a lista filtrada com base no campo de busca
  useEffect(() => {
    const notasFiltradas = notas.filter((nota) =>
      nota.materia.toLowerCase().includes(busca.toLowerCase())
    );
    setNotasFiltered(notasFiltradas);
  }, [busca, notas]);

  return (
    <div className="flex min-h-screen  ">
    <NavBarComponent/>
    <motion.div 
      className="p-8  rounded-xl w-screen flex-1 h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8  "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-4xl  font-bold mb-6 text-center text-green-800"
      >
        Notas do Aluno
      </motion.h1>
      <Card className="w-full rounded-xl shadow-lg">
        <CardHeader className="bg-green-600 rounded-xl">
          <CardTitle className="text-2xl rounded-xl text-white">Boletim de Notas</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoading ? (
            <Loading /> // Mostra o componente de loading enquanto carrega
          ) : (
            <>
              <motion.div 
                className="mb-4  relative"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por matéria..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10 border-green-300 focus:border-green-500 focus:ring-green-500"
                />
              </motion.div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-green-700">Matéria</TableHead>
                      <TableHead className="text-green-700">Nota</TableHead>
                      <TableHead className="text-green-700">Data Entrega</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {notasFiltered.map((nota) => (
                        <motion.tr
                          key={nota.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TableCell className="font-medium">{nota.materia}</TableCell>
                          <TableCell>
                            <span className={`font-semibold ${nota.nota >= 7 ? 'text-green-600' : 'text-red-600'}`}>
                              {nota.nota.toFixed(1)}
                            </span>
                          </TableCell>
                          <TableCell>{nota.dataLimite}</TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
    </div>
  );
}
