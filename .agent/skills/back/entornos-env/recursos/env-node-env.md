# NODE_ENV en Backend — Resumen

## Valores estándar
| Valor        | Uso típico     | Throttle / límites      |
|-------------|-----------------|--------------------------|
| development | Local, sin setear | Altos (ej. 10k/min)   |
| staging     | Preproducción   | Igual que producción    |
| production  | Producción      | Estrictos (ej. 300/min) |

## Detección de “desarrollo”
Considerar **desarrollo** cuando:
`NODE_ENV !== 'production' && NODE_ENV !== 'staging'`

Así, si no se define `NODE_ENV` o se usa `development`, se aplican límites permisivos.

## Throttlers nombrados: todos se aplican a todas las rutas
En @nestjs/throttler, cada throttler definido (short, email, day) se evalúa en **cada** request. Si pones `email: { limit: 3 }` a nivel global, GET /memberships y GET /events también quedan limitados a 3/hora. Usar límite global alto para "email" y `@Throttle({ email: { limit: 3, ttl: 3600000 } })` solo en forgot-password, resend-verification, etc.

## Ejemplo: ThrottlerModule con forRootAsync (correcto)
```ts
ThrottlerModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const dev =
      config.get('NODE_ENV') !== 'production' &&
      config.get('NODE_ENV') !== 'staging';
    const shortLimit = dev ? 10_000 : 300;
    const dayLimit = dev ? 50_000 : 5_000;
    // "email" global alto; las rutas sensibles sobrescriben con @Throttle({ email: { limit: 3 } })
    const emailLimit = dev ? 10_000 : 1000;
    return [
      { name: 'short', ttl: 60_000, limit: shortLimit },
      { name: 'email', ttl: 3_600_000, limit: emailLimit },
      { name: 'day', ttl: 86_400_000, limit: dayLimit },
    ];
  },
}),
```
En el controlador de auth, en forgot-password y resend-verification: `@Throttle({ email: { limit: 3, ttl: 3600000 }, day: { limit: 8, ttl: 86400000 } })`.

## .env.example
Incluir al menos:
```env
# NODE_ENV: development (por defecto, límites altos) | staging | production
NODE_ENV=development
```
