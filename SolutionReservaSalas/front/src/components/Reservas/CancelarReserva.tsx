import { useState } from "react";
import { api } from "../../services/api";
import { Reserva } from "../../types/Reserva";
import { erroReserva, formatarDataHora } from "../../utils/datas";
import { Modal } from "../Modal";

interface CancelarReservaProps {
    reserva: Reserva;
    onConcluido: () => void;
    onCancelar: () => void;
}

// Cancelamento lógico: a reserva continua no banco com status "Cancelada"
export function CancelarReserva({ reserva, onConcluido, onCancelar }: CancelarReservaProps) {
    const [erro, setErro] = useState("");
    const [cancelando, setCancelando] = useState(false);

    function cancelar() {
        setErro("");
        setCancelando(true);

        api.patch(`/reservas/${reserva.id}/cancelar`)
            .then(onConcluido)
            .catch((e) => {
                setErro(erroReserva(e));
                setCancelando(false);
            });
    }

    return (
        <Modal titulo="Cancelar reserva" onFechar={onCancelar}>
            <div className="space-y-4">
                <p>
                    Tem certeza que deseja cancelar a reserva da sala{" "}
                    <strong>{reserva.sala}</strong> de{" "}
                    <strong>{formatarDataHora(reserva.inicio)}</strong> até{" "}
                    <strong>{formatarDataHora(reserva.fim)}</strong> ({reserva.responsavel})?
                </p>
                <p className="text-sm text-gray-500">
                    A reserva fica no histórico como cancelada e o horário é liberado.
                </p>

                {erro && (
                    <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{erro}</p>
                )}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancelar}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
                    >
                        Voltar
                    </button>
                    <button
                        type="button"
                        onClick={cancelar}
                        disabled={cancelando}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {cancelando ? "Cancelando..." : "Cancelar reserva"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
