import { useState } from "react";
import { api } from "../../services/api";
import { DadosReserva } from "../../types/Reserva";
import { erroReserva } from "../../utils/datas";
import { Modal } from "../Modal";
import { FormReserva } from "./FormReserva";

interface CadastroReservaProps {
    // Usado pela tela de Salas Livres para já trazer sala e período preenchidos
    valoresIniciais?: Partial<DadosReserva>;
    onConcluido: () => void;
    onCancelar: () => void;
}

export function CadastroReserva({ valoresIniciais, onConcluido, onCancelar }: CadastroReservaProps) {
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    function salvar(dados: DadosReserva) {
        setErro("");
        setSalvando(true);

        api.post("/reservas", dados)
            .then(onConcluido)
            .catch((e) => {
                setErro(erroReserva(e));
                setSalvando(false);
            });
    }

    return (
        <Modal titulo="Nova reserva" onFechar={onCancelar}>
            <FormReserva
                reservaInicial={valoresIniciais}
                textoBotao="Reservar"
                salvando={salvando}
                erro={erro}
                onSalvar={salvar}
                onCancelar={onCancelar}
            />
        </Modal>
    );
}
