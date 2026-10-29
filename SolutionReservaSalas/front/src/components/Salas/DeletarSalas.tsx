import { useState } from "react";
import { Sala } from "../../types/Sala";
import { Modal } from "../Modal";
import { api, mensagemErro } from "../../services/api";

interface DeletarSalaProps {
    sala: Sala;
    onConcluido: () => void;
    onCancelar: () => void;
}

export function DeletarSalas({ sala, onConcluido, onCancelar }: DeletarSalaProps) {
    const [erro, setErro] = useState("");
    const [excluindo, setExcluindo] = useState(false);

    function excluir() {
        setErro("");
        setExcluindo(true);

        api.delete(`/salas/${sala.id}`)
            .then(onConcluido)
            .catch((e) => {
                setErro(mensagemErro(e));
                setExcluindo(false);
            });
    }

    return (
        <Modal titulo="Excluir sala" onFechar={onCancelar}>
            <div className="space-y-4">
                <p>
                    Tem certeza que deseja excluir a sala{" "}
                    <strong>{sala.nome}</strong> do bloco <strong>{sala.bloco}</strong>?
                </p>

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
                        disabled={excluindo}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {excluindo ? "Excluindo..." : "Excluir"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
