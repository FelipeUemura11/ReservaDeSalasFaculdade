import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";
import logo from "../assets/logo-azul.svg";

const links = [
    { to: "/blocos", texto: "Blocos" },
    { to: "/salas", texto: "Salas" },
    { to: "/reservas", texto: "Reservas" },
    { to: "/salas-livres", texto: "Salas livres" },
    { to: "/agenda", texto: "Agenda" },
    { to: "/relatorios", texto: "Relatório" },
];

function linkClass({ isActive }: { isActive: boolean }) {
    return isActive
        ? "rounded-md px-3 py-2 text-primary font-semibold lg:font-medium"
        : "rounded-md px-3 py-2 text-primary hover:text-secondary transition-colors";
}

export function Header() {
    const [menuAberto, setMenuAberto] = useState(false);
    const { pathname } = useLocation();

    // Fecha o menu do celular ao trocar de página
    useEffect(() => {
        setMenuAberto(false);
    }, [pathname]);

    return (
        <header className="mt-4 w-[92%] rounded-br-[3rem] bg-white shadow-[12px_12px_1px_-1px_var(--secondary)] sm:w-[85%]">
            <div className="flex items-center justify-between gap-2 px-[4%] py-3">
                <NavLink to="/">
                    <img
                        src={logo}
                        alt="Universidade Positivo - Reserva de Salas"
                        className="h-10 w-auto sm:h-14"
                    />
                </NavLink>

                {/* Menu completo em telas grandes */}
                <nav className="hidden flex-wrap gap-1 text-md font-medium lg:flex">
                    {links.map((l) => (
                        <NavLink key={l.to} to={l.to} className={linkClass}>
                            {l.texto}
                        </NavLink>
                    ))}
                </nav>

                {/* Botão do menu em celulares e tablets */}
                <button
                    type="button"
                    onClick={() => setMenuAberto((aberto) => !aberto)}
                    aria-expanded={menuAberto}
                    aria-controls="menu-mobile"
                    aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
                    className="mr-2 rounded-full p-2 text-primary hover:bg-third lg:hidden"
                >
                    <svg
                        viewBox="0 0 24 24"
                        className="h-7 w-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        aria-hidden
                    >
                        {menuAberto ? (
                            <path d="M6 6l12 12M18 6L6 18" />
                        ) : (
                            <path d="M4 7h16M4 12h16M4 17h16" />
                        )}
                    </svg>
                </button>
            </div>

            {menuAberto && (
                <nav
                    id="menu-mobile"
                    className="grid gap-1 border-t border-third px-[4%] pb-6 pt-2 text-md font-medium sm:grid-cols-2 lg:hidden"
                >
                    {links.map((l) => (
                        <NavLink key={l.to} to={l.to} className={linkClass}>
                            {l.texto}
                        </NavLink>
                    ))}
                </nav>
            )}
        </header>
    );
}
