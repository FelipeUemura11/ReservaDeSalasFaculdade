import { useEffect, useState } from "react";
import { api, mensagemErro } from "../services/api";
import { AgendaSala } from "../types/Reserva";
import { Sala } from "../types/Sala";
import { formatarDataExtenso, formatarHora, hojeInput } from "../utils/datas";

const classeCampo =
    "w-full rounded-md border border-gray-300 px-3 py-2 focus:border-secondary focus:outline-none";
const classeRotulo = "mb-1 block text-sm font-medium";

export function Agenda() {
    const [salas, setSalas] = useState<Sala[]>([]);
    const [salaId, setSalaId] = useState("");
    const [data, setData] = useState(hojeInput());

    const [agenda, setAgenda] = useState<AgendaSala | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    // Carrega as salas para o select e já escolhe a primeira
    useEffect(() => {
        api.get<Sala[]>("/salas")
            .then((resposta) => {
                setSalas(resposta.data);
                if (resposta.data.length > 0) setSalaId(String(resposta.data[0].id));
            })
            .catch((e) => setErro(mensagemErro(e)));
    }, []);

    // Busca a agenda sempre que a sala ou a data mudam
    useEffect(() => {
        if (!salaId || !data) return;
        setErro("");
        setCarregando(true);
        api.get<AgendaSala>(`/salas/${salaId}/agenda`, { params: { data } })
            .then((resposta) => setAgenda(resposta.data))
            .catch((e) => {
                setErro(mensagemErro(e));
                setAgenda(null);
            })
            .finally(() => setCarregando(false));
    }, [salaId, data]);

    // Reservas que começaram no dia anterior ou terminam no dia seguinte
    function diaDe(dataApi: string) {
        return dataApi.slice(0, 10);
    }

    return (
        <section>
            <h1 className="mb-6 text-3xl font-bold text-white sm:text-4xl">Agenda da sala</h1>

            <div className="mb-6 grid gap-4 rounded-lg bg-white p-4 shadow-[8px_8px_1px_-1px_var(--secondary)] sm:grid-cols-2">
                <div>
                    <label htmlFor="salaId" className={classeRotulo}>
                        Sala
                    </label>
                    <select
                        id="salaId"
                        value={salaId}
                        onChange={(e) => setSalaId(e.target.value)}
                        className={classeCampo}
                    >
                        {salas.length === 0 && <option value="">Nenhuma sala cadastrada</option>}
                        {salas.map((sala) => (
                            <option key={sala.id} value={sala.id}>
                                {sala.nome} · {sala.bloco}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="data" className={classeRotulo}>
                        Data
                    </label>
                    <input
                        type="date"
                        id="data"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        className={classeCampo}
                        required
                    />
                </div>
            </div>

            {erro && <p className="mb-4 rounded-md bg-red-50 p-3 text-red-700">{erro}</p>}

            {carregando && <p className="text-white">Carregando...</p>}

            {agenda && !carregando && (
                <div className="rounded-lg bg-white p-4">
                    <h2 className="text-lg font-bold text-primary">{agenda.sala}</h2>
                    <p className="mb-4 text-sm text-gray-600 first-letter:uppercase">
                        {formatarDataExtenso(agenda.data)}
                    </p>

                    {agenda.reservas.length === 0 ? (
                        <p className="text-gray-600">Nenhuma reserva neste dia. A sala está livre.</p>
                    ) : (
                        <ol className="space-y-3 border-l-2 border-secondary pl-4">
                            {agenda.reservas.map((r) => (
                                <li key={r.id} className="relative">
                                    <span className="absolute -left-[1.4rem] top-1.5 h-3 w-3 rounded-full bg-secondary" />
                                    <p className="font-semibold text-primary">
                                        {formatarHora(r.inicio)} – {formatarHora(r.fim)}
                                        {diaDe(r.inicio) !== agenda.data && (
                                            <span className="ml-2 text-xs font-normal text-gray-500">
                                                (começou no dia anterior)
                                            </span>
                                        )}
                                        {diaDe(r.fim) !== agenda.data && (
                                            <span className="ml-2 text-xs font-normal text-gray-500">
                                                (termina no dia seguinte)
                                            </span>
                                        )}
                                    </p>
                                    <p>{r.motivo}</p>
                                    <p className="text-sm text-gray-600">
                                        {r.responsavel} · {r.quantidadePessoas} pessoas
                                    </p>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            )}
        </section>
    );
}
