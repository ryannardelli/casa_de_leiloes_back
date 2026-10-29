# Casa de Leilões Arremata - Back-End

## Bem-vindo à documentação do back-end da Casa de Leilões Arremata.

Este repositório consiste em um back-ed desenvolvido para dar suporte a plataforma de leilões online, oferecendo gerenciamento de lotes, processamento de lances em tempo real, controle de acesso, mecanismos de verificação da integridade dos dados e muito mais.

## Visão Geral

A Casa de Leilões Arremata possui um back-end responsável por gerenciar as principais operações da plataforma, incluindo autenticação e autorização de usuários, gerenciamento de lotes, processamento de lances, operações de carteira virtual e encerramento dos leilões.

A aplicação utiliza Socket.IO para transmitir atualizações em tempo real e notificar os participantes quando seus lances são superados. A biblioteca `node-cron` executa verificações periódicas dos horários dos lotes, automatizando a atualização de seus status para permitir a abertura e o encerramento dos leilões.

O sistema também implementa mecanismos de antissniping para estender o prazo de encerramento quando as condições definidas são atendidas, além de recursos de auditoria pública que permitem consultar o histórico de lances e verificar a integridade dos registros por meio de hashes criptográficos.

O controle de acesso utiliza permissões baseadas em funções (RBAC — Role-Based Access Control), com regras específicas para os perfis de administrador, leiloeiro e licitante.

## Tecnologias Utilizadas

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- Docker
- Docker Compose
- Socket.IO
- node-cron
- Swagger
- Módulo `crypto` do Node.js para geração de hashes SHA-256

## Arquitetura

A aplicação utiliza uma arquitetura em camadas, separando as responsabilidades entre controllers, services, repositories e outros componentes de suporte. Essa organização favorece a separação de responsabilidades, a manutenção do código e a implementação consistente das regras de negócio.

## Estrutura do Projeto

A estrutura abaixo é ilustrativa. Consulte o repositório para identificar os diretórios e arquivos efetivamente utilizados no projeto.

```bash
src/
├── configs/        # Configurações da aplicação e do banco de dados
├── controllers/    # Tratamento das requisições e respostas HTTP
├── dtos/           # Objetos de transferência de dados
├── exceptions/     # Erros personalizados e tratamento de exceções
├── middlewares/    # Autenticação, autorização e validações
├── models/         # Modelos e relacionamentos do banco de dados
├── repositories/   # Acesso e persistência dos dados
├── routes/         # Definição das rotas da API
├── seeds/          # Scripts para carga inicial e dados de teste
├── services/       # Regras de negócio e operações da aplicação
├── works/          # Rotinas e funções auxiliares
├── app.ts          # Configuração principal da aplicação
└── server.ts       # Inicialização do servidor
```

## Visão Geral das Camadas

### Controllers

Responsáveis por receber as requisições HTTP, encaminhar os dados aos serviços correspondentes e retornar as respostas ao cliente.

### Services

Contêm a lógica de negócio da aplicação. Coordenam operações relacionadas ao gerenciamento de lotes, processamento de lances, transações da carteira virtual, encerramento dos leilões e geração de hashes, conforme os serviços implementados.

### Repositories

Responsáveis pelo acesso e pela persistência dos dados, abstraindo as operações de banco de dados e a comunicação com o ORM.

### Models

Representam as estruturas de dados persistidas no banco de dados, definindo atributos, relacionamentos e mapeamentos de persistência.

### Middlewares

Tratam responsabilidades compartilhadas, como autenticação, autorização, validação de requisições e tratamento de erros, conforme a implementação da aplicação.

### DTOs (Data Transfer Objects)

Definem estruturas de dados utilizadas para transferir informações entre as camadas da aplicação, contribuindo para a padronização das entradas e saídas.

### Utils

Disponibilizam funções utilitárias reutilizáveis que auxiliam diferentes partes da aplicação.

### Exceptions

Centralizam erros personalizados e auxiliam no tratamento consistente de exceções ao longo da API.

## Principais Funcionalidades

