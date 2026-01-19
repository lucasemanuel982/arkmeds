# Projeto Arkmeds

Sistema de corridas (rides) com gestão de motoristas, passageiros, cálculo de tarifas e geração de recibos em background. API REST em Node.js com TypeScript, PostgreSQL, Redis e BullMQ.

---

## Sumário

- [Requisitos](#requisitos)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Instalação e execução local](#instalação-e-execução-local)
- [Docker](#docker)
- [Scripts npm](#scripts-npm)
- [Arquitetura](#arquitetura)
- [API](#api)
- [Cálculo de tarifa](#cálculo-de-tarifa)
- [Recibos e worker](#recibos-e-worker)
- [Testes](#testes)
- [Coleção Postman](#coleção-postman)

---

## Requisitos

- Node.js 20+
- PostgreSQL 16+
- Redis 7+ (opcional; se ausente, o notificador de corrida aceita usa modo in-memory)
- npm

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz (há `.env.example` como referência). Principais variáveis:

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor HTTP | 3000 |
| `HOST` | Host de escuta | 0.0.0.0 |
| `DATABASE_URL` | URL de conexão PostgreSQL | `postgresql://postgres:postgres@localhost:5432/arkmeds` |
| `DB_USER` | Usuário do banco (usado se `DATABASE_URL` não for definida) | postgres |
| `DB_PASSWORD` | Senha do banco | postgres |
| `DB_HOST` | Host do PostgreSQL | localhost |
| `DB_PORT` | Porta do PostgreSQL | 5432 |
| `DB_NAME` | Nome do banco | arkmeds |
| `REDIS_URL` | URL do Redis (ex: `redis://localhost:6379`). Se não definida, corridas aceitas são processadas em memória, sem fila | null |
| `RECEIPT_BASE_PATH` | Diretório base para escritores de recibo em arquivo (não usado quando o recibo vai para Postgres) | `os.tmpdir()` |
| `LOG_LEVEL` | Nível de log do Pino: `trace`, `debug`, `info`, `warn`, `error`, `fatal` | info |
| `PM2_APP_INSTANCES` | Número de instâncias do app em cluster (ou `"max"` = 1 por CPU). Apenas em Docker/PM2 | max |
| `PM2_WORKER_INSTANCES` | Número de instâncias do worker de recibo (consumidores BullMQ). Apenas em Docker/PM2 | 2 |

---

## Instalação e execução local

1. Clone o repositório e entre na pasta do projeto.

2. Instale as dependências:

   ```
   npm install
   ```

3. Configure o `.env` com `DATABASE_URL` (e `REDIS_URL` se for usar fila e worker).

4. Crie o banco e rode as migrações:

   ```
   npm run migrate:up
   ```

5. Com PostgreSQL (e Redis, se usar fila) em execução, inicie a API:

   ```
   npm run dev
   ```

   A API fica em `http://localhost:3000` (ou no `PORT` do `.env`).

6. Se estiver usando Redis e worker de recibo em processo separado:

   ```
   npm run worker:dev
   ```

   Em produção, após `npm run build`, use `npm run worker` para o worker e `npm start` para a API.

---

## Docker

O `docker-compose.yml` sobe:

- **postgres** (porta 5432), **redis** (porta 6379)
- **app**: API Express com migrations no entrypoint e PM2 em modo cluster
- **worker**: consumer BullMQ que gera recibos e grava em Postgres, gerenciado por PM2

Comandos:

```
npm run docker:up
```

Isso faz build da imagem, sobe os quatro serviços e espera postgres e redis ficarem healthy antes de iniciar app e worker.

Para parar:

```
npm run docker:down
```

Logs:

```
npm run docker:logs        # app
npm run docker:logs:worker # worker
```

O `Dockerfile` usa `node:20-alpine`, instala dependências com `npm ci`, gera `dist/` com `npm run build` e usa `scripts/entrypoint.sh` (app) ou `scripts/entrypoint-worker.sh` (worker) como entrypoint.

---

## Scripts npm

| Script | Descrição |
|--------|-----------|
| `npm run dev` | API em desenvolvimento com ts-node-dev e reload automático |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Roda a API a partir de `dist/server.js` |
| `npm run worker:dev` | Worker de recibo em desenvolvimento com ts-node-dev |
| `npm run worker` | Worker a partir de `dist/receipt-worker.js` |
| `npm run test` | Testes unitários (exclui `integration.test`) |
| `npm run test:all` | Todos os testes, incluindo integração |
| `npm run test:coverage` | Testes com relatório de cobertura |
| `npm run migrate:up` | Sobe migrações (node-pg-migrate) |
| `npm run migrate:down` | Reverte a última migração |
| `npm run lint` | ESLint em `src` |
| `npm run lint:fix` | ESLint com correção automática |
| `npm run format` | Prettier em `src/**/*.{ts,json}` |
| `npm run format:check` | Verifica formatação com Prettier |
| `npm run docker:up` | Sobe stack com Docker Compose |
| `npm run docker:down` | Para e remove containers da stack |
| `npm run docker:logs` | Logs do serviço app |
| `npm run docker:logs:worker` | Logs do serviço worker |
| `npm run start:pm2` | Inicia apenas o app via pm2-runtime (cluster) |
| `npm run worker:pm2` | Inicia apenas o worker via pm2-runtime (fork, múltiplas instâncias) |

---

## Arquitetura

Estrutura em camadas:

- **domain**: entidades e regras (Driver, Passenger, Race; FareStrategy, TariffStrategySelector, GeoLocation, distância Haversine).
- **application**: casos de uso e portas (repositórios, `IRaceAcceptedNotifier`, `IReceiptFileWriter`). Ex.: CreateDriver, CreatePassenger, AcceptRace, GenerateReceipt, CalculateFare.
- **infrastructure**: HTTP (Express, rotas, controllers, middlewares de validação e erro), persistência (PostgreSQL, repositórios, migrations), fila (Redis, BullMQ), implementações de notificador e de writer de recibo (Postgres, filesystem para testes).

Fluxo de uma corrida aceita:

1. `POST /race` com `userId` (passenger), `requestId`, `from`, `to`, `price`, `distanceKm`, `datetime`.
2. `AcceptRace` valida se o passageiro existe, persiste a corrida e notifica.
3. Se `REDIS_URL` estiver definida: `BullMQRaceAcceptedNotifier` envia um job para a fila; o `receipt-worker` (BullMQ) processa e chama `GenerateReceipt`, que grava o recibo (JSON) na tabela `receipts` via `PostgresReceiptWriter`.
4. Se `REDIS_URL` não estiver definida: `InMemoryRaceAcceptedNotifier` agenda o `GenerateReceipt` com `setImmediate` no próprio processo da API; o mesmo `PostgresReceiptWriter` é usado.

Migrations (em `src/infrastructure/persistence/migrations/`): `init`, `create_receipts`, `create_drivers`, `create_passengers`, `create_races`.

---

## API

Base: `http://localhost:3000` (ou a URL configurada). Respostas de erro seguem `{ "error": "mensagem" }`.

### Health

- `GET /health` — Retorna `{ "status": "ok" }`.

### Motoristas (Driver)

- `POST /driver` — Cria motorista. Body: `nome`, `cpf`, `dataNascimento`, `sexo`, `endereco` (rua, numero, bairro, cidade, cep). 400: CPF inválido, data inválida ou body inválido. 409: CPF já cadastrado.
- `GET /driver` — Lista motoristas.
- `GET /driver/:id` — Motorista por id. 404 se não existir.
- `PUT /driver/:id` — Atualiza (todos os campos opcionais). 400, 404, 409 (CPF duplicado).
- `DELETE /driver/:id` — Remove motorista. 404 se não existir.

### Passageiros (Passenger)

- `POST /passenger` — Cria passageiro. Mesmo formato de motorista (nome, cpf, dataNascimento, sexo, endereco). 400 e 409 como em driver.
- `GET /passenger` — Lista passageiros.
- `GET /passenger/:id` — Passageiro por id. 404 se não existir.
- `PUT /passenger/:id` — Atualiza (campos opcionais). 400, 404, 409.
- `DELETE /passenger/:id` — Remove passageiro. 404 se não existir.

### Tarifa (Fare)

- `POST /fare` — Calcula tarifa. Body: `from` e `to` com `{ lat, lng }`; `datetime` em ISO 8601 com timezone (ex: `2025-01-15T08:00:00-03:00`). Resposta: `{ fare, distanceKm, strategy }`. `strategy`: `day`, `night`, `weekend_day`, `weekend_night`.

### Corrida (Race)

- `POST /race` — Aceita corrida. Body: `userId` (id do passageiro), `requestId`, `from`, `to`, `price`, `distanceKm`, `datetime` (ISO 8601). Resposta 202: `{ id, passengerId, requestId, status: "accepted" }`. O recibo é gerado em background (fila BullMQ ou in-memory) e gravado na tabela `receipts`.

---

## Cálculo de tarifa

- Distância: fórmula de Haversine entre `from` e `to` (km).
- Estratégia por `datetime` (timezone-aware):
  - Dia útil: 06:00–22:00 (`day`), 22:00–06:00 (`night`).
  - Fim de semana: 06:00–22:00 (`weekend_day`), 22:00–06:00 (`weekend_night`).
- Fórmula: `tarifa = base + ratePerKm * distanceKm`. Valores padrão (em reais):

  | Estratégia     | base | ratePerKm |
  |----------------|------|-----------|
  | day            | 5    | 2         |
  | night          | 7    | 2.5       |
  | weekend_day    | 6    | 2.2       |
  | weekend_night  | 8    | 3         |

---

## Recibos e worker

- Após aceitar uma corrida, o sistema gera um recibo em JSON com: `id`, `requestId`, `passengerId`, `from`, `to`, `price`, `distanceKm`, `acceptedAt`.
- Em produção (com Redis): o job é enfileirado no BullMQ; o `receipt-worker` consome e usa `PostgresReceiptWriter`, que insere na tabela `receipts` (`race_id`, `passenger_id`, `date_yyyy_mm_dd`, `content`). O worker usa PM2 com múltiplas instâncias (`PM2_WORKER_INSTANCES`, padrão 2).
- Sem Redis: `InMemoryRaceAcceptedNotifier` dispara `GenerateReceipt` no processo da API; o mesmo `PostgresReceiptWriter` grava em `receipts`. O processo `receipt-worker` não é necessário.

---

## Testes

- `npm run test` — Testes unitários (ignora `*integration.test*`).
- `npm run test:all` — Inclui testes de integração (exigem banco e, se aplicável, Redis/HTTP).
- `npm run test:coverage` — Cobertura.

Framework: Jest. Integração com `supertest` para rotas.

---

## Coleção Postman

Em `postman/Arkmeds.postman_collection.json`. Importe no Postman e defina a variável `baseUrl` (ex: `http://localhost:3000`). A coleção inclui exemplos para:

- Health, Driver (CRUD), Passenger (CRUD), Fare (cálculo com exemplos dia útil, noite, fim de semana) e Race (aceitar corrida). Os testes de requisição em Criar motorista e Criar passenger gravam `driverId` e `passengerId` para uso em outras chamadas.

---

## Licença

ISC.
