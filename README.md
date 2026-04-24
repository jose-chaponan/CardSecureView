# 🔐 CardSecureView

> Aplicación móvil React Native para visualización segura de tarjetas bancarias.
> Módulo nativo Android con `FLAG_SECURE`, validación de token por TTL y auto-cierre por inactividad.

[![React Native](https://img.shields.io/badge/React_Native-0.85-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Android](https://img.shields.io/badge/Android-API_24+-34A853?style=for-the-badge&logo=android&logoColor=white)](https://developer.android.com)
[![Firebase](https://img.shields.io/badge/Firebase-24.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Node](https://img.shields.io/badge/Node.js-22.11+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)

---

## 📋 Tabla de contenidos

- [⚙️ Requisitos y setup](#️-requisitos-y-setup)
- [🏗️ Arquitectura](#️-arquitectura)
- [📡 API nativa](#-api-nativa)
- [🔒 Seguridad](#-seguridad)

---

## ⚙️ Requisitos y setup

### Herramientas necesarias

| Herramienta | Versión mínima |
| --- | --- |
| Node.js | 22.11.0 |
| JDK | 17 |
| Android Studio | Ladybug 2024.2.1+ |
| Android SDK | API 36 (compileSdk) / API 24 mínimo |
| React Native CLI | 20.1.0 |

### Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
TEST_EMAIL=tu@email.com
TEST_PASSWORD=tuPassword
```

> ⚠️ Este archivo **nunca** debe subirse al repositorio. Ya está incluido en `.gitignore`.

### Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Android — requiere emulador o dispositivo conectado
npm run android

# iOS — solo macOS, requiere CocoaPods
bundle install && bundle exec pod install
npm run ios
```

```bash
npm run lint   # ESLint
npm test       # Jest
```

---

## 🏗️ Arquitectura

El proyecto aplica **Clean Architecture** organizado por **Vertical Slicing** — cada feature es autónoma y contiene su propia capa de dominio, datos y presentación.

### Estructura de carpetas

```text
CardSecureView/
├── App.tsx                               ← composición de providers + navigator
├── src/
│   ├── app/
│   │   ├── navigation/
│   │   │   ├── root-navigator.tsx        ← Stack.Navigator según auth state
│   │   │   └── types.ts
│   │   └── providers/
│   │       └── auth-session-provider.tsx ← Firebase listener + loading screen
│   │
│   ├── features/
│   │   ├── auth/                         ── feature autónoma
│   │   │   ├── constants/
│   │   │   ├── domain/
│   │   │   │   ├── entities/             ← AuthUser
│   │   │   │   └── use-cases/            ← loginUseCase · logoutUseCase
│   │   │   ├── data/services/            ← authService (Firebase)
│   │   │   └── presentation/
│   │   │       ├── hooks/                ← useLoginScreen
│   │   │       ├── screens/              ← LoginScreen
│   │   │       └── store/                ← Zustand auth store
│   │   │
│   │   └── cards/                        ── feature autónoma
│   │       ├── domain/
│   │       │   ├── entities/             ← Card
│   │       │   └── use-cases/            ← openSecureViewUseCase
│   │       ├── data/
│   │       │   ├── mocks/
│   │       │   └── services/             ← cardSecureService (NativeModules bridge)
│   │       └── presentation/
│   │           ├── components/           ← CardItem · CardItemSkeleton
│   │           ├── hooks/                ← useCardSecure · useCards · useSecureToken · useDashboardScreen
│   │           ├── screens/              ← DashboardScreen
│   │           └── store/                ← Zustand cards store
│   │
│   └── shared/
│       ├── infrastructure/native/        ← placeholder bridges nativos transversales
│       └── utils/uuid.ts
│
└── android/app/src/main/java/com/cardsecureview/
    ├── CardSecureModule.kt               ← ReactContextBaseJavaModule
    ├── CardSecureActivity.kt             ← FLAG_SECURE · validación token · auto-hide
    └── CardSecurePackage.kt
```

### Flujo de capas

```text
domain/entities      ← sin dependencias externas
       ↑
domain/use-cases     ← entities + data/services
       ↑
data/services        ← Firebase / NativeModules  (nunca importa presentation)
       ↑
presentation/store   ← use-cases  (Zustand)
       ↑
presentation/hooks   ← store + use-cases
       ↑
presentation/screens ← solo hooks
```

| Capa | Responsabilidad |
| --- | --- |
| `domain/entities` | Modelos de negocio puros, sin frameworks |
| `domain/use-cases` | Orquestación de lógica de negocio |
| `data/services` | Acceso a datos externos (Firebase, NativeModules) |
| `presentation/store` | Estado reactivo con Zustand |
| `presentation/hooks` | Lógica de UI y composición de estado |
| `presentation/screens` | UI declarativa pura |

### Decisiones técnicas

| Decisión | Alternativa descartada | Razón |
| --- | --- | --- |
| **Zustand** | Redux | Sin boilerplate de actions/reducers; selectores con memoización nativa |
| **FlashList** | FlatList | Recycling nativo más eficiente; mejor rendimiento en scroll |
| **NativeEventEmitter** | Callbacks directos | Desacopla el ciclo de vida de `CardSecureActivity` del componente React |
| **TTL en dos capas** | Solo validación nativa | JS valida a 30s anticipadamente; nativo valida a 60s como segunda línea |
| **`useRef` para `lastCardId`** | Estado React | Evita dependencias circulares en `useCallback` al implementar retry |

---

## 📡 API nativa

### `CardSecureModule.openSecureView`

Abre la vista segura nativa. El módulo valida el token antes de mostrar cualquier dato sensible.

```ts
openSecureView(
  cardId: string,   // identificador único de la tarjeta
  pan:    string,   // número de tarjeta completo
  cvv:    string,   // código de seguridad
  expiry: string,   // formato MM/YY
  holder: string,   // nombre del titular
  token:  string,   // formato: TOKEN-{unix_timestamp_en_segundos}
): Promise<void>
```

### Eventos del nativo → JS

| Evento | Parámetros | Cuándo se emite |
| --- | --- | --- |
| `onSecureViewOpened` | `cardId: string` | La `CardSecureActivity` se abrió exitosamente |
| `onCardDataShown` | `cardId: string` | El usuario tocó el botón para revelar datos |
| `onValidationError` | `{ code: string, message: string }` | El token no pasó la validación de formato o TTL |
| `onSecureViewClosed` | `{ cardId: string, reason: string }` | Vista cerrada (back, timeout o post-error) |

### Códigos de `onValidationError`

| Código | Causa | Respuesta en JS |
| --- | --- | --- |
| `TOKEN_EXPIRED` | Timestamp supera el TTL (30s en JS / 60s en nativo) | Alert con opciones "Cerrar" y "Reintentar" |
| `TOKEN_INVALID` | Formato incorrecto, prefijo ausente o token corrupto | Alert con "Entendido" únicamente |

---

## 🔒 Seguridad

### Módulo nativo — `CardSecureActivity`

| Medida | Estado | Detalle |
| --- | --- | --- |
| `FLAG_SECURE` | ✅ | Activo en `onCreate`. Bloquea capturas de pantalla, grabación y aparición en recientes |
| Auto-ocultar en `onPause` | ✅ | Layout oculto al ir a background; se restaura en `onResume` |
| Timeout de 30 segundos | ✅ | Countdown visible; cierra la activity automáticamente al llegar a cero |
| Validación de formato | ✅ | Verifica prefijo `TOKEN-` y timestamp parseable |
| Validación de TTL | ✅ | Timestamp debe ser menor a 60s; emite `TOKEN_EXPIRED` si se supera |

### Capa JavaScript

| Medida | Estado | Detalle |
| --- | --- | --- |
| Validación TTL anticipada | ✅ | `isTokenExpired()` verifica 30s **antes** de llamar al nativo |
| Sin logs de datos sensibles | ✅ | Ningún `console.log` imprime PAN, CVV, token ni titular |
| Sin `Log.d` en Android | ✅ | El código nativo no expone datos de tarjeta en logs del sistema |
| Limpieza de listeners | ✅ | `useEffect` elimina todas las suscripciones a `NativeEventEmitter` en cleanup |

### Archivos sensibles y `.gitignore`

| Archivo | Ignorado |
| --- | --- |
| `.env` | ✅ |
| `google-services.json` | ✅ |
| `GoogleService-Info.plist` | ✅ |
| `*.keystore` | ✅ |
| `local.properties` | ✅ |
