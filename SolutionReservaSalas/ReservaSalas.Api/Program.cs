var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDataContext>();
var app = builder.Build();

// POST criar bloco
app.MapPost("/blocos", (Bloco bloco, AppDataContext ctx) =>
{
    if (string.IsNullOrWhiteSpace(bloco.Nome))
        return Results.BadRequest("O nome do bloco é obrigatório.");   

    ctx.Blocos.Add(bloco);
    ctx.SaveChanges();
    return Results.Created($"/blocos/{bloco.Id}", bloco);
});

// GET listar blocos
app.MapGet("/blocos", (AppDataContext ctx) =>
{
    return Results.Ok(ctx.Blocos.ToList());
});

// GET buscar bloco
app.MapGet("/blocos/{id}", (int id, AppDataContext ctx) =>
{
    var bloco = ctx.Blocos.Find(id);
    if(bloco is null)
        return Results.NotFound("Bloco não encontrado");

    return Results.Ok(bloco);
});

// PUT atualiza bloco
app.MapPut("/blocos/{id}", (int id, AppDataContext ctx, Bloco blocoAtt) =>
{
    var bloco = ctx.Blocos.Find(id);

    if(bloco is null)
        return Results.NotFound("Bloco não encontrado");

    if (string.IsNullOrWhiteSpace(bloco.Nome))
        return Results.BadRequest("O nome do bloco é obrigatório.");

    bloco.Nome = blocoAtt.Nome;
    ctx.SaveChanges();

    return Results.Ok(bloco);
});

app.MapDelete("/blocos/{id}", (int id, AppDataContext ctx) =>
{
    var bloco = ctx.Blocos.Find(id);

    if(bloco is null)
        return Results.NotFound("Bloco não encontrado.");

    if(ctx.Salas.Any(s => s.BlocoId == id))
        return Results.Conflict("Não é possivel excluir um bloco que possui salas.");
    
    ctx.Blocos.Remove(bloco);
    ctx.SaveChanges();
    
    return Results.NoContent();
});

app.Run();
