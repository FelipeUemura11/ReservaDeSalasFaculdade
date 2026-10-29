import { FormEvent, useEffect, useState } from "react";
import { api, mensagemErro } from "../../services/api";
import { Bloco } from "../../types/Bloco";
import { DadosSala, TipoSala } from "../../types/Sala";

interface FormSalaProps {
    salaInicial?: DadosSala;
    textoBotao: string;
    salvando: boolean;
    erro: string;
    onSalvar: (dados: DadosSala) => void;
    onCancelar: () => void;
}

// Record garante que todo TipoSala tenha um rótulo
const ROTULOS_TIPO: Record<TipoSala, string> = {
    SalaDeAula: "Sala de aula",
    Laboratorio: "Laboratório",
    Auditorio: "Auditório",
};

const classeCampo =
    "w-full rounded-md border border-gray-300 px-3 py-2 focus:border-secondary focus:outline-none";
const classeRotulo = "mb-1 block text-sm font-medium";

// Formulário compartilhado entre o cadastro e a edição de salas
export function FormSala({
    salaInicial,
    textoBotao,
    salvando,
    erro,
    onSalvar,
    onCancelar,
}: FormSalaProps) {
    const [nome, setNome] = useState(salaInicial?.nome ?? "");
    
    const [capacidade, setCapacidade] = useState(salaInicial ? String(salaInicial.capacidade) : "");
    const [tipo, setTipo] = useState<TipoSala>(salaInicial?.tipo ?? "SalaDeAula");
    const [blocoId, setBlocoId] = useState(salaInicial ? String(salaInicial.blocoId) : "");

    const [blocos, setBlocos] = useState<Bloco[]>([]);
    const [carregandoBlocos, setCarregandoBlocos] = useState(true);
    const [erroBlocos, setErroBlocos] = useState("");

    useEffect(() => {
        api.get<Bloco[]>("/blocos")
            .then((resposta) => setBlocos(resposta.data))
            .catch((e) => setErroBlocos(mensagemErro(e)))
            .finally(() => setCarregandoBlocos(false));
    }, []);

    function enviar(e: FormEvent) {
        e.preventDefault();
        onSalvar({
            nome,
            capacidade: Number(capacidade),
            tipo,
            blocoId: Number(blocoId),
        });
    }

    return (
        <form onSubmit={enviar} className="space-y-4">
            <div>
                <label htmlFor="nome" className={classeRotulo}>
                    Nome
                </label>
                <input
                    type="text"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Sala 204"
                    className={classeCampo}
                    autoFocus
                    required
                />
            </div>

            <div>
                <label htmlFor="capacidade" className={classeRotulo}>
                    Capacidade
                </label>
                <input
                    type="number"
                    id="capacidade"
                    value={capacidade}
                    onChange={(e) => setCapacidade(e.target.value)}
                    placeholder="Ex: 60"
                    min={1}
                    className={classeCampo}
                    required
                />
            </div>

            <div>
                <label htmlFor="tipo" className={classeRotulo}>
                    Tipo da sala
                </label>
                <select
                    id="tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as TipoSala)}
                    className={classeCampo}
                    required
                >
                    {Object.entries(ROTULOS_TIPO).map(([valor, rotulo]) => (
                        <option key={valor} value={valor}>
                            {rotulo}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="blocoId" className={classeRotulo}>
                    Bloco
                </label>
                <select
                    id="blocoId"
                    value={blocoId}
                    onChange={(e) => setBlocoId(e.target.value)}
                    className={classeCampo}
                    disabled={carregandoBlocos}
                    required
                >
                    <option value="" disabled>
                        {carregandoBlocos ? "Carregando blocos..." : "Selecione um bloco"}
                    </option>
                    {blocos.map((bloco) => (
                        <option key={bloco.id} value={bloco.id}>
                            {bloco.nome}
                        </option>
                    ))}
                </select>
                {!carregandoBlocos && !erroBlocos && blocos.length === 0 && (
                    <p className="mt-1 text-sm text-gray-500">
                        Nenhum bloco cadastrado. Cadastre um bloco antes de criar salas.
                    </p>
                )}
            </div>

            {erroBlocos && (
                <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{erroBlocos}</p>
            )}

            {erro && (
                <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{erro}</p>
            )}

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancelar}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={salvando}
                    className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-primary disabled:opacity-60"
                >
                    {salvando ? "Salvando..." : textoBotao}
                </button>
            </div>
        </form>
    );
}
