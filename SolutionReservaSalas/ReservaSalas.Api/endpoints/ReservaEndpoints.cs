public static class ReservaEndpoints
{
    public static void MapReservaEndpoints(this WebApplication app)
    {
        var grupo = app.MapGroup("/reservas");

        // GET /reservas - lista todas as reservas com o nome da sala
        grupo.MapGet("/", (AppDataContext ctx) =>
        {
            var reservas = ctx.Reservas
                .OrderBy(r => r.Inicio)
                .Select(r => new
                {
                    r.Id,
                    r.SalaId,
                    Sala = r.Sala!.Nome,
                    r.Responsavel,
                    r.Motivo,
                    r.QuantidadePessoas,
                    r.Inicio,
                    r.Fim,
                    r.Status
                })
                .ToList();

            return Results.Ok(reservas);
        });

        // GET /reservas/{id}
        grupo.MapGet("/{id:int}", (int id, AppDataContext ctx) =>
        {
            var reserva = ctx.Reservas
                .Where(r => r.Id == id)
                .Select(r => new
                {
                    r.Id,
                    r.SalaId,
                    Sala = r.Sala!.Nome,
                    r.Responsavel,
                    r.Motivo,
                    r.QuantidadePessoas,
                    r.Inicio,
                    r.Fim,
                    r.Status
                })
                .FirstOrDefault();

            if (reserva is null)
                return Results.NotFound("Reserva não encontrada.");

            return Results.Ok(reserva);
        });

        // POST /reservas - cria uma reserva validando horário, capacidade e conflito
        grupo.MapPost("/", (Reserva reserva, AppDataContext ctx) =>
        {
            var erro = ValidarReserva(reserva, ctx);
            if (erro is not null)
                return erro;

            reserva.Status = StatusReserva.Ativa;
            ctx.Reservas.Add(reserva);
            ctx.SaveChanges();
            return Results.Created($"/reservas/{reserva.Id}", reserva);
        });
    }

    // Regras de negócio da reserva. Retorna null quando está tudo certo.
    private static IResult? ValidarReserva(Reserva reserva, AppDataContext ctx, int ignorarId = 0)
    {
        if (reserva.Inicio >= reserva.Fim)
            return Results.BadRequest("O horário de início deve ser anterior ao de término.");

        if (reserva.QuantidadePessoas <= 0)
            return Results.BadRequest("A quantidade de pessoas deve ser maior que zero.");

        var sala = ctx.Salas.Find(reserva.SalaId);
        if (sala is null)
            return Results.NotFound("Sala não encontrada.");

        if (reserva.QuantidadePessoas > sala.Capacidade)
            return Results.BadRequest($"A sala {sala.Nome} comporta no máximo {sala.Capacidade} pessoas.");

        // Duas reservas se sobrepõem quando: existente.Inicio < nova.Fim E nova.Inicio < existente.Fim
        var conflito = ctx.Reservas
            .Where(r => r.SalaId == reserva.SalaId
                     && r.Status == StatusReserva.Ativa
                     && r.Id != ignorarId
                     && r.Inicio < reserva.Fim
                     && reserva.Inicio < r.Fim)
            .FirstOrDefault();

        if (conflito is not null)
            return Results.Conflict(
                $"A sala {sala.Nome} já está reservada de {conflito.Inicio:dd/MM HH:mm} até {conflito.Fim:dd/MM HH:mm} ({conflito.Responsavel}).");

        return null;
    }
}
