import { useCallback, useEffect, useState } from "react";
import { Sala } from "../types/Sala";
import { api, mensagemErro } from "../services/api";
import { CadastroSalas } from "../components/Salas/CadastroSalas";
import { EditarSalas } from "../components/Salas/EditarSalas";
import { DeletarSalas } from "../components/Salas/DeletarSalas";

type Acao = | { tipo: "cadastrar" } | { tipo: "editar"; sala: Sala } | { tipo: "deletar"; sala: Sala };

export function Salas(){
    const [salas, setSalas] = useState<Sala[]>([]);
    const [acao, setAcao] = useState<Acao | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const carregar = useCallback(() => {
        setErro("");
        api.get<Sala[]>("/salas")
            .then((resposta) => setSalas(resposta.data))
            .catch((e) => setErro(mensagemErro(e)))
            .finally(() => setCarregando(false));
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);
    
    function fechar(){
        setAcao(null);
    }

    function concluir(){
        setAcao(null);
        carregar();
    }
    
    return (
        <section>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-3xl font-bold text-white sm:text-4xl">Salas</h1>
                <button
                    onClick={() => setAcao({ tipo: "cadastrar" })}
                    className="rounded-3xl bg-secondary hover:bg-blue-500 px-4 py-2 text-md font-semibold text-white shadow-xl"
                >
                    Nova Sala
                </button>
            </div>

            {carregando && <p className="text-white">Carregando...</p>}

            {erro && (
                <p className="rounded-md bg-red-50 p-3 text-red-700">{erro}</p>
            )}

            {!carregando && !erro && salas.length === 0 && (
                <p className="text-white">Nenhuma sala cadastrada</p>
            )}

            {/* Celular: cada sala vira um card */}
            {salas.length > 0 && (
                <ul className="space-y-3 md:hidden">
                    {salas.map((sala) => (
                        <li
                            key={sala.id}
                            className="rounded-lg border border-gray-200 bg-white p-4 shadow-[6px_6px_1px_-1px_var(--secondary)]"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <h2 className="font-bold text-primary">{sala.nome}</h2>
                                <span className="text-xs text-gray-500">#{sala.id}</span>
                            </div>
                            <p className="text-sm text-gray-600">{sala.bloco}</p>
                            <p className="mt-1 text-sm">
                                {sala.tipo} · {sala.capacidade} lugares
                            </p>
                            <div className="mt-3 flex justify-end gap-5 text-sm">
                                <button
                                    onClick={() => setAcao({ tipo: "editar", sala })}
                                    className="py-1 font-medium text-secondary hover:underline"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => setAcao({ tipo: "deletar", sala })}
                                    className="py-1 font-medium text-red-600 hover:underline"
                                >
                                    Excluir
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {salas.length > 0 && (
                <div className="hidden overflow-x-auto rounded-lg border border-gray-200 bg-white md:block">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="px-4 py-3 font-medium">ID</th>
                                <th className="px-4 py-3 font-medium">Nome</th>
                                <th className="px-4 py-3 font-medium">Capacidade</th>
                                <th className="px-4 py-3 font-medium">Tipo</th>
                                <th className="px-4 py-3 font-medium">Bloco</th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {salas.map((sala) => (
                                <tr
                                    key={sala.id}
                                    className="border-t border-gray-100"
                                >
                                    <td className="px-4 py-3 text-gray-500">{sala.id}</td>
                                    <td className="px-4 py-3">{sala.nome}</td>
                                    <td className="px-4 py-3">{sala.capacidade}</td>
                                    <td className="px-4 py-3">{sala.tipo}</td>
                                    <td className="px-4 py-3">{sala.bloco}</td>
                                    <td className="space-x-3 px-4 py-3 text-right">
                                        <button
                                            onClick={() => setAcao({ tipo: "editar", sala})}
                                            className="font-medium text-secondary hover:underline"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => setAcao({ tipo: "deletar", sala })}
                                            className="font-medium text-red-600 hover:underline"
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {acao?.tipo === "cadastrar" && (
                <CadastroSalas onConcluido={concluir} onCancelar={fechar} />
            )}
            {acao?.tipo === "editar" && (
                <EditarSalas sala={acao.sala} onConcluido={concluir} onCancelar={fechar} />
            )}
            {acao?.tipo === "deletar" && (
                <DeletarSalas sala={acao.sala} onConcluido={concluir} onCancelar={fechar} />
            )}

        </section>
    );
}