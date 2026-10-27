import { FormEvent, useState } from "react";

interface FormBlocoProps {
    nomeInicial?: string;
    textoBotao: string;
    salvando: boolean;
    erro: string;
    onSalvar: (nome: string) => void;
    onCancelar: () => void;
}

// Formulário compartilhado entre o cadastro e a edição de blocos
export function FormBloco({
    nomeInicial = "",
    textoBotao,
    salvando,
    erro,
    onSalvar,
    onCancelar,
}: FormBlocoProps) {
    const [nome, setNome] = useState(nomeInicial);

    function enviar(e: FormEvent) {
        e.preventDefault();
        onSalvar(nome);
    }

    return (
        <form onSubmit={enviar} className="space-y-4">
            <div>
                <label htmlFor="nome" className="mb-1 block text-sm font-medium">
                    Nome
                </label>
                <input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Bloco Azul"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-secondary focus:outline-none"
                    autoFocus
                    required
                />
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