- **Autenticação e autorização:** proteção dos recursos da API conforme a identidade e as permissões dos usuários.
- **Controle de acesso com RBAC:** definição de permissões para administrador, leiloeiro e licitante.
- **Gerenciamento de lotes:** criação, atualização e gerenciamento dos lotes disponíveis para leilão.
- **Abertura e encerramento automáticos:** atualização dos status dos lotes conforme os horários programados, utilizando `node-cron`.
- **Lances em tempo real:** processamento de ofertas e transmissão de atualizações durante as disputas por meio do Socket.IO.
- **Notificações de lances superados:** comunicação em tempo real para informar aos licitantes quando outro participante supera seus lances.
- **Carteira virtual:** gerenciamento de depósitos simulados, saldos disponíveis e valores comprometidos em lances ativos.
- **Liquidação de leilões:** processamento do encerramento das disputas e de seus respectivos resultados.
- **Antissniping:** extensão do prazo do leilão quando as condições configuradas são atendidas.
- **Auditoria e integridade dos lances:** utilização de hashes SHA-256 encadeados para auxiliar na identificação de alterações no histórico.
- **Checkpoints de auditoria:** modelo `AuditCheckpoint` destinado a registrar referências de pontos específicos da cadeia de hashes para verificações posteriores.
- **Auditoria pública:** consulta ao histórico de lances e disponibilização de informações para apoiar a verificação da integridade dos leilões.

## Comunicação em Tempo Real com Socket.IO

O Socket.IO permite a comunicação entre o servidor e os clientes conectados, possibilitando a atualização das informações das disputas sem depender exclusivamente de novas requisições HTTP.

Entre suas principais aplicações estão:

- Atualização dos valores dos lances e do estado dos leilões.
- Notificação aos licitantes quando seus lances são superados por ofertas de outros participantes ou quando está liderando o leilão.
- Transmissão de eventos relevantes para manter as interfaces atualizadas durante as disputas.

## Tarefas Agendadas com node-cron

A biblioteca `node-cron` é utilizada para executar verificações periódicas do status dos lotes. A tarefa agendada é configurada para executar a cada segundo e aciona os métodos responsáveis por atualizar os lotes programados e aqueles cujo prazo de encerramento expirou.

- **Abertura dos leilões:** verifica os lotes cujo horário de início foi atingido e atualiza seus status, permitindo que as disputas sejam disponibilizadas na sala ao vivo.
- **Encerramento dos leilões:** identifica os lotes cujo horário final foi atingido e atualiza seus status para finalizar as disputas conforme as regras da aplicação.

Essa automação permite gerenciar o ciclo de vida dos leilões de acordo com os horários configurados, sem depender de uma ação manual do leiloeiro.

## Controle de Acesso com RBAC

O sistema utiliza o modelo RBAC (*Role-Based Access Control*) para restringir o acesso às funcionalidades conforme o perfil do usuário autenticado.

- **Administrador:** acesso às operações administrativas permitidas pelo sistema.
- **Leiloeiro:** gerenciamento de lotes e acompanhamento dos leilões sob sua responsabilidade.
- **Licitante:** participação nos leilões, realização de lances e gerenciamento da própria carteira virtual.

A autenticação por token permite identificar o usuário nas requisições protegidas, enquanto as regras de autorização determinam quais operações cada perfil pode executar.

## Auditoria e Integridade dos Lances

A plataforma utiliza hashes criptográficos para apoiar a verificação da integridade e a rastreabilidade do histórico de lances.

### Geração de hashes SHA-256

O sistema utiliza o algoritmo SHA-256, disponibilizado pelo módulo `crypto` do Node.js, para gerar um hash associado a cada lance.

O cálculo considera informações relevantes do registro, como:

- Identificador do lote (`lotId`).
- Identificador do licitante (`bidderId`).
- Valor do lance (`amount`).
- Hash do lance anterior (`previousHash`).
- Data e hora de criação (`createdAt`).

Essas informações são combinadas para gerar um resumo criptográfico que representa os dados utilizados no cálculo.

### Encadeamento dos lances

Cada lance incorpora o hash do lance anterior na composição do seu próprio hash, formando uma cadeia de dependências criptográficas.

```text
Lance 1 → Lance 2 → Lance 3 → Lance 4
```

Essa estrutura permite que alterações nos dados de um lance provoquem divergências quando os hashes correspondentes e os registros subsequentes são recalculados. Dessa forma, o encadeamento auxilia na identificação de inconsistências no histórico.

### AuditCheckpoint

