import { supabase } from "@/lib/supabase";
import { Button } from "components/ui/button";
import {
  Bell,
  BookOpen,
  Clock,
  GraduationCap,
  LogOut,
  Menu,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBarComponent = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erro ao realizar logout:", error);
    } else {
      // Redirecionar ou atualizar o estado da aplicação conforme necessário
      navigate("/");
    }
  };

  return (
    <>
      <nav
        className={`w-64 h-screen bg-white shadow-md fixed inset-y-0 left-0 transform ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 ease-in-out lg:relative z-40`}
      >
        <div className="p-4 flex bg-green-600">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-16 h-16 rounded-3xl mr-2 bg-transparent border-transparent  mb-2"
          />

          <h2 className="text-2xl font-bold text-white">Aprova UFC Alunos</h2>
        </div>
        <ul className="space-y-2 p-4">
          <li>
            <Link to={"/avisos"}>
              <Button
                variant="ghost"
                className="w-full justify-start text-green-700 hover:bg-green-100 hover:text-green-800"
              >
                <Bell className="mr-2 h-4 w-4" />
                Avisos
              </Button>
            </Link>
          </li>
          <li>
            <Link to={"/atividades"}>
              <Button
                variant="ghost"
                className="w-full justify-start text-green-700 hover:bg-green-100 hover:text-green-800"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Atividades
              </Button>
            </Link>
          </li>
          <li>
            <Link to={"/nota"}>
              <Button
                variant="ghost"
                className="w-full justify-start text-green-700 hover:bg-green-100 hover:text-green-800"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Notas
              </Button>
            </Link>
          </li>
          <li>
            <Link to={'/horarios'}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-green-700 hover:bg-green-100 hover:text-green-800"
                >
                  <Clock className="mr-2 h-4 w-4"/>
                  Horários
                </Button>
            </Link>
          </li>

          <li>
            <Link to={"/perfil"}>
              <Button
                variant="ghost"
                className="w-full justify-start text-green-700 hover:bg-green-100 hover:text-green-800"
              >
                <User className="mr-2 h-4 w-4" />
                Perfil
              </Button>
            </Link>
          </li>
        </ul>
        <div className="p-4 mt-auto">
          <Button
            variant="outline"
            className="w-full border-green-600 text-green-600 hover:bg-green-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </nav>
      {isNavOpen && (
        <div
          className=" fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsNavOpen(false)}
        ></div>
      )}
      <Button
        variant="outline"
        size="icon"
        className={` fixed top-2 text-black bg-green-600 left-1 rounded-sm z-50 lg:hidden ${
          isNavOpen ? "hidden" : ""
        }`}
        onClick={toggleNav}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only ">Toggle navigation menu</span>
      </Button>
    </>
  );
};

export default NavBarComponent;
