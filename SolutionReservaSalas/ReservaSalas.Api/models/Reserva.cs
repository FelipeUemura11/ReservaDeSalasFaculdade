public class Reserva
{
    public int Id { get; set; }

    public int SalaId { get; set; }
    public Sala? Sala { get; set; }

    public string Responsavel { get; set; } = string.Empty;
    public string Motivo { get; set; } = string.Empty;
    public int QuantidadePessoas { get; set; }

    public DateTime Inicio { get; set; }
    public DateTime Fim { get; set; }
    
    public StatusReserva Status { get; set; } = StatusReserva.Ativa;
}