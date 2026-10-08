using Microsoft.EntityFrameworkCore;

public class AppDataContext : DbContext
{
    public DbSet<Bloco> Blocos { get; set; }
    public DbSet<Sala> Salas { get; set; }
    public DbSet<Reserva> Reservas { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=reservas.db");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Sala>()
            .HasOne(s => s.Bloco)
            .WithMany(b => b.Salas)
            .HasForeignKey(s => s.BlocoId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Reserva>()
            .HasOne(r => r.Sala)
            .WithMany(s => s.Reservas)
            .HasForeignKey(r => r.SalaId)
            .OnDelete(DeleteBehavior.Restrict);

        // Salva os enums como texto ("Laboratorio") em vez de número (1)
        modelBuilder.Entity<Sala>().Property(s => s.Tipo).HasConversion<string>();
        modelBuilder.Entity<Reserva>().Property(r => r.Status).HasConversion<string>();
    }
}
