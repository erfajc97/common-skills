# Stripe – Variables de entorno y webhooks

## Variables de entorno

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `STRIPE_SECRET_KEY` | Sí | Clave secreta (sk_test_... o sk_live_...). Sin ella no iniciar el adapter. |
| `STRIPE_WEBHOOK_SECRET` | Sí (para webhooks) | Signing secret del webhook (whsec_...). Necesaria para verificar firma. |
| `STRIPE_CURRENCY` | No | Moneda por defecto (ej. `eur`). Default recomendado: `eur`. |
| `STRIPE_PUBLIC_KEY` | No (front) | Clave pública para el SDK de Stripe en el frontend (pk_test_... / pk_live_...). |

## Configuración del webhook en Stripe

1. Dashboard → Developers → Webhooks → Add endpoint.
2. URL: `https://tu-dominio.com/payments/webhook` (o la ruta que expongas).
3. Eventos recomendados:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
   - Opcional: `customer.subscription.updated`, `customer.subscription.created`
4. Copiar el **Signing secret** (whsec_...) y usarlo como `STRIPE_WEBHOOK_SECRET`.

## Raw body

El endpoint de webhook debe recibir el body **sin parsear** (raw buffer). En NestJS, configurar el middleware para que la ruta del webhook no pase por el body parser JSON, y exponer `req.rawBody` para pasarlo a `constructEvent`.

## Eventos y uso típico

| Evento | Uso |
|--------|-----|
| `checkout.session.completed` | Crear compra única (evento) o suscripción (membresía); guardar customer_id y subscription_id. |
| `invoice.payment_succeeded` | Renovación de suscripción; extender endDate de la membresía. |
| `customer.subscription.deleted` | Marcar suscripción cancelada en BD. |

## Cancelación

- `stripe.subscriptions.cancel(subscriptionId)` cancela al final del periodo de facturación.
- Para cancelar de inmediato: `stripe.subscriptions.cancel(subscriptionId, { prorate: true })` (según necesidad de negocio).
