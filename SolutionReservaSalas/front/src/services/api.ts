import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:5220",
});

// A API devolve as mensagens de erro como texto (ex: "Bloco não encontrado")
export function mensagemErro(erro: unknown): string {
    if (axios.isAxiosError(erro)) {
        if (typeof erro.response?.data === "string" && erro.response.data) {
            return erro.response.data;
        }
        if (!erro.response) {
            return "Não foi possível conectar à API. Verifique se ela está rodando.";
        }
    }
    return "Ocorreu um erro inesperado.";
}
