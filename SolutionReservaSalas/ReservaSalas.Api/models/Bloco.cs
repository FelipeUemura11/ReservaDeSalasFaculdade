using System.Text.Json.Serialization;

public class Bloco
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;

    [JsonIgnore]
    public List<Sala> Salas { get; set; } = new();
}