O modelo `AuditCheckpoint` complementa o mecanismo de hashes ao definir uma estrutura para registrar pontos de verificação associados a um lote.

O checkpoint estabelece uma referência para auditorias posteriores, permitindo identificar até qual lance determinado ponto de verificação representa o histórico.

A assinatura digital pode ser utilizada para verificar a autenticidade do checkpoint quando os mecanismos correspondentes de geração, proteção da chave privada e validação estão implementados.

### Considerações de segurança

Os hashes encadeados e os checkpoints auxiliam na detecção de alterações, mas não impedem, isoladamente, modificações no banco de dados. A confiabilidade da abordagem depende também da recalculação e comparação dos hashes, da validação da cadeia, da proteção das chaves criptográficas e de controles adequados sobre o armazenamento dos checkpoints.

**Nota sobre a implementação:** a geração de hashes SHA-256 e a estrutura do modelo `AuditCheckpoint` são descritas separadamente dos processos adicionais de auditoria. A geração, a assinatura e a validação dos checkpoints dependem da implementação dos respectivos serviços e fluxos no back-end.

## Convenção de Commits

O projeto segue a convenção Conventional Commits para padronizar as mensagens de commit:

- `feat`: implementação de novas funcionalidades.
- `fix`: correção de erros.
- `docs`: alterações na documentação.
- `style`: alterações de formatação sem impacto na lógica.
- `refactor`: refatoração do código.
- `perf`: melhorias de desempenho.
- `test`: criação ou alteração de testes.
- `chore`: tarefas de manutenção.
- `ci`: alterações relacionadas à integração e entrega contínuas.

## Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/ryannardelli/casa_de_leiloes_back.git
```

### 2. Acessar o diretório do projeto

```bash
cd casa_de_leiloes_back
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e configure as variáveis exigidas pela aplicação.

```env
# Configurações da aplicação
NODE_ENV=development
PORT=3000

# Configurações do banco de dados
DB_HOST=postgres
DB_PORT=5432
DB_NAME=auction_db
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# Configurações do PostgreSQL
POSTGRES_DB=auction_db
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha

# APIs externas - The Metropolitan Museum of Art
EXTERNAL_API_BASE_URL=https://collectionapi.metmuseum.org/public/collection/v1
EXTERNAL_API_SEARCH_URL=https://collectionapi.metmuseum.org/public/collection/v1.1

# Autenticação
JWT_SECRET=sua_chave_secreta

# Cadastro inicial do administrador
INITIAL_ADMIN_EMAIL=seu_email_de_administrador
INITIAL_ADMIN_PASSWORD=sua_senha_segura
```

Adicione as suas credenciais necessárias conforme a implementação.

### 5. Executar a aplicação

O projeto utiliza **Docker** e **Docker Compose** para facilitar a configuração do ambiente e a execução dos serviços da aplicação, incluindo o back-end e o banco de dados PostgreSQL.

### Pré-requisitos

- Docker instalado.
- Docker Compose disponível por meio do comando `docker compose`.

### Executando a aplicação com Docker

O projeto utiliza Docker e Docker Compose para construir e executar os contêineres do back-end e do banco de dados PostgreSQL.

#### 1. Configuração do ambiente

Na raiz do projeto, configure o arquivo `.env` com as variáveis de ambiente necessárias para a aplicação, incluindo as credenciais de conexão com o PostgreSQL.

#### 2. Construção da imagem e inicialização dos serviços

Na raiz do projeto, onde está localizado o arquivo `docker-compose.yml`, execute:

```bash
docker compose up -d --build
```

Esse comando constrói as imagens necessárias e inicia os serviços definidos no arquivo `docker-compose.yml` em segundo plano.

#### 3. Verificação dos contêineres

Para verificar se os serviços foram iniciados corretamente, execute:

```bash
docker compose ps
```

Para acompanhar os logs e identificar possíveis erros durante a inicialização, utilize:

```bash
docker compose logs -f
```

#### 4. Acessando a aplicação

Se todos os serviços forem iniciados corretamente, o back-end estará disponível em:

- **API:** [http://localhost:3000](http://localhost:3000)
- **Documentação Swagger:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

A documentação Swagger permite visualizar os endpoints disponíveis na API, consultar os parâmetros das requisições e testar as operações disponibilizadas pelo back-end.

