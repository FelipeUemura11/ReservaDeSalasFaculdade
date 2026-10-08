using System.Text.Json.Serialization;

public class Sala {
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int Capacidade { get; set; }
    public TipoSala Tipo { get; set; }

    public int BlocoId { get; set; }
    public Bloco? Bloco { get; set; }

    [JsonIgnore]
    public List<Reserva> Reservas { get; set; } = new();
}