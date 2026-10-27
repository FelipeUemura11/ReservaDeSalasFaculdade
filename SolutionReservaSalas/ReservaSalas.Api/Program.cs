using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDataContext>();

// Por padrão quando a API converte objeto em JSON, enum altera para numeros
// Aqui ele esta convertendo esses numeros para texto
//  { "id": 1, "nome": "Lab 3", "tipo": 1 }
//  { "id": 1, "nome": "Lab 3", "tipo": "Laboratorio" } <<<<<<<<
builder.Services.ConfigureHttpJsonOptions(o =>
    o.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// Swagger: tela no navegador para testar os endpoints (http://localhost:5220/swagger)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// O Swagger lê essa configuração para mostrar os enums como texto também
builder.Services.Configure<Microsoft.AspNetCore.Mvc.JsonOptions>(o =>
    o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// CORS: permite que o front (React, http://localhost:3000) chame a API
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseCors();

app.UseSwagger();
app.UseSwaggerUI();

app.MapBlocoEndpoints();
app.MapSalaEndpoints();
app.MapReservaEndpoints();
app.MapRelatorioEndpoints();

app.Run();
