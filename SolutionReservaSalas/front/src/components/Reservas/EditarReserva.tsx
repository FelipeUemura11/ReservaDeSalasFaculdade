import { useState } from "react";
import { api } from "../../services/api";
import { DadosReserva, Reserva } from "../../types/Reserva";
import { erroReserva } from "../../utils/datas";
import { Modal } from "../Modal";
import { FormReserva } from "./FormReserva";

interface EditarReservaProps {
    reserva: Reserva;
    onConcluido: () => void;
    onCancelar: () => void;
}

export function EditarReserva({ reserva, onConcluido, onCancelar }: EditarReservaProps) {
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    function salvar(dados: DadosReserva) {
        setErro("");
        setSalvando(true);

        api.put(`/reservas/${reserva.id}`, dados)
            .then(onConcluido)
            .catch((e) => {
                setErro(erroReserva(e));
                setSalvando(false);
            });
    }

    return (
        <Modal titulo="Editar reserva" onFechar={onCancelar}>
            <FormReserva
                reservaInicial={reserva}
                textoBotao="Salvar"
                salvando={salvando}
                erro={erro}
                onSalvar={salvar}
                onCancelar={onCancelar}
            />
        </Modal>
    );
}
