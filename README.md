# 🏫 ReservaSalas API

> API REST para gerenciamento de reservas de salas, laboratórios e auditórios da faculdade, com prevenção automática de conflitos de horário.

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)
![C#](https://img.shields.io/badge/C%23-Minimal%20API-239120?logo=csharp)
![EF Core](https://img.shields.io/badge/EF%20Core-8.0-6C3483)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite)

---

## 📌 Identificação do Projeto

| | |
|---|---|
| **Título** | ReservaSalas API: Sistema de Reserva de Salas e Laboratórios |
| **Disciplina** | Desenvolvimento de Software Visual |
| **Curso** | Ciência da Computação |
| **Instituição** | Universidade Positivo |
| **Semestre** | 2026.02 |

### 👥 Integrantes

| Nome completo | GitHub |
|---|---|
| `Felipe Yukiya Soares Uemura` | [@FelipeUemura11](https://github.com/FelipeUemura11) |
| `Rafael Seidi Yamashiro Sato` | [@sato3605](https://github.com/sato3605) |

---

## 📝 Resumo

O **ReservaSalas API** é um sistema back-end desenvolvido em C# com .NET 8 (Minimal API), Entity Framework Core e SQLite. Ele organiza o uso dos espaços físicos de uma instituição de ensino. É comum dois professores marcarem a mesma sala no mesmo horário ou um laboratório ficar ocioso sem que ninguém saiba que está livre. O sistema resolve isso com o cadastro de blocos e salas e com reservas em horários definidos. A cada nova reserva, a API valida automaticamente se o período conflita com outra reserva ativa e se a capacidade da sala comporta o número de pessoas informado. A API também permite consultar quais salas estão livres em um intervalo de tempo, ver a agenda diária de cada sala e gerar um relatório de ocupação, transformando os dados cadastrados em informação útil para a gestão dos espaços.

---

## ✨ Funcionalidades

- 🏢 **Gerenciamento de Blocos:** cadastro, listagem, edição e exclusão de blocos/prédios
- 🚪 **Gerenciamento de Salas:** CRUD completo de salas vinculadas a um bloco, com tipo e capacidade
- 📅 **Criação de Reservas:** agendamento de uma sala com responsável, motivo, número de pessoas e período
- ⛔ **Prevenção de Conflitos:** bloqueio automático de reservas com horários sobrepostos na mesma sala
- 👥 **Validação de Capacidade:** impede reservas com mais pessoas do que a sala comporta
- ❌ **Cancelamento de Reservas:** cancelamento lógico que preserva o histórico
- 🔍 **Busca de Salas Livres:** consulta das salas disponíveis em um período, com filtro de capacidade mínima
- 🗓️ **Agenda da Sala:** visualização das reservas de uma sala em uma data específica
- 📊 **Relatório de Ocupação:** total de reservas e horas reservadas por sala
- 🔒 **Integridade dos Dados:** impede excluir blocos com salas ou salas com reservas

---

## 📖 Descrição das Funcionalidades

### 🏢 Gerenciamento de Blocos
Os blocos representam os prédios ou alas da instituição (ex: "Bloco Azul", "Bloco B"). São a base da hierarquia do sistema, porque toda sala pertence a um bloco. A API permite criar, listar, buscar por ID, editar e excluir blocos. Um bloco que ainda possui salas não pode ser excluído, o que evita salas órfãs no banco.

### 🚪 Gerenciamento de Salas
Esta é a entidade com **CRUD completo**. Cada sala tem nome, capacidade máxima de pessoas e tipo (`SalaDeAula`, `Laboratorio` ou `Auditorio`), e está obrigatoriamente vinculada a um bloco já cadastrado (**relacionamento 1:N** via chave estrangeira `BlocoId`). Na listagem, cada sala aparece com o nome do seu bloco. Uma sala com reservas registradas não pode ser excluída.

### 📅 Criação de Reservas
Para reservar, o usuário informa a sala, o responsável, o motivo (ex: "Aula de Banco de Dados"), a quantidade de pessoas e o horário de início e fim. Antes de salvar, a API executa uma série de validações:

1. O horário de início deve ser anterior ao de término.
2. A sala informada precisa existir.
3. A quantidade de pessoas não pode exceder a capacidade da sala.
4. Não pode haver conflito com outra reserva ativa da mesma sala.

Se todas passarem, a reserva é criada com status `Ativa` e a API retorna `201 Created`.

### ⛔ Prevenção de Conflitos de Horário
É a principal regra de negócio do sistema. Duas reservas se sobrepõem quando:

```
reservaExistente.Inicio < novaReserva.Fim  E  novaReserva.Inicio < reservaExistente.Fim
```

A fórmula cobre todos os casos de sobreposição: parcial no início, parcial no fim, uma reserva dentro da outra e horários idênticos. Ao mesmo tempo, permite reservas "encostadas" (uma termina às 10h e a outra começa às 10h). Quando há conflito, a API retorna `409 Conflict`. A mesma checagem vale na edição de reservas, ignorando a própria reserva que está sendo alterada.

### 👥 Validação de Capacidade
Se a quantidade de pessoas informada for maior que a capacidade da sala, a reserva é recusada com `400 Bad Request` e uma mensagem informando o limite da sala.

### ❌ Cancelamento de Reservas
Em vez de apagar a reserva do banco, o endpoint de cancelamento muda seu status para `Cancelada`. Isso preserva o histórico de uso e libera o horário para novas reservas, já que reservas canceladas são ignoradas na verificação de conflitos.

### 🔍 Busca de Salas Livres
O usuário informa um período (`inicio` e `fim`) e, opcionalmente, uma capacidade mínima. A API retorna as salas que **não** possuem nenhuma reserva ativa sobreposta àquele período, com nome, capacidade, tipo e bloco. É útil, por exemplo, para encontrar um laboratório livre para 30 alunos na quinta à noite.

### 🗓️ Agenda da Sala
Dada uma sala e uma data, a API lista todas as reservas ativas daquele dia em ordem cronológica, mostrando os horários ocupados.

### 📊 Relatório de Ocupação
Agrupa as reservas ativas por sala e calcula o total de reservas e de horas reservadas de cada uma, ordenando da mais utilizada para a menos utilizada. O relatório ajuda a identificar espaços sobrecarregados ou subutilizados.

### 🔒 Integridade dos Dados
Os relacionamentos usam `DeleteBehavior.Restrict` no Entity Framework. Assim, não é possível excluir um bloco que tem salas ou uma sala que tem reservas, o que garante a consistência do banco.

---

## 🗂️ Modelo de Dados

```
┌──────────────┐        ┌───────────────────┐        ┌──────────────────────┐
│    Bloco     │        │       Sala        │        │       Reserva        │
├──────────────┤        ├───────────────────┤        ├──────────────────────┤
│ Id (PK)      │ 1    N │ Id (PK)           │ 1    N │ Id (PK)              │
│ Nome         │───────<│ Nome              │───────<│ SalaId (FK)          │
└──────────────┘        │ Capacidade        │        │ Responsavel          │
                        │ Tipo              │        │ Motivo               │
                        │ BlocoId (FK)      │        │ QuantidadePessoas    │
                        └───────────────────┘        │ Inicio               │
                                                     │ Fim                  │
                                                     │ Status               │
                                                     └──────────────────────┘
```

**Enums:**
- `TipoSala`: `SalaDeAula`, `Laboratorio`, `Auditorio`
- `StatusReserva`: `Ativa`, `Cancelada`

---

## 🔗 Endpoints da API

### Blocos
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/blocos` | Lista todos os blocos |
| `GET` | `/blocos/{id}` | Busca um bloco por ID |
| `POST` | `/blocos` | Cadastra um bloco |
| `PUT` | `/blocos/{id}` | Atualiza um bloco |
| `DELETE` | `/blocos/{id}` | Remove um bloco (se não tiver salas) |

### Salas
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/salas` | Lista todas as salas com seus blocos |
| `GET` | `/salas/{id}` | Busca uma sala por ID |
| `POST` | `/salas` | Cadastra uma sala |
| `PUT` | `/salas/{id}` | Atualiza uma sala |
| `DELETE` | `/salas/{id}` | Remove uma sala (se não tiver reservas) |
| `GET` | `/salas/livres?inicio=&fim=&capacidadeMin=` | Lista as salas livres no período |
| `GET` | `/salas/{id}/agenda?data=` | Agenda da sala na data |

### Reservas
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/reservas` | Lista todas as reservas |
| `GET` | `/reservas/{id}` | Busca uma reserva por ID |
| `POST` | `/reservas` | Cria uma reserva (com validações) |
| `PUT` | `/reservas/{id}` | Altera uma reserva (com validações) |
| `PATCH` | `/reservas/{id}/cancelar` | Cancela uma reserva |

### Relatórios
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/relatorios/ocupacao` | Horas e quantidade de reservas por sala |

### Exemplo de requisição: criar reserva

```http
POST /reservas
Content-Type: application/json

{
  "salaId": 1,
  "responsavel": "Prof. Diogo",
  "motivo": "Aula de Desenvolvimento de Software Visual",
  "quantidadePessoas": 30,
  "inicio": "2026-10-20T19:00:00",
  "fim": "2026-10-20T22:00:00"
}
```

**Respostas possíveis:**

| Código | Situação |
|---|---|
| `201 Created` | Reserva criada com sucesso |
| `400 Bad Request` | Horário inválido ou capacidade excedida |
| `404 Not Found` | Sala não encontrada |
| `409 Conflict` | Sala já reservada no horário |

---

## 🛠️ Tecnologias Utilizadas

- **C#** com **.NET SDK 8.0** (Minimal API)
- **Entity Framework Core 8** (ORM)
- **SQLite** (banco de dados)
- **Swagger / Swashbuckle** (documentação e testes da API)
- **Git + GitHub** (versionamento e colaboração)

---

## 🚀 Como Executar

### Pré-requisitos
- [.NET SDK 8.0](https://dotnet.microsoft.com/download/dotnet/8.0)
- Ferramenta do EF Core:
  ```bash
  dotnet tool install --global dotnet-ef --version 8.*
  ```

### Passo a passo

```bash
# 1. Clonar o repositório
git clone https://github.com/FelipeUemura11/ReservaDeSalasFaculdade.git
cd ReservaDeSalasFaculdade/SolutionReservaSalas/ReservaSalas.Api

# 2. Restaurar as dependências
dotnet restore

# 3. Criar o banco de dados SQLite
dotnet ef database update

# 4. Executar a API
dotnet run
```

O navegador abre automaticamente no Swagger, em `http://localhost:5220/swagger`, onde é possível testar todos os endpoints pelo botão **Try it out**.

Também é possível testar pelos arquivos `.http` da pasta do projeto (`testeBlocos.http`, `testeSalas.http`, `testeReservas.http` e `testeRelatorios.http`), usando a extensão **REST Client** do VS Code.

> 💡 O arquivo `reservas.db` é gerado localmente e está no `.gitignore`. Cada integrante cria o seu com `dotnet ef database update`.

---

## 📁 Estrutura do Projeto

```
SolutionReservaSalas/
├── SolutionReservaSalas.sln
└── ReservaSalas.Api/
    ├── db/
    │   └── AppDataContext.cs        # Contexto do EF Core e configuração dos relacionamentos
    ├── endpoints/
    │   ├── BlocoEndpoints.cs        # CRUD de blocos
    │   ├── SalaEndpoints.cs         # CRUD de salas, salas livres e agenda
    │   ├── ReservaEndpoints.cs      # Reservas e regras de conflito
    │   └── RelatorioEndpoints.cs    # Relatório de ocupação
    ├── Migrations/                  # Migrations geradas pelo EF Core
    ├── models/
    │   ├── Bloco.cs
    │   ├── Sala.cs
    │   ├── Reserva.cs
    │   └── Enums.cs
    ├── Properties/
    │   └── launchSettings.json      # Porta da API e abertura automática do Swagger
    ├── testeBlocos.http             # Requisições de teste de blocos
    ├── testeSalas.http              # Requisições de teste de salas, salas livres e agenda
    ├── testeReservas.http           # Requisições de teste de reservas
    ├── testeRelatorios.http         # Requisição de teste do relatório de ocupação
    ├── Program.cs                   # Configuração da aplicação e registro das rotas
    └── ReservaSalas.Api.csproj
```

---

## 🤝 Organização da Equipe

### Back-end

| Integrante | Responsabilidade principal |
|---|---|
| `Felipe` | Setup do projeto, models, db e migrations |
| `Felipe` | Endpoints de Blocos e Salas |
| `Rafael` | Endpoints de Reservas e regras de conflito/capacidade |
| `Rafael` | Salas livres, agenda, relatório de ocupação e documentação |

### Front-end

| Integrante | Responsabilidade principal |
|---|---|
| `Felipe` | Setup do front: Tailwind CSS, React Router, Axios, CORS na API, layout e estrutura de pastas |
| `Felipe` | Telas de Blocos e Salas |
| `Rafael` | Telas de Reservas (listagem, formulário de criação/edição e cancelamento) |
| `Rafael` | Telas de Salas livres, Agenda da sala, Relatório de ocupação e documentação |

#### Tarefas do Front-end

**Felipe**
1. Instalar e configurar o **Tailwind CSS v3** (compatível com o Create React App).
2. Instalar e configurar o **React Router** (`BrowserRouter` e declaração de todas as rotas).
3. Habilitar **CORS** na API para permitir requisições do front (`http://localhost:3000`).
4. Instalar o **Axios** e criar a instância base em `services/` apontando para a API (`http://localhost:5220`).
5. Criar a estrutura de pastas (`pages/`, `components/`, `services/`, `types/`) e o layout com menu de navegação.
6. Tela de **Blocos**: listar, cadastrar, editar e excluir (com aviso quando o bloco possui salas).
7. Tela de **Salas**: CRUD com seleção de bloco e tipo (com aviso quando a sala possui reservas).

**Rafael**

8. Tela de **Reservas**: listagem com status e botão de cancelamento.
9. **Formulário de Reserva** (criar/editar), exibindo os erros `400`, `404` e `409` da API.
10. Tela de **Salas Livres**: filtros de período e capacidade mínima.
11. Tela de **Agenda da Sala**: seleção de data e listagem das reservas do dia.
12. Tela de **Relatório de Ocupação**: total de reservas e horas por sala.
13. **Documentação**: seção do front-end no README (tecnologias, como executar e estrutura).

> As tarefas 1 a 5 são pré-requisito para as demais e devem ser entregues primeiro.

---

## 📦 Repositório

Este repositório é a entrega oficial do projeto e contém todo o código-fonte, o histórico de commits e esta documentação.

🔗 **Link:** https://github.com/FelipeUemura11/ReservaDeSalasFaculdade

🎥 **Vídeo de apresentação:** https://www.youtube.com/watch?v=qyp98gLnIe0

---

### Uso de IA
A IA foi usada em etapas, de forma conversacional:

**Documentação:** foi pedida a criação deste README seguindo a estrutura exigida pelo professor (identificação, resumo, funcionalidades, descrição, repositório e uso de IA) E ajustamos manualmente algumas coisas.

**Estrutura Relacional:** pedi uma ajuda para saber como fazer a ligação entre as tabelas (relacionamento)

**Arquitetura dos endpoints:** ajuda para arquiteturar os endpoints, forma melhor estruturada para separar as funcinalidades

**Divisão das tarefas do front-end:** pedimos ajuda para separar as tarefas do front-end entre os integrantes, seguindo a mesma divisão usada no back-end.
