import { Link } from "react-router";
import imagemBlocos from "../assets/blocos.webp";
import imagemSalas from "../assets/salas.png";

const pagina = [
    {
        to: "/blocos",
        titulo: "Blocos",
        descricao: "Cadastre e gerencie os prédios e alas da faculdade.",
        imagem: imagemBlocos,
    },
    {
        to: "/salas",
        titulo: "Salas",
        descricao: "Salas de aula, laboratórios e auditórios de cada bloco.",
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
            <section className="bg-white px-6 py-10 text-primary">
                <h1 className="text-3xl font-bold">Reserva de Salas</h1>
                <p className="mt-3 max-w-2xl text-gray-800">
                    Organize o uso de salas, laboratórios e auditórios da
                    faculdade, sem horários duplicados e sem espaços ociosos.
                </p>
            </section>

            <section>
                <h2 className="mb-4 text-xl font-semibold text-white">Acesso rápido</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    {pagina.map((p) => (
                        <Link
                            key={p.to}
                            to={p.to}
                            style={{ backgroundImage: `url(${p.imagem})` }}
                            className="group relative flex min-h-48 items-end overflow-hidden border border-gray-200 bg-cover bg-center transition-shadow hover:shadow-md"
                        >
                            {/* Degradê para manter o texto legível sobre a foto */}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent transition-opacity group-hover:opacity-90" />
                            <div className="relative p-5 text-white">
                                <h3 className="text-lg font-semibold">
                                    {p.titulo}
                                </h3>
                                <p className="mt-1 text-sm text-third">
                                    {p.descricao}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="mb-4 text-xl font-semibold text-white">
                    O que o sistema faz
                </h2>
                <ul className="grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
                    {funcionalidades.map((item) => (
                        <li
                            key={item}
                            className="border border-gray-200 bg-white px-4 py-3"
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
