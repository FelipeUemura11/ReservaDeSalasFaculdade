import { useCallback, useEffect, useState } from "react";
import { CadastroBloco } from "../components/Blocos/CadastroBloco";
import { DeletarBloco } from "../components/Blocos/DeletarBloco";
import { EditarBloco } from "../components/Blocos/EditarBloco";
import { api, mensagemErro } from "../services/api";
import { Bloco } from "../types/Bloco";

// Qual janela está aberta sobre a lista
type Acao =
    | { tipo: "cadastrar" }
    | { tipo: "editar"; bloco: Bloco }
    | { tipo: "deletar"; bloco: Bloco };

export function Blocos() {
    const [blocos, setBlocos] = useState<Bloco[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [acao, setAcao] = useState<Acao | null>(null);

    const carregar = useCallback(() => {
        setErro("");
        api.get<Bloco[]>("/blocos")
            .then((resposta) => setBlocos(resposta.data))
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

    return (
        <section>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Blocos</h1>
                <button
                    onClick={() => setAcao({ tipo: "cadastrar" })}
                    className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-primary"
                >
                    Novo bloco
                </button>
            </div>

            {carregando && <p className="text-gray-500">Carregando...</p>}

            {erro && (
                <p className="rounded-md bg-red-50 p-3 text-red-700">{erro}</p>
            )}

            {!carregando && !erro && blocos.length === 0 && (
                <p className="text-gray-500">Nenhum bloco cadastrado.</p>
            )}

            {blocos.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="px-4 py-3 font-medium">ID</th>
                                <th className="px-4 py-3 font-medium">Nome</th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {blocos.map((bloco) => (
                                <tr
                                    key={bloco.id}
                                    className="border-t border-gray-100"
                                >
                                    <td className="px-4 py-3 text-gray-500">
                                        {bloco.id}
                                    </td>
                                    <td className="px-4 py-3">{bloco.nome}</td>
                                    <td className="space-x-3 px-4 py-3 text-right">
                                        <button
                                            onClick={() => setAcao({ tipo: "editar", bloco })}
                                            className="font-medium text-secondary hover:underline"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => setAcao({ tipo: "deletar", bloco })}
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
                <CadastroBloco onConcluido={concluir} onCancelar={fechar} />
            )}
            {acao?.tipo === "editar" && (
                <EditarBloco bloco={acao.bloco} onConcluido={concluir} onCancelar={fechar} />
            )}
            {acao?.tipo === "deletar" && (
                <DeletarBloco bloco={acao.bloco} onConcluido={concluir} onCancelar={fechar} />
            )}
        </section>
    );
}
