import { useState } from "react";
import { DadosSala, Sala } from "../../types/Sala";
import { Modal } from "../Modal";
import { FormSala } from "./FormSala";
import { api, mensagemErro } from "../../services/api";

interface EditarSalaProps {
    sala: Sala;
    onConcluido: () => void;
    onCancelar: () => void;
}

export function EditarSalas({ sala, onConcluido, onCancelar }:EditarSalaProps){
    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);

    function salvar(dados: DadosSala){
        setErro("");
        setSalvando(true);

        api.put(`/salas/${sala.id}`, dados)
            .then(onConcluido)
            .catch((e) => {
                setErro(mensagemErro(e));
                setSalvando(false);
            });
    }

    return(
        <Modal titulo="Editar sala" onFechar={onCancelar}>
            <FormSala 
                salaInicial={sala}
                textoBotao="Salvar"
                salvando={salvando}
                erro={erro}
                onSalvar={salvar}
                onCancelar={onCancelar}
            />
        </Modal>
    );
}