using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDataContext>();

// Por padrão quando a API converte objeto em JSON, enum altera para numeros
// Aqui ele esta convertendo esses numeros para texto
//  { "id": 1, "nome": "Lab 3", "tipo": 1 }
//  { "id": 1, "nome": "Lab 3", "tipo": "Laboratorio" } <<<<<<<<
builder.Services.ConfigureHttpJsonOptions(o =>
    o.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

var app = builder.Build();

app.MapBlocoEndpoints();

app.Run();
