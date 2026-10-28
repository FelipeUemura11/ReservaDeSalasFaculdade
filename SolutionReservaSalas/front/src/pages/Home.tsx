import { Link } from "react-router";
import imagemBlocos from "../assets/blocos.webp";
import imagemSalas from "../assets/salas.webp";

const pagina = [
    {
        to: "/blocos",
        titulo: "Blocos",
        imagem: imagemBlocos,
    },
    {
        to: "/salas",
        titulo: "Salas",
        imagem: imagemSalas,
    },
];

const funcionalidades = [
    "Prevenção automática de conflitos de horário",
    "Validação de capacidade da sala",
    "Busca de salas livres por período",
    "Agenda diária e relatório de ocupação",
];

export function Home() {
    return (
        <div className="space-y-10">
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
            >
                <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-secondary/40 blur-3xl motion-safe:animate-flutuar" />
                <div className="absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-third/15 blur-3xl motion-safe:animate-flutuar-lento" />
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
            </div>

            <section>
                <h1 className="mb-4 text-4xl font-semibold text-white">
                    Acesso rápido
                </h1>
                <div className="grid gap-4 sm:grid-cols-2">
                    {pagina.map((p) => (
                        <Link
                            key={p.to}
                            to={p.to}
                            style={{ backgroundImage: `url(${p.imagem})` }}
                            className="group relative flex min-h-48 items-start overflow-hidden border border-gray-200 bg-cover bg-center shadow-lg transition-shadow hover:shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/15 to-transparent transition-opacity group-hover:opacity-80" />
                            <h2 className="relative p-5 text-2xl font-bold text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
                                {p.titulo}
                            </h2>
                        </Link>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="mb-4 text-2xl font-semibold text-white">
                    O que o sistema faz
                </h2>
                <ul className="grid gap-4 text-sm text-gray-700 sm:grid-cols-2 shadow-lg">
                    {funcionalidades.map((item) => (
                        <li
                            key={item}
                            className="text-center shadow-[8px_8px_1px_-1px_var(--secondary)] rounded-br-[2rem] rounded-tl-[2rem] border border-gray-200 bg-white px-4 py-3"
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
