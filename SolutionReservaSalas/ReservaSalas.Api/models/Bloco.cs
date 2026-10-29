using System.Text.Json.Serialization;

public class Bloco
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;

    // Cor em hexadecimal (#RRGGBB), usada só no visual do front
    public string Cor { get; set; } = CorPadrao;

    public const string CorPadrao = "#ED1C24";

    [JsonIgnore]
    public List<Sala> Salas { get; set; } = new();
}