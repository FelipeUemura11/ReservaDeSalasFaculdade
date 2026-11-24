import axios from "axios";
import { mensagemErro } from "../services/api";
import { TipoSala } from "../types/Sala";

// A API trabalha com DateTime sem fuso ("2026-10-20T19:00:00").
// O <input type="datetime-local"> usa "2026-10-20T19:00", então basta cortar/completar os segundos.

// "2026-10-20T19:00:00" -> "2026-10-20T19:00" (valor do input)
export function paraInput(dataApi: string): string {
    return dataApi.slice(0, 16);
}

// "2026-10-20T19:00" -> "2026-10-20T19:00:00" (valor enviado para a API)
export function paraApi(dataInput: string): string {
    return dataInput.length === 16 ? `${dataInput}:00` : dataInput;
}

// Sem "Z" no final, o JavaScript interpreta a data no horário local, igual à API
function lerData(dataApi: string): Date {
    return new Date(dataApi);
}

// "20/10/2026 19:00"
export function formatarDataHora(dataApi: string): string {
    return lerData(dataApi).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// "19:00"
export function formatarHora(dataApi: string): string {
    return lerData(dataApi).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

// "terça-feira, 20 de outubro de 2026"
export function formatarDataExtenso(data: string): string {
    return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

// Data de hoje no formato do <input type="date"> ("2026-10-20")
export function hojeInput(): string {
    const agora = new Date();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");
    return `${agora.getFullYear()}-${mes}-${dia}`;
}

// Duração em horas entre duas datas da API (ex: 2.5)
export function duracaoHoras(inicio: string, fim: string): number {
    return (lerData(fim).getTime() - lerData(inicio).getTime()) / 3_600_000;
}

// Mostra horas como "2h" ou "2h30"
export function formatarHoras(horas: number): string {
    const inteiras = Math.floor(horas);
    const minutos = Math.round((horas - inteiras) * 60);
    if (minutos === 0) return `${inteiras}h`;
    return `${inteiras}h${String(minutos).padStart(2, "0")}`;
}

export const ROTULOS_TIPO: Record<TipoSala, string> = {
    SalaDeAula: "Sala de aula",
    Laboratorio: "Laboratório",
    Auditorio: "Auditório",
};

// Mensagem de erro com um título conforme o código HTTP devolvido pela API
export function erroReserva(erro: unknown): string {
    const mensagem = mensagemErro(erro);
    if (!axios.isAxiosError(erro) || !erro.response) return mensagem;

    switch (erro.response.status) {
        case 400:
            return `Dados inválidos: ${mensagem}`;
        case 404:
            return `Não encontrado: ${mensagem}`;
        case 409:
            return `Conflito de horário: ${mensagem}`;
        default:
            return mensagem;
    }
}
