import { Bloco } from "../../types/Bloco";
import { Sala } from "../../types/Sala";

interface MapaBlocoProps {
    bloco: Bloco;
    salas: Sala[];
    onEditar: () => void;
    onExcluir: () => void;
}

// Contorno em "H" do prédio visto de cima, traçado a partir da imagem do mapa
const CONTORNO_PREDIO =
    "60,126 742,119 742,208 772,208 773,321 483,323 485,496 747,494 747,523 783,523 " +
    "784,605 750,605 750,693 67,701 66,616 12,616 12,520 50,520 50,497 312,494 " +
    "310,322 5,324 5,226 60,226";

// Quantas salas listar no tooltip antes de resumir em "+N"
const MAX_SALAS_TOOLTIP = 6;

// Bloco desenhado como no mapa: prédio em "H" com as entradas em cinza
export function MapaBloco({ bloco, salas, onEditar, onExcluir }: MapaBlocoProps) {
    const salasVisiveis = salas.slice(0, MAX_SALAS_TOOLTIP);
    const salasRestantes = salas.length - salasVisiveis.length;

    return (
        <div className="flex flex-col items-center gap-3 rounded-lg bg-[#F5F5F5] p-4 shadow">
            <h2 className="w-full truncate text-center text-lg font-semibold text-gray-700" title={bloco.nome}>
                {bloco.nome}
            </h2>

            <div className="group relative w-full outline-none" tabIndex={0}>
                <svg
                    viewBox="0 0 790 760"
                    className="w-full transition-transform duration-200 group-hover:scale-[1.03] group-focus:scale-[1.03]"
                    role="img"
                    aria-label={`${bloco.nome}: ${salas.length} ${salas.length === 1 ? "sala" : "salas"}`}
                >
                    {/* Entradas (topo e base) */}
                    <rect x="293" y="73" width="178" height="48" fill="#E8E9EE" stroke="#D5D7E0" strokeWidth="2" />
                    <rect x="288" y="701" width="186" height="50" fill="#E8E9EE" stroke="#D5D7E0" strokeWidth="2" />

                    <polygon
                        points={CONTORNO_PREDIO}
                        fill={bloco.cor}
                        stroke="rgba(120, 90, 40, 0.25)"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />
                </svg>

                {/* Tooltip com as salas do bloco */}
                <div
                    role="tooltip"
                    className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-56 -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray-900/95 p-3 text-sm text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100"
                >
                    <p className="font-semibold">{bloco.nome}</p>
                    <p className="text-gray-300">
                        {salas.length === 0
                            ? "Nenhuma sala cadastrada"
                            : `${salas.length} ${salas.length === 1 ? "sala" : "salas"}`}
                    </p>
                    {salasVisiveis.length > 0 && (
                        <ul className="mt-2 list-inside list-disc text-gray-100">
                            {salasVisiveis.map((sala) => (
                                <li key={sala.id}>
                                    {sala.nome}{" "}
                                    <span className="text-gray-400">({sala.capacidade} lugares)</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    {salasRestantes > 0 && (
                        <p className="mt-1 text-gray-400">+ {salasRestantes} outras</p>
                    )}
                </div>
            </div>

            <div className="space-x-4 text-sm">
                <button onClick={onEditar} className="font-medium text-secondary hover:underline">
                    Editar
                </button>
                <button onClick={onExcluir} className="font-medium text-red-600 hover:underline">
                    Excluir
                </button>
            </div>
        </div>
    );
}
