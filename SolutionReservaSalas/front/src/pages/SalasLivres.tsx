import { FormEvent, useState } from "react";
import { CadastroReserva } from "../components/Reservas/CadastroReserva";
import { api, mensagemErro } from "../services/api";
import { SalaLivre } from "../types/Reserva";
import { paraApi, ROTULOS_TIPO } from "../utils/datas";

const classeCampo =
    "w-full rounded-md border border-gray-300 px-3 py-2 focus:border-secondary focus:outline-none";
const classeRotulo = "mb-1 block text-sm font-medium";

export function SalasLivres() {
    const [inicio, setInicio] = useState("");
    const [fim, setFim] = useState("");
    const [capacidadeMin, setCapacidadeMin] = useState("");

    // null = ainda não buscou
    const [salas, setSalas] = useState<SalaLivre[] | null>(null);
    const [buscando, setBuscando] = useState(false);
    const [erro, setErro] = useState("");

    // Sala escolhida para reservar direto da busca
    const [reservar, setReservar] = useState<SalaLivre | null>(null);
    const [aviso, setAviso] = useState("");

    function buscar(e?: FormEvent) {
        e?.preventDefault();
        setErro("");
        setAviso("");
        setBuscando(true);

        api.get<SalaLivre[]>("/salas/livres", {
            params: {
                inicio: paraApi(inicio),
                fim: paraApi(fim),
                capacidadeMin: capacidadeMin || undefined,
            },
        })
            .then((resposta) => setSalas(resposta.data))
            .catch((e) => {
                setErro(mensagemErro(e));
                setSalas(null);
            })
            .finally(() => setBuscando(false));
    }

    function reservaConcluida() {
        setAviso(`Reserva da sala ${reservar?.nome} criada com sucesso.`);
        setReservar(null);
        buscar();
    }

    return (
        <section>
            <h1 className="mb-6 text-4xl font-bold text-white">Salas livres</h1>

            <form
                onSubmit={buscar}
                className="mb-6 grid gap-4 rounded-lg bg-white p-4 shadow-[8px_8px_1px_-1px_var(--secondary)] sm:grid-cols-4"
            >
                <div>
                    <label htmlFor="inicio" className={classeRotulo}>
                        Início
                    </label>
                    <input
                        type="datetime-local"
                        id="inicio"
                        value={inicio}
                        onChange={(e) => setInicio(e.target.value)}
                        className={classeCampo}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="fim" className={classeRotulo}>
                        Fim
                    </label>
                    <input
                        type="datetime-local"
                        id="fim"
                        value={fim}
                        onChange={(e) => setFim(e.target.value)}
                        className={classeCampo}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="capacidadeMin" className={classeRotulo}>
                        Capacidade mínima
                    </label>
                    <input
                        type="number"
                        id="capacidadeMin"
                        value={capacidadeMin}
                        onChange={(e) => setCapacidadeMin(e.target.value)}
                        placeholder="Opcional"
                        min={1}
                        className={classeCampo}
                    />
                </div>
                <div className="flex items-end">
                    <button
                        type="submit"
                        disabled={buscando}
                        className="w-full rounded-md bg-secondary px-4 py-2 font-medium text-white hover:bg-primary disabled:opacity-60"
                    >
                        {buscando ? "Buscando..." : "Buscar"}
                    </button>
                </div>
            </form>

            {erro && <p className="mb-4 rounded-md bg-red-50 p-3 text-red-700">{erro}</p>}
            {aviso && (
                <p className="mb-4 rounded-md bg-green-50 p-3 text-green-700">{aviso}</p>
            )}

            {salas === null && !erro && (
                <p className="text-white">
                    Escolha um período para ver as salas sem reserva ativa.
                </p>
            )}

            {salas?.length === 0 && (
                <p className="text-white">Nenhuma sala livre nesse período.</p>
            )}

            {salas && salas.length > 0 && (
                <>
                    <p className="mb-3 text-white">
                        {salas.length} {salas.length === 1 ? "sala livre" : "salas livres"}
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {salas.map((sala) => (
                            <div
                                key={sala.id}
                                className="flex flex-col justify-between rounded-br-[2rem] rounded-tl-[2rem] border border-gray-200 bg-white p-4 shadow-[8px_8px_1px_-1px_var(--secondary)]"
                            >
                                <div>
                                    <h2 className="text-lg font-bold text-primary">
                                        {sala.nome}
                                    </h2>
                                    <p className="text-sm text-gray-600">{sala.bloco}</p>
                                    <p className="mt-2 text-sm">
                                        {ROTULOS_TIPO[sala.tipo]} · {sala.capacidade} lugares
                                    </p>
                                </div>
                                <button
                                    onClick={() => setReservar(sala)}
                                    className="mt-4 self-end rounded-3xl bg-secondary px-4 py-1 text-sm font-semibold text-white hover:bg-primary"
                                >
                                    Reservar
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {reservar && (
                <CadastroReserva
                    valoresIniciais={{
                        salaId: reservar.id,
                        inicio: paraApi(inicio),
                        fim: paraApi(fim),
                        quantidadePessoas: capacidadeMin ? Number(capacidadeMin) : undefined,
                    }}
                    onConcluido={reservaConcluida}
                    onCancelar={() => setReservar(null)}
                />
            )}
        </section>
    );
}
