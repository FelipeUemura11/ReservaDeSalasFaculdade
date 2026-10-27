export type TipoSala = "SalaDeAula" | "Laboratorio" | "Auditorio";

// Formato retornado por GET /salas (o bloco vem só com o nome)
export interface Sala {
    id: number;
    nome: string;
    capacidade: number;
    tipo: TipoSala;
    blocoId: number;
    bloco: string;
}
