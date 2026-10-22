public static class RelatorioEndpoints
{
    public static void MapRelatorioEndpoints(this WebApplication app)
    {
        var grupo = app.MapGroup("/relatorios");

        // GET /relatorios/ocupacao - total de reservas e horas reservadas por sala
        grupo.MapGet("/ocupacao", (AppDataContext ctx) =>
        {
            var salas = ctx.Salas
                .Select(s => new
                {
                    s.Id,
                    s.Nome,
                    Bloco = s.Bloco!.Nome,
                    Reservas = s.Reservas
                        .Where(r => r.Status == StatusReserva.Ativa)
                        .Select(r => new { r.Inicio, r.Fim })
                        .ToList()
                })
                .ToList();

            // o SQLite não sabe subtrair datas, então o cálculo das horas é feito em memória
            var relatorio = salas
                .Select(s => new
                {
                    SalaId = s.Id,
                    Sala = s.Nome,
                    s.Bloco,
                    TotalReservas = s.Reservas.Count,
                    HorasReservadas = Math.Round(s.Reservas.Sum(r => (r.Fim - r.Inicio).TotalHours), 2)
                })
                .OrderByDescending(r => r.HorasReservadas)
                .ThenByDescending(r => r.TotalReservas)
                .ToList();

            return Results.Ok(relatorio);
        });
    }
}
