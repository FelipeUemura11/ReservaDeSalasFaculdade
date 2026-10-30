import { useState } from "react";
import { Bloco } from "../../types/Bloco";
import { Sala } from "../../types/Sala";

interface MapaBlocoProps {
    bloco: Bloco;
    salas: Sala[];
    onEditar: () => void;
    onExcluir: () => void;
}

// Medidas do prédio visto de frente (unidades do viewBox)
const LARGURA = 506;
const ALTURA_TELHADO = 24;
const ALTURA_ANDAR = 77;
const ALTURA_TERREO = 85;

const JANELAS_POR_ANDAR = 7;
const JANELA_X_INICIAL = 56;
const JANELA_PASSO = 60;
const JANELA_LARGURA = 34;
const JANELA_ALTURA = 44;
const JANELA_TOPO_NO_ANDAR = 31;

const CENTRO = LARGURA / 2;
const PORTA_LARGURA = 54;

const COR_VIDRO_CLARO = "#F2F7FA";
const COR_VIDRO_ESCURO = "#C9DDE9";
const COR_JANELA_ATIVA = "#FFE79A";
const COR_MOLDURA = "#FFFFFF";
const COR_PORTA = "#6B4226";
const COR_PORTA_ESCURA = "#4E2F1B";
const COR_LUZ = "#FFD966";

const NOME_TIPO: Record<Sala["tipo"], string> = {
    SalaDeAula: "Sala de aula",
    Laboratorio: "Laboratório",
    Auditorio: "Auditório",
};

// Clareia (fator > 0) ou escurece (fator < 0) uma cor #RRGGBB
function ajustarCor(hex: string, fator: number) {
    const valor = parseInt(hex.slice(1), 16);
    const alvo = fator > 0 ? 255 : 0;
    const canal = (deslocamento: number) => {
        const c = (valor >> deslocamento) & 0xff;
        return Math.round(c + (alvo - c) * Math.abs(fator));
    };
    return `rgb(${canal(16)}, ${canal(8)}, ${canal(0)})`;
}

