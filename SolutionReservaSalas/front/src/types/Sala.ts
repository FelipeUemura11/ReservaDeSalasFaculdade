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

// Corpo enviado em POST/PUT /salas (id e nome do bloco são gerados pela API)
export type DadosSala = Omit<Sala, "id" | "bloco">;
