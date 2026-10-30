import { FormEvent, useState } from "react";
import { COR_PADRAO_BLOCO, DadosBloco } from "../../types/Bloco";

interface FormBlocoProps {
    blocoInicial?: DadosBloco;
    textoBotao: string;
    salvando: boolean;
    erro: string;
    onSalvar: (dados: DadosBloco) => void;
    onCancelar: () => void;
}

// Sugestões rápidas; o input de cor permite qualquer outra
const CORES_SUGERIDAS = [
    { valor: COR_PADRAO_BLOCO, nome: "Vermelho" },
    { valor: "#009EED", nome: "Azul" },
    { valor: "#FDE047", nome: "Amarelo" },
    { valor: "#EDE8D0", nome: "Bege" },
    { valor: "#B97A57", nome: "Marrom" },
];

// Formulário compartilhado entre o cadastro e a edição de blocos
export function FormBloco({
    blocoInicial,
    textoBotao,
    salvando,
    erro,
    onSalvar,
    onCancelar,
}: FormBlocoProps) {
    const [nome, setNome] = useState(blocoInicial?.nome ?? "");
    const [cor, setCor] = useState(blocoInicial?.cor ?? COR_PADRAO_BLOCO);

    function enviar(e: FormEvent) {
        e.preventDefault();
        onSalvar({ nome, cor });
    }

    return (
        <form onSubmit={enviar} className="space-y-4">
            <div>
                <label htmlFor="nome" className="mb-1 block text-sm font-medium">
                    Nome
                </label>
                <input
                    type="text"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Bloco Vermelho"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-secondary focus:outline-none"
                    autoFocus
                    required
                />
            </div>

            <div>
                <span className="mb-1 block text-sm font-medium">Cor no mapa</span>
                <div className="flex flex-wrap items-center gap-2">
                    {CORES_SUGERIDAS.map((sugestao) => (
                        <button
                            key={sugestao.valor}
                            type="button"
                            onClick={() => setCor(sugestao.valor)}
                            title={sugestao.nome}
                            aria-label={sugestao.nome}
                            aria-pressed={cor.toUpperCase() === sugestao.valor}
                            style={{ backgroundColor: sugestao.valor }}
                            className={`h-8 w-8 rounded-full border border-gray-300 transition ${
                                cor.toUpperCase() === sugestao.valor
                                    ? "ring-2 ring-secondary ring-offset-2"
                                    : "hover:scale-110"
                            }`}
                        />
                    ))}
                    <label
                        htmlFor="cor"
                        className="ml-1 flex cursor-pointer items-center gap-2 text-sm text-gray-600"
                    >
                        <input
                            type="color"
                            id="cor"
                            value={cor}
                            onChange={(e) => setCor(e.target.value)}
                            className="h-8 w-10 cursor-pointer rounded border border-gray-300 bg-white"
                        />
                        Outra
                    </label>
                </div>
            </div>

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
