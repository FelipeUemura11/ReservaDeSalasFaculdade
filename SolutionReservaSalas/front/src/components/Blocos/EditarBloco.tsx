import { useState } from "react";
import { api, mensagemErro } from "../../services/api";
import { Bloco } from "../../types/Bloco";
import { Modal } from "../Modal";
import { FormBloco } from "./FormBloco";

interface EditarBlocoProps {
    bloco: Bloco;
    onConcluido: () => void;
    onCancelar: () => void;
}

export function EditarBloco({ bloco, onConcluido, onCancelar }: EditarBlocoProps) {
    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);

    function salvar(nome: string) {
        setErro("");
        setSalvando(true);

        api.put(`/blocos/${bloco.id}`, { nome })
            .then(onConcluido)
            .catch((e) => {
                setErro(mensagemErro(e));
                setSalvando(false);
            });
    }

    return (
        <Modal titulo="Editar bloco" onFechar={onCancelar}>
            <FormBloco
                nomeInicial={bloco.nome}
                textoBotao="Salvar"
                salvando={salvando}
                erro={erro}
                onSalvar={salvar}
                onCancelar={onCancelar}
            />
        </Modal>
    );
}
