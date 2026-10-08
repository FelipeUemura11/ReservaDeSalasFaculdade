public static class SalaEndpoints
{
    public static void MapSalaEndpoints(this WebApplication app)
    {
        var grupo = app.MapGroup("/salas");

        // POST /salas
        grupo.MapPost("/", (Sala sala, AppDataContext ctx) =>
        {
            if (string.IsNullOrWhiteSpace(sala.Nome))
                return Results.BadRequest("O nome da sala é obrigatório.");

            if (sala.Capacidade <= 0)
                return Results.BadRequest("A capacidade deve ser maior que zero.");

            if (!Enum.IsDefined(sala.Tipo))
                return Results.BadRequest("Tipo de sala inválido.");

            if (!ctx.Blocos.Any(b => b.Id == sala.BlocoId))
                return Results.NotFound("Bloco não encontrado.");

            ctx.Salas.Add(sala);
            ctx.SaveChanges();
            return Results.Created($"/salas/{sala.Id}", sala);
        });

        // GET /salas - lista com o nome do bloco
        grupo.MapGet("/", (AppDataContext ctx) =>
        {
            var salas = ctx.Salas
                .Select(s => new
                {
                    s.Id,
                    s.Nome,
                    s.Capacidade,
                    s.Tipo,
                    s.BlocoId,
                    Bloco = s.Bloco!.Nome
                })
                .ToList();

            return Results.Ok(salas);
        });

        // GET /salas/{id}
        grupo.MapGet("/{id:int}", (int id, AppDataContext ctx) =>
        {
            var sala = ctx.Salas
                .Where(s => s.Id == id)
                .Select(s => new
                {
                    s.Id,
                    s.Nome,
                    s.Capacidade,
                    s.Tipo,
                    s.BlocoId,
                    Bloco = s.Bloco!.Nome
                })
                .FirstOrDefault();

            if (sala is null)
                return Results.NotFound("Sala não encontrada.");

            return Results.Ok(sala);
        });

        // PUT /salas/{id}
        grupo.MapPut("/{id:int}", (int id, Sala salaAtt, AppDataContext ctx) =>
        {
            var sala = ctx.Salas.Find(id);
            if (sala is null)
                return Results.NotFound("Sala não encontrada.");

            if (string.IsNullOrWhiteSpace(salaAtt.Nome))
                return Results.BadRequest("O nome da sala é obrigatório.");

            if (salaAtt.Capacidade <= 0)
                return Results.BadRequest("A capacidade deve ser maior que zero.");

            if (!Enum.IsDefined(salaAtt.Tipo))
                return Results.BadRequest("Tipo de sala inválido.");

            if (!ctx.Blocos.Any(b => b.Id == salaAtt.BlocoId))
                return Results.NotFound("Bloco não encontrado.");

            sala.Nome = salaAtt.Nome;
            sala.Capacidade = salaAtt.Capacidade;
            sala.Tipo = salaAtt.Tipo;
            sala.BlocoId = salaAtt.BlocoId;
            ctx.SaveChanges();
            return Results.Ok(sala);
        });

        // DELETE /salas/{id}
        grupo.MapDelete("/{id:int}", (int id, AppDataContext ctx) =>
        {
            var sala = ctx.Salas.Find(id);
            if (sala is null)
                return Results.NotFound("Sala não encontrada.");

            if (ctx.Reservas.Any(r => r.SalaId == id))
                return Results.Conflict("Não é possível excluir uma sala que possui reservas.");

            ctx.Salas.Remove(sala);
            ctx.SaveChanges();
            return Results.NoContent();
        });

        // GET /salas/livres e GET /salas/{id}/agenda ficam aqui também (parte do Rafael)
    }
}