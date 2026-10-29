import { useState } from "react";
import { DadosSala } from "../../types/Sala";
import { Modal } from "../Modal";
import { FormSala } from "./FormSala";
import { api, mensagemErro } from "../../services/api";

interface CadastroProps {
    onConcluido: () => void;
    onCancelar: () => void;
}

export function CadastroSalas({ onConcluido, onCancelar}: CadastroProps){
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    function salvar(dados: DadosSala){
        setErro("");
        setSalvando(true);

        api.post("/salas", dados)
            .then(onConcluido)
            .catch((e) => {
                setErro(mensagemErro(e));
                setSalvando(false);
            });
    }

    return(
        <Modal titulo="Nova Sala" onFechar={onCancelar}>
            <FormSala
                textoBotao="Cadastrar"
                salvando={salvando}
                erro={erro}
                onSalvar={salvar}
                onCancelar={onCancelar}
            />
        </Modal>
    );
}