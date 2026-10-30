import { useEffect, useState } from "react";
import { api, mensagemErro } from "../../services/api";
import { Bloco } from "../../types/Bloco";
import { Sala } from "../../types/Sala";
import { Modal } from "../Modal";

interface DeletarBlocoProps {
    bloco: Bloco;
    onConcluido: () => void;
    onCancelar: () => void;
}

export function DeletarBloco({ bloco, onConcluido, onCancelar }: DeletarBlocoProps) {
    const [salas, setSalas] = useState<Sala[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [excluindo, setExcluindo] = useState(false);

    useEffect(() => {
        // Busca as salas do bloco para avisar antes de tentar excluir
        api.get<Sala[]>("/salas")
            .then((resposta) =>
                setSalas(resposta.data.filter((s) => s.blocoId === bloco.id)),
            )
            .catch((e) => setErro(mensagemErro(e)))
            .finally(() => setCarregando(false));
    }, [bloco.id]);

    function excluir() {
        setErro("");
        setExcluindo(true);

        // A API responde 409 se o bloco ainda tiver salas
        api.delete(`/blocos/${bloco.id}`)
            .then(onConcluido)
            .catch((e) => {
                setErro(mensagemErro(e));
                setExcluindo(false);
            });
    }

    return (
        <Modal titulo="Excluir bloco" onFechar={onCancelar}>
            <div className="space-y-4">
                <p>
                    Tem certeza que deseja excluir o {" "}
                    <strong>{bloco.nome}</strong>?
                </p>

                {carregando && <p className="text-sm text-gray-500">Verificando salas...</p>}

                {salas.length > 0 && (
                    <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
                        <p className="font-medium">
                            Este bloco possui {salas.length}{" "}
                            {salas.length === 1 ? "sala" : "salas"} e não pode ser excluído.
                        </p>
                        <ul className="mt-2 list-inside list-disc">
                            {salas.map((sala) => (
                                <li key={sala.id}>{sala.nome}</li>
                            ))}
                        </ul>
                        <p className="mt-2">Exclua ou mova as salas para outro bloco primeiro.</p>
                    </div>
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
                        type="button"
                        onClick={excluir}
                        disabled={carregando || salas.length > 0 || excluindo}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {excluindo ? "Excluindo..." : "Excluir"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
