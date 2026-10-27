import { NavLink } from "react-router";
import logoUp from "../assets/logoUp.svg";

function linkClass({ isActive }: { isActive: boolean }) {
    return isActive
        ? "rounded-md px-3 py-2 text-primary"
        : "rounded-md px-3 py-2 text-primary hover:text-secondary transition-colors hover:underline";
}

export function Header() {
    return (
        <header className="bg-white shadow">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
                <NavLink to="/">
                    <img
                        src={logoUp}
                        alt="Universidade Positivo - Reserva de Salas"
                        className="h-10 w-auto"
                    />
                </NavLink>
                <nav className="flex flex-wrap gap-1 text-sm font-medium">
                    <NavLink to="/blocos" className={linkClass}>
                        Blocos
                    </NavLink>
                    <NavLink to="/salas" className={linkClass}>
                        Salas
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}
