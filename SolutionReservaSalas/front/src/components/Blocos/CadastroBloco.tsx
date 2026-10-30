import { useState } from "react";
import { api, mensagemErro } from "../../services/api";
import { DadosBloco } from "../../types/Bloco";
import { Modal } from "../Modal";
import { FormBloco } from "./FormBloco";

interface CadastroBlocoProps {
    onConcluido: () => void;
    onCancelar: () => void;
}

export function CadastroBloco({ onConcluido, onCancelar }: CadastroBlocoProps) {
    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);

    function salvar(dados: DadosBloco) {
        setErro("");
        setSalvando(true);

        api.post("/blocos", dados)
            .then(onConcluido)
            .catch((e) => {
                setErro(mensagemErro(e));
                setSalvando(false);
            });
    }

    return (
        <Modal titulo="Novo bloco" onFechar={onCancelar}>
            <FormBloco
                textoBotao="Cadastrar"
                salvando={salvando}
                erro={erro}
                onSalvar={salvar}
                onCancelar={onCancelar}
            />
        </Modal>
    );
}
