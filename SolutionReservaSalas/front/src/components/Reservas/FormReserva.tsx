import { FormEvent, useEffect, useState } from "react";
import { api, mensagemErro } from "../../services/api";
import { DadosReserva } from "../../types/Reserva";
import { Sala } from "../../types/Sala";
import { paraApi, paraInput } from "../../utils/datas";

interface FormReservaProps {
    // Valores já preenchidos (edição ou reserva a partir de Salas Livres)
    reservaInicial?: Partial<DadosReserva>;
    textoBotao: string;
    salvando: boolean;
    erro: string;
    onSalvar: (dados: DadosReserva) => void;
    onCancelar: () => void;
}

const classeCampo =
    "w-full rounded-md border border-gray-300 px-3 py-2 focus:border-secondary focus:outline-none";
const classeRotulo = "mb-1 block text-sm font-medium";

// Formulário compartilhado entre a criação e a edição de reservas.
// As regras (horário, capacidade e conflito) são validadas pela API,
// e o erro devolvido (400, 404 ou 409) aparece no fim do formulário.
export function FormReserva({
    reservaInicial,
    textoBotao,
    salvando,
    erro,
    onSalvar,
    onCancelar,
}: FormReservaProps) {
    const [salaId, setSalaId] = useState(
        reservaInicial?.salaId ? String(reservaInicial.salaId) : "",
    );
    const [responsavel, setResponsavel] = useState(reservaInicial?.responsavel ?? "");
    const [motivo, setMotivo] = useState(reservaInicial?.motivo ?? "");
    const [quantidade, setQuantidade] = useState(
        reservaInicial?.quantidadePessoas ? String(reservaInicial.quantidadePessoas) : "",
    );
    const [inicio, setInicio] = useState(
        reservaInicial?.inicio ? paraInput(reservaInicial.inicio) : "",
    );
    const [fim, setFim] = useState(reservaInicial?.fim ? paraInput(reservaInicial.fim) : "");

    const [salas, setSalas] = useState<Sala[]>([]);
    const [carregandoSalas, setCarregandoSalas] = useState(true);
    const [erroSalas, setErroSalas] = useState("");

    useEffect(() => {
        api.get<Sala[]>("/salas")
            .then((resposta) => setSalas(resposta.data))
            .catch((e) => setErroSalas(mensagemErro(e)))
            .finally(() => setCarregandoSalas(false));
    }, []);

    const salaSelecionada = salas.find((s) => s.id === Number(salaId));

    function enviar(e: FormEvent) {
        e.preventDefault();
        onSalvar({
            salaId: Number(salaId),
            responsavel,
            motivo,
            quantidadePessoas: Number(quantidade),
            inicio: paraApi(inicio),
            fim: paraApi(fim),
        });
    }

    return (
        <form onSubmit={enviar} className="space-y-4">
            <div>
                <label htmlFor="salaId" className={classeRotulo}>
                    Sala
                </label>
                <select
                    id="salaId"
                    value={salaId}
                    onChange={(e) => setSalaId(e.target.value)}
                    className={classeCampo}
                    disabled={carregandoSalas}
                    required
                >
                    <option value="" disabled>
                        {carregandoSalas ? "Carregando salas..." : "Selecione uma sala"}
                    </option>
                    {salas.map((sala) => (
                        <option key={sala.id} value={sala.id}>
                            {sala.nome} · {sala.bloco} ({sala.capacidade} lugares)
                        </option>
                    ))}
                </select>
                {!carregandoSalas && !erroSalas && salas.length === 0 && (
                    <p className="mt-1 text-sm text-gray-500">
                        Nenhuma sala cadastrada. Cadastre uma sala antes de reservar.
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="responsavel" className={classeRotulo}>
                    Responsável
                </label>
                <input
                    type="text"
                    id="responsavel"
                    value={responsavel}
                    onChange={(e) => setResponsavel(e.target.value)}
                    placeholder="Ex: Prof. Diogo"
                    className={classeCampo}
                    required
                />
            </div>

            <div>
                <label htmlFor="motivo" className={classeRotulo}>
                    Motivo
                </label>
                <input
                    type="text"
                    id="motivo"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Ex: Aula de Banco de Dados"
                    className={classeCampo}
                    required
                />
            </div>

            <div>
                <label htmlFor="quantidade" className={classeRotulo}>
                    Quantidade de pessoas
                </label>
                <input
                    type="number"
                    id="quantidade"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    placeholder="Ex: 30"
                    min={1}
                    className={classeCampo}
                    required
                />
                {salaSelecionada && (
                    <p className="mt-1 text-sm text-gray-500">
                        Capacidade da sala: {salaSelecionada.capacidade} pessoas
                    </p>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="inicio" className={classeRotulo}>
                        Início
                    </label>
                    <input
                        type="datetime-local"
                        id="inicio"
                        value={inicio}
                        onChange={(e) => setInicio(e.target.value)}
                        className={classeCampo}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="fim" className={classeRotulo}>
                        Fim
                    </label>
                    <input
                        type="datetime-local"
                        id="fim"
                        value={fim}
                        onChange={(e) => setFim(e.target.value)}
                        className={classeCampo}
                        required
                    />
                </div>
            </div>

            {erroSalas && (
                <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{erroSalas}</p>
            )}

            {erro && (
                <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{erro}</p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancelar}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={salvando}
                    className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-primary disabled:opacity-60"
                >
                    {salvando ? "Salvando..." : textoBotao}
                </button>
            </div>
        </form>
    );
}
