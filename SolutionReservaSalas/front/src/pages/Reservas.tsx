import { useCallback, useEffect, useState } from "react";
import { CadastroReserva } from "../components/Reservas/CadastroReserva";
import { CancelarReserva } from "../components/Reservas/CancelarReserva";
import { EditarReserva } from "../components/Reservas/EditarReserva";
import { api, mensagemErro } from "../services/api";
import { Reserva, StatusReserva } from "../types/Reserva";
import { formatarDataHora } from "../utils/datas";

type Acao =
    | { tipo: "cadastrar" }
    | { tipo: "editar"; reserva: Reserva }
    | { tipo: "cancelar"; reserva: Reserva };

type Filtro = "Todas" | StatusReserva;

const FILTROS: Filtro[] = ["Todas", "Ativa", "Cancelada"];
const ROTULOS_FILTRO: Record<Filtro, string> = {
    Todas: "Todas",
    Ativa: "Ativas",
    Cancelada: "Canceladas",
};

function SeloStatus({ status }: { status: StatusReserva }) {
    return status === "Ativa" ? (
        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
            Ativa
        </span>
    ) : (
        <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-600">
            Cancelada
        </span>
    );
}

export function Reservas() {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [acao, setAcao] = useState<Acao | null>(null);
    const [filtro, setFiltro] = useState<Filtro>("Ativa");

    const carregar = useCallback(() => {
        setErro("");
        api.get<Reserva[]>("/reservas")
            .then((resposta) => setReservas(resposta.data))
            .catch((e) => setErro(mensagemErro(e)))
            .finally(() => setCarregando(false));
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    function fechar() {
        setAcao(null);
    }

    function concluir() {
        setAcao(null);
        carregar();
    }

    const visiveis =
        filtro === "Todas" ? reservas : reservas.filter((r) => r.status === filtro);

    return (
        <section>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-4xl font-bold text-white">Reservas</h1>
                <button
                    onClick={() => setAcao({ tipo: "cadastrar" })}
                    className="rounded-3xl bg-secondary px-4 py-2 text-md font-semibold text-white shadow-xl transition-colors hover:bg-blue-500"
                >
                    Nova reserva
                </button>
            </div>

            <div className="mb-4 flex gap-2">
                {FILTROS.map((f) => (
                    <button
                        key={f}
                        onClick={() => setFiltro(f)}
                        className={
                            filtro === f
                                ? "rounded-3xl bg-white px-4 py-1 text-sm font-semibold text-primary"
                                : "rounded-3xl border border-white/60 px-4 py-1 text-sm font-medium text-white hover:bg-white/10"
                        }
                    >
                        {ROTULOS_FILTRO[f]}
                    </button>
                ))}
            </div>

            {carregando && <p className="text-white">Carregando...</p>}

            {erro && <p className="rounded-md bg-red-50 p-3 text-red-700">{erro}</p>}

            {!carregando && !erro && visiveis.length === 0 && (
                <p className="text-white">Nenhuma reserva encontrada.</p>
            )}

            {visiveis.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="px-4 py-3 font-medium">Sala</th>
                                <th className="px-4 py-3 font-medium">Responsável</th>
                                <th className="px-4 py-3 font-medium">Motivo</th>
                                <th className="px-4 py-3 font-medium">Pessoas</th>
                                <th className="px-4 py-3 font-medium">Período</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visiveis.map((reserva) => (
                                <tr
                                    key={reserva.id}
                                    className={
                                        reserva.status === "Cancelada"
                                            ? "border-t border-gray-100 text-gray-400"
                                            : "border-t border-gray-100"
                                    }
                                >
                                    <td className="px-4 py-3 font-medium">{reserva.sala}</td>
                                    <td className="px-4 py-3">{reserva.responsavel}</td>
                                    <td className="px-4 py-3">{reserva.motivo}</td>
                                    <td className="px-4 py-3">{reserva.quantidadePessoas}</td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        {formatarDataHora(reserva.inicio)}
                                        <br />
                                        até {formatarDataHora(reserva.fim)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <SeloStatus status={reserva.status} />
                                    </td>
                                    <td className="space-x-3 whitespace-nowrap px-4 py-3 text-right">
                                        {reserva.status === "Ativa" && (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        setAcao({ tipo: "editar", reserva })
                                                    }
                                                    className="font-medium text-secondary hover:underline"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setAcao({ tipo: "cancelar", reserva })
                                                    }
                                                    className="font-medium text-red-600 hover:underline"
                                                >
                                                    Cancelar
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {acao?.tipo === "cadastrar" && (
                <CadastroReserva onConcluido={concluir} onCancelar={fechar} />
            )}
            {acao?.tipo === "editar" && (
                <EditarReserva reserva={acao.reserva} onConcluido={concluir} onCancelar={fechar} />
            )}
            {acao?.tipo === "cancelar" && (
                <CancelarReserva
                    reserva={acao.reserva}
                    onConcluido={concluir}
                    onCancelar={fechar}
                />
            )}
        </section>
    );
}
