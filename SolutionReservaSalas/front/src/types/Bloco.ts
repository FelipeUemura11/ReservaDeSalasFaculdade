export interface Bloco {
    id: number;
    nome: string;
    // Hexadecimal #RRGGBB, usado só no visual
    cor: string;
}

// Corpo enviado em POST/PUT /blocos (o id é gerado pela API)
export type DadosBloco = Omit<Bloco, "id">;

// Mesma cor padrão do Bloco.cs na API
export const COR_PADRAO_BLOCO = "#ED1C24";
