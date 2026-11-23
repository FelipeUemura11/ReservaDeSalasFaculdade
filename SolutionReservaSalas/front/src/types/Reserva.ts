import { TipoSala } from "./Sala";

export type StatusReserva = "Ativa" | "Cancelada";

// Formato retornado por GET /reservas (a sala vem só com o nome)
export interface Reserva {
    id: number;
    salaId: number;
    sala: string;
    responsavel: string;
    motivo: string;
    quantidadePessoas: number;
    // Datas no formato "2026-10-20T19:00:00", sem fuso horário
    inicio: string;
    fim: string;
    status: StatusReserva;
}

// Corpo enviado em POST/PUT /reservas (id, nome da sala e status são da API)
export type DadosReserva = Omit<Reserva, "id" | "sala" | "status">;

// Formato retornado por GET /salas/{id}/agenda?data=
export interface AgendaSala {
    sala: string;
    data: string;
    reservas: Omit<Reserva, "salaId" | "sala" | "status">[];
}

// Formato retornado por GET /salas/livres
export interface SalaLivre {
    id: number;
    nome: string;
    capacidade: number;
    tipo: TipoSala;
    blocoId: number;
    bloco: string;
}

// Formato retornado por GET /relatorios/ocupacao
export interface OcupacaoSala {
    salaId: number;
    sala: string;
    bloco: string;
    totalReservas: number;
    horasReservadas: number;
}
