import { NavLink } from "react-router";

function linkClass({ isActive }: { isActive: boolean }) {
    return isActive
        ? "underline underline-offset-4"
        : "opacity-70 hover:opacity-100 transition-opacity";
}

export function Header() {
    return (
        <header>
            <NavLink to="/" className={linkClass}></NavLink>
            <NavLink to="/" className={linkClass}></NavLink>
            <NavLink to="/" className={linkClass}></NavLink>
            <NavLink to="/" className={linkClass}></NavLink>
        </header>
    );
}