// Bloco desenhado como um prédio de frente: cada sala é uma janela
export function MapaBloco({
    bloco,
    salas,
    onEditar,
    onExcluir,
}: MapaBlocoProps) {
    const [salaAtiva, setSalaAtiva] = useState<number | null>(null);

    // Sempre ao menos um andar, mesmo sem salas
    const andares = Math.max(1, Math.ceil(salas.length / JANELAS_POR_ANDAR));
    const baseAndares = ALTURA_TELHADO + andares * ALTURA_ANDAR;
    const altura = baseAndares + ALTURA_TERREO;

    // As salas ocupam os andares de baixo para cima, da esquerda para a direita
    const janelas = salas.map((sala, i) => {
        const andar = Math.floor(i / JANELAS_POR_ANDAR);
        const coluna = i % JANELAS_POR_ANDAR;
        return {
            sala,
            x: JANELA_X_INICIAL + coluna * JANELA_PASSO,
            y: baseAndares - (andar + 1) * ALTURA_ANDAR + JANELA_TOPO_NO_ANDAR,
        };
    });

    const janelaAtiva = janelas.find((j) => j.sala.id === salaAtiva);

    // Tons derivados da cor do bloco
    const corEscura = ajustarCor(bloco.cor, -0.35);
    const corSombra = ajustarCor(bloco.cor, -0.12);
    const corPedra = ajustarCor(bloco.cor, 0.55);

    // Ids únicos por bloco, pois vários SVGs dividem a mesma página
    const idFachada = `fachada-${bloco.id}`;
    const idVidro = `vidro-${bloco.id}`;

    return (
        <div className="flex flex-col items-center gap-3 rounded-md bg-[#F5F5F5] p-5 shadow-xl transition-transform hover:scale-[1.03]">
            <h2
                className="w-full truncate text-center text-lg font-semibold text-gray-700"
                title={bloco.nome}
            >
                {bloco.nome}
            </h2>

            {/* Empurra o prédio para baixo, alinhando o chão entre os cards */}
            <div className="flex w-full flex-1 items-end">
                <div className="relative w-full">
                    <svg
                        viewBox={`0 0 ${LARGURA} ${altura}`}
                        className="w-full"
                        role="img"
                        aria-label={`${bloco.nome}: ${salas.length} ${salas.length === 1 ? "sala" : "salas"}`}
                    >
                        <defs>
                            <linearGradient
                                id={idFachada}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0"
                                    stopColor={ajustarCor(bloco.cor, 0.08)}
                                />
                                <stop
                                    offset="1"
                                    stopColor={ajustarCor(bloco.cor, -0.08)}
                                />
                            </linearGradient>
                            <linearGradient
                                id={idVidro}
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="1"
                            >
                                <stop offset="0" stopColor={COR_VIDRO_CLARO} />
                                <stop offset="1" stopColor={COR_VIDRO_ESCURO} />
                            </linearGradient>
                        </defs>

                        {/* Fachada com pilares nas laterais */}
                        <rect
                            x="12"
                            y="12"
                            width="482"
                            height={altura - 12}
                            fill={`url(#${idFachada})`}
                        />
                        <rect
                            x="12"
                            y="24"
                            width="10"
                            height={altura - 24}
                            fill={corSombra}
                        />
                        <rect
                            x="484"
                            y="24"
                            width="10"
                            height={altura - 24}
                            fill={corSombra}
                        />

                        {/* Faixas entre os andares */}
                        {Array.from({ length: andares }, (_, i) => (
                            <rect
                                key={i}
                                x="12"
                                y={ALTURA_TELHADO + (i + 1) * ALTURA_ANDAR - 2}
                                width="482"
                                height="4"
                                fill={corSombra}
                            />
                        ))}

                        {/* Telhado: platibanda, beiral e friso claro */}
                        <rect
                            x="6"
                            y="6"
                            width="494"
                            height="6"
                            fill={corEscura}
                        />
                        <rect
                            x="2"
                            y="12"
                            width="502"
                            height="12"
                            fill={corEscura}
                        />
                        <rect
                            x="12"
                            y="24"
                            width="482"
                            height="4"
                            fill={corPedra}
                        />

                        {janelas.map(({ sala, x, y }) => (
                            <g
                                key={sala.id}
                                className="cursor-pointer outline-none"
                                tabIndex={0}
                                role="img"
                                aria-label={`${sala.nome}, ${NOME_TIPO[sala.tipo]}, ${sala.capacidade} lugares`}
                                onMouseEnter={() => setSalaAtiva(sala.id)}
                                onMouseLeave={() => setSalaAtiva(null)}
                                onFocus={() => setSalaAtiva(sala.id)}
                                onBlur={() => setSalaAtiva(null)}
                            >
                                {/* Verga e peitoril */}
                                <rect
                                    x={x - 3}
                                    y={y - 5}
                                    width={JANELA_LARGURA + 6}
                                    height="4"
                                    fill={corPedra}
                                />
                                <rect
                                    x={x - 4}
                                    y={y + JANELA_ALTURA + 1}
                                    width={JANELA_LARGURA + 8}
                                    height="5"
                                    fill={corPedra}
                                />

                                <rect
                                    x={x}
                                    y={y}
                                    width={JANELA_LARGURA}
                                    height={JANELA_ALTURA}
                                    fill={
                                        sala.id === salaAtiva
                                            ? COR_JANELA_ATIVA
                                            : `url(#${idVidro})`
                                    }
                                    stroke={COR_MOLDURA}
                                    strokeWidth="2.5"
                                />
                                {/* Caixilhos */}
                                <line
                                    x1={x + JANELA_LARGURA / 2}
                                    y1={y}
                                    x2={x + JANELA_LARGURA / 2}
                                    y2={y + JANELA_ALTURA}
                                    stroke={COR_MOLDURA}
                                    strokeWidth="2"
                                />
                                <line
                                    x1={x}
                                    y1={y + JANELA_ALTURA * 0.4}
                                    x2={x + JANELA_LARGURA}
                                    y2={y + JANELA_ALTURA * 0.4}
                                    stroke={COR_MOLDURA}
                                    strokeWidth="2"
                                />
                                {/* Reflexo no vidro */}
                                <polygon
                                    points={`${x + 3},${y + 14} ${x + 10},${y + 3} ${x + 13},${y + 3} ${x + 3},${y + 17}`}
                                    fill="#FFFFFF"
                                    opacity="0.7"
                                />
                            </g>
                        ))}

                        {/* Rodapé e degrau da entrada */}
                        <rect
                            x="12"
                            y={altura - 8}
                            width="482"
                            height="8"
                            fill={corEscura}
                        />
                        <rect
                            x={CENTRO - PORTA_LARGURA / 2 - 14}
                            y={altura - 6}
                            width={PORTA_LARGURA + 28}
                            height="6"
                            fill={corPedra}
                        />

                        {/* Porta dupla com batente, marquise e luminárias */}
                        <rect
                            x={CENTRO - PORTA_LARGURA / 2 - 6}
                            y={baseAndares + 14}
                            width={PORTA_LARGURA + 12}
                            height={ALTURA_TERREO - 20}
                            fill={corPedra}
                        />
                        <rect
                            x={CENTRO - PORTA_LARGURA / 2}
                            y={baseAndares + 20}
                            width={PORTA_LARGURA}
                            height={ALTURA_TERREO - 26}
                            fill={COR_PORTA}
                        />
                        <line
                            x1={CENTRO}
                            y1={baseAndares + 20}
                            x2={CENTRO}
                            y2={altura - 6}
                            stroke={COR_PORTA_ESCURA}
                            strokeWidth="2"
                        />
                        <rect
                            x={CENTRO - 22}
                            y={baseAndares + 26}
                            width="18"
                            height="16"
                            fill={`url(#${idVidro})`}
                        />
                        <rect
                            x={CENTRO + 4}
                            y={baseAndares + 26}
                            width="18"
                            height="16"
                            fill={`url(#${idVidro})`}
                        />
                        <circle
                            cx={CENTRO - 5}
                            cy={baseAndares + 54}
                            r="2"
                            fill={COR_LUZ}
                        />
                        <circle
                            cx={CENTRO + 5}
                            cy={baseAndares + 54}
                            r="2"
                            fill={COR_LUZ}
                        />
                        <rect
                            x={CENTRO - PORTA_LARGURA / 2 - 16}
                            y={baseAndares + 6}
                            width={PORTA_LARGURA + 32}
                            height="8"
                            rx="2"
                            fill={corEscura}
                        />
                        {[-1, 1].map((lado) => (
                            <g key={lado}>
                                <rect
                                    x={CENTRO + lado * 50 - 4}
                                    y={baseAndares + 30}
                                    width="8"
                                    height="12"
                                    rx="2"
                                    fill={corEscura}
                                />
                                <circle
                                    cx={CENTRO + lado * 50}
                                    cy={baseAndares + 36}
                                    r="2.5"
                                    fill={COR_LUZ}
                                />
                            </g>
                        ))}
                    </svg>

                    {/* Tooltip da janela (sala) sob o cursor */}
                    {janelaAtiva && (
                        <div
                            role="tooltip"
                            className="pointer-events-none absolute z-10 w-40 -translate-x-1/2 -translate-y-full rounded-md bg-gray-900/95 p-2 text-xs text-white shadow-lg"
                            style={{
                                left: `${((janelaAtiva.x + JANELA_LARGURA / 2) / LARGURA) * 100}%`,
                                top: `calc(${(janelaAtiva.y / altura) * 100}% - 6px)`,
                            }}
                        >
                            <p className="font-semibold">
                                {janelaAtiva.sala.nome}
                            </p>
                            <p className="text-gray-300">
                                {NOME_TIPO[janelaAtiva.sala.tipo]} ·{" "}
                                {janelaAtiva.sala.capacidade} lugares
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-x-4 text-sm">
                <button
                    onClick={onEditar}
                    className="font-medium text-secondary hover:underline"
                >
                    Editar
                </button>
                <button
                    onClick={onExcluir}
                    className="font-medium text-red-600 hover:underline"
                >
                    Excluir
                </button>
            </div>
        </div>
    );
}
