# plugin-better-auth-example

An example [GraphQL Yoga](https://github.com/dotansimha/graphql-yoga) project to
get you started with [plugin-better-auth](https://github.com/Nexirift/plugin-better-auth).

## Installation

### Instructions

1. Clone the project by using Git:
   `git clone https://github.com/Nexirift/plugin-better-auth-example`
2. Install packages using bun: `bun install`
3. Copy `.env.example` to `.env`
4. Apply migrations using: `bun migrate`
5. Start the server using: `bun dev`
6. Visit `http://localhost:3008/user`
7. Copy the value in `token` for later use
8. Send a test request below

### Sending a request

```bash
curl --request POST \
--url http://localhost:3008/graphql \
--header 'Authorization: Bearer TOKEN_HERE' \
--header 'Content-Type: application/json' \
--data '{"query":"query hello {\n\thello\n}","operationName":"hello"}'
```

_Replace TOKEN_HERE with the actual token_
