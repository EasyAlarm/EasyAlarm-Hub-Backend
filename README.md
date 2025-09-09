## EasyAlarm Hub Backend

Part of the [EasyAlarm](https://github.com/EasyAlarm) project 

Node.js/Express TypeScript API for the EasyAlarm hub. Manages authentication, units, profiles, logs, settings, and communicates with the middleware over a serial connection.

### Features
- JWT auth (access + refresh)
- Protected API routes under `/api/*` with `x-auth-token` header
- MongoDB via Mongoose
- Serial communication with Arduino middleware (NRF24 bridge)

### Requirements
- Node.js 18+
- MongoDB instance
- Connected Arduino middleware device (via USB serial)


### API overview
- Base path: `/api`
- Auth
  - `POST /api/user/login` → returns `{ accessToken, refreshToken, user }`
  - `POST /api/user/refresh` with `{ refreshToken }` → returns new tokens
  - Include `x-auth-token: <accessToken>` for all protected routes
- Units: `/api/unit`
- Logs: `/api/log`
- Profiles: `/api/profile`
- Hub: `/api/hub` (status/arm/disarm/panic)
- Settings: `/api/settings`
- RFID: `/api/rfid`

### Serial protocol
- 9600 baud, framing with `<` (SOT) and `>` (EOT)
- Payload fields delimited by `!`
- Example inbound from middleware: `<deviceId!payloadType!content>`
- Example outbound to middleware: wrapped with `<` and `>` as well
