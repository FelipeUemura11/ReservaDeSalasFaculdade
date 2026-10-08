public static class BlocoEndpoints
{
    public static void MapBlocoEndpoints(this WebApplication app)
    {
        var grupo = app.MapGroup("/blocos");

        // POST CADASTRO BLOCOS
        grupo.MapPost("/", (Bloco bloco, AppDataContext ctx) =>
        {
            if (string.IsNullOrWhiteSpace(bloco.Nome))
                return Results.BadRequest("O nome do bloco é obrigatório.");   

            ctx.Blocos.Add(bloco);
            ctx.SaveChanges();
            return Results.Created($"/blocos/{bloco.Id}", bloco);
        });

        // GET LISTA BLOCOS
        grupo.MapGet("/", (AppDataContext ctx) => 
        {
            return Results.Ok(ctx.Blocos.ToList());
        });

        // GET BUSCAR BLOCOS
        grupo.MapGet("/{id:int}", (int id, AppDataContext ctx) =>
        {
            var bloco = ctx.Blocos.Find(id);
            if(bloco is null)
                return Results.NotFound("Bloco não encontrado");

            return Results.Ok(bloco);
        });

        // PUT ATUALIZAR BLOCOS
        grupo.MapPut("/{id:int}", (int id, AppDataContext ctx, Bloco blocoAtt) =>
        {
            var bloco = ctx.Blocos.Find(id);

            if(bloco is null)
                return Results.NotFound("Bloco não encontrado");

            if(string.IsNullOrWhiteSpace(blocoAtt.Nome))
                return Results.BadRequest("O nome do bloco é obrigatório.");

            bloco.Nome = blocoAtt.Nome;
            ctx.SaveChanges();

            return Results.Ok(bloco); 
        });

        // DELETE /blocos/{id}
        grupo.MapDelete("/{id:int}", (int id, AppDataContext ctx) =>
        {
            var bloco = ctx.Blocos.Find(id);
            if (bloco is null)
                return Results.NotFound("Bloco não encontrado.");

            if (ctx.Salas.Any(s => s.BlocoId == id))
                return Results.Conflict("Não é possível excluir um bloco que possui salas.");

            ctx.Blocos.Remove(bloco);
            ctx.SaveChanges();
            return Results.NoContent();
        });
    }
}