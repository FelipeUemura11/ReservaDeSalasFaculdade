import { useEffect, useState } from "react";
import { api, mensagemErro } from "../services/api";
import { OcupacaoSala } from "../types/Reserva";
import { formatarHoras } from "../utils/datas";

export function Relatorio() {
    const [linhas, setLinhas] = useState<OcupacaoSala[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        api.get<OcupacaoSala[]>("/relatorios/ocupacao")
            .then((resposta) => setLinhas(resposta.data))
            .catch((e) => setErro(mensagemErro(e)))
            .finally(() => setCarregando(false));
    }, []);

    // A API já devolve ordenado da sala mais usada para a menos usada
    const maiorHoras = Math.max(...linhas.map((l) => l.horasReservadas), 0);
    const totalReservas = linhas.reduce((soma, l) => soma + l.totalReservas, 0);
    const totalHoras = linhas.reduce((soma, l) => soma + l.horasReservadas, 0);

    return (
        <section>
            <h1 className="mb-6 text-4xl font-bold text-white">Relatório de ocupação</h1>

            {carregando && <p className="text-white">Carregando...</p>}

            {erro && <p className="rounded-md bg-red-50 p-3 text-red-700">{erro}</p>}

            {!carregando && !erro && linhas.length === 0 && (
                <p className="text-white">Nenhuma sala cadastrada.</p>
            )}

            {linhas.length > 0 && (
                <>
                    <div className="mb-6 grid gap-4 sm:grid-cols-3">
                        <Resumo rotulo="Salas" valor={String(linhas.length)} />
                        <Resumo rotulo="Reservas ativas" valor={String(totalReservas)} />
                        <Resumo rotulo="Horas reservadas" valor={formatarHoras(totalHoras)} />
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100 text-gray-600">
                                <tr>
                                    <th className="px-4 py-3 font-medium">#</th>
                                    <th className="px-4 py-3 font-medium">Sala</th>
                                    <th className="px-4 py-3 font-medium">Bloco</th>
                                    <th className="px-4 py-3 text-right font-medium">Reservas</th>
                                    <th className="px-4 py-3 font-medium">Horas reservadas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {linhas.map((linha, i) => (
                                    <tr key={linha.salaId} className="border-t border-gray-100">
                                        <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                                        <td className="px-4 py-3 font-medium">{linha.sala}</td>
                                        <td className="px-4 py-3">{linha.bloco}</td>
                                        <td className="px-4 py-3 text-right">
                                            {linha.totalReservas}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-3 w-40 overflow-hidden rounded-full bg-third">
                                                    <div
                                                        className="h-full rounded-full bg-secondary"
                                                        style={{
                                                            width:
                                                                maiorHoras > 0
                                                                    ? `${(linha.horasReservadas / maiorHoras) * 100}%`
                                                                    : "0%",
                                                        }}
                                                    />
                                                </div>
                                                <span className="whitespace-nowrap">
                                                    {formatarHoras(linha.horasReservadas)}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </section>
    );
}

function Resumo({ rotulo, valor }: { rotulo: string; valor: string }) {
    return (
        <div className="rounded-br-[2rem] rounded-tl-[2rem] border border-gray-200 bg-white px-4 py-3 text-center shadow-[8px_8px_1px_-1px_var(--secondary)]">
            <p className="text-sm text-gray-600">{rotulo}</p>
            <p className="text-3xl font-bold text-primary">{valor}</p>
        </div>
    );
}
