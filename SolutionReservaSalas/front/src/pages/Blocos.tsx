import { useCallback, useEffect, useState } from "react";
import { CadastroBloco } from "../components/Blocos/CadastroBloco";
import { DeletarBloco } from "../components/Blocos/DeletarBloco";
import { EditarBloco } from "../components/Blocos/EditarBloco";
import { MapaBloco } from "../components/Blocos/MapaBloco";
import { api, mensagemErro } from "../services/api";
import { Bloco } from "../types/Bloco";
import { Sala } from "../types/Sala";

// Qual janela está aberta sobre a lista
type Acao =
    | { tipo: "cadastrar" }
    | { tipo: "editar"; bloco: Bloco }
    | { tipo: "deletar"; bloco: Bloco };

export function Blocos() {
    const [blocos, setBlocos] = useState<Bloco[]>([]);
    const [salas, setSalas] = useState<Sala[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [acao, setAcao] = useState<Acao | null>(null);

    // Busca blocos e salas juntos; as salas alimentam o tooltip de cada bloco
    const carregar = useCallback(() => {
        setErro("");
        Promise.all([api.get<Bloco[]>("/blocos"), api.get<Sala[]>("/salas")])
            .then(([respostaBlocos, respostaSalas]) => {
                setBlocos(respostaBlocos.data);
                setSalas(respostaSalas.data);
            })
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
                <h1 className="text-4xl font-bold text-white">Blocos</h1>
                <button
                    onClick={() => setAcao({ tipo: "cadastrar" })}
                    className="rounded-3xl bg-secondary px-4 py-2 text-md font-semibold text-white hover:bg-blue-500 transition-colors shadow-xl"
                >
                    Novo bloco
                </button>
            </div>

            {carregando && <p className="text-white">Carregando...</p>}

            {erro && (
                <p className="rounded-md bg-red-50 p-3 text-red-700">{erro}</p>
            )}

            {!carregando && !erro && blocos.length === 0 && (
                <p className="text-white">Nenhum bloco cadastrado.</p>
            )}

            {blocos.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                    {blocos.map((bloco) => (
                        <MapaBloco
                            key={bloco.id}
                            bloco={bloco}
                            salas={salas.filter((s) => s.blocoId === bloco.id)}
                            onEditar={() => setAcao({ tipo: "editar", bloco })}
                            onExcluir={() =>
                                setAcao({ tipo: "deletar", bloco })
                            }
                        />
                    ))}
                </div>
            )}

            {acao?.tipo === "cadastrar" && (
                <CadastroBloco onConcluido={concluir} onCancelar={fechar} />
            )}
            {acao?.tipo === "editar" && (
                <EditarBloco
                    bloco={acao.bloco}
                    onConcluido={concluir}
                    onCancelar={fechar}
                />
            )}
            {acao?.tipo === "deletar" && (
                <DeletarBloco
                    bloco={acao.bloco}
                    onConcluido={concluir}
                    onCancelar={fechar}
                />
            )}
        </section>
    );
}
