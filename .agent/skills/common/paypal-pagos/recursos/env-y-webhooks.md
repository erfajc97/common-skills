# PayPal – Variables de entorno y webhooks

## Variables de entorno

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `PAYPAL_CLIENT_ID` | Sí | Client ID de la app (desarrollo o producción). |
| `PAYPAL_CLIENT_SECRET` | Sí | Client Secret. Sin ambas credenciales no iniciar el adapter. |
| `PAYPAL_WEBHOOK_ID` | Sí (para webhooks) | ID del webhook configurado en el dashboard. Necesario para verificar firma. |
| `PAYPAL_API` | No | URL del API (sandbox o production). Si no se define o contiene "sandbox", se usa Sandbox. |
| `PAYPAL_PRODUCT_ID` | No | ID de producto en PayPal para suscripciones; si no se define, se puede crear uno al vuelo. |

Entorno: si `PAYPAL_API` es sandbox (p. ej. `https://api-m.sandbox.paypal.com`) se usa Sandbox; en caso contrario Production.

## Configuración del webhook en PayPal

1. Dashboard (developer.paypal.com) → App → Webhooks → Add Webhook.
2. URL: `https://tu-dominio.com/payments/webhook/paypal`.
3. Eventos recomendados:
   - Payments: `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.PENDING`
   - Subscriptions: `BILLING.SUBSCRIPTION.ACTIVATED`, `BILLING.SUBSCRIPTION.CANCELLED`, `BILLING.SUBSCRIPTION.PAYMENT.SUCCEEDED`
   - Sales: `PAYMENT.SALE.COMPLETED`, `PAYMENT.SALE.PENDING`
4. Guardar y copiar el **Webhook ID** como `PAYPAL_WEBHOOK_ID`.

## Verificación de firma (postback)

Al llamar a `POST /v1/notifications/verify-webhook-signature`, el cuerpo debe enviar **`webhook_event` exactamente como se recibió** (mismo JSON raw). Si se hace `JSON.parse` y luego `JSON.stringify` del body, el formato puede cambiar (orden de claves, espacios) y PayPal devuelve `verification_status` distinto de SUCCESS. Construir el body de la petición de verificación insertando el raw body recibido como valor de `webhook_event` (sin re-serializar el objeto).

## Headers de verificación

PayPal envía estos headers; el backend debe reenviarlos a la API de verificación:
- `paypal-transmission-sig`
- `paypal-transmission-id`
- `paypal-transmission-time`
- `paypal-auth-algo`
- `paypal-cert-url`

## Flujo pago único vs suscripción

| Flujo | Return URL | Acción en el front al volver |
|-------|------------|------------------------------|
| Pago único (evento) | `...?payment=success&type=event` | Llamar a `capture-paypal-order` con token/orderId; luego invalidar datos y redirigir. |
| Suscripción | `...?payment=success&type=subscription` | No llamar a capture; solo invalidar datos y redirigir. La activación llega por webhook. |

## Eventos y uso típico

| Evento | Uso |
|--------|-----|
| `PAYMENT.CAPTURE.COMPLETED` / `PAYMENT.CAPTURE.PENDING` | Crear compra única (p. ej. evento); enviar email. Idempotente por userId+eventId y captureId. |
| `BILLING.SUBSCRIPTION.ACTIVATED` | Crear/activar UserMembership; guardar paypalSubscriptionId. |
| `BILLING.SUBSCRIPTION.PAYMENT.SUCCEEDED` | Renovación; extender endDate de la membresía. |
| `PAYMENT.SALE.COMPLETED` / `PAYMENT.SALE.PENDING` | Renovación (algunos flujos); usar billing_agreement_id o resource.id para extender vigencia. |
| `BILLING.SUBSCRIPTION.CANCELLED` | Marcar suscripción cancelada en BD. |

## Recuperar metadata

- En PAYMENT.CAPTURE el `resource` puede no traer `custom_id`. Usar `getOrder(orderId)` (orderId desde `resource.supplemental_data.related_ids.order_id` o desde el link `rel=up`) para leer `purchase_units[0].custom_id`.
- En BILLING.SUBSCRIPTION.ACTIVATED el `resource` puede no traer `custom_id`. Usar `getSubscription(subscriptionId)` para leerlo.

## Cancelación

- Llamar a la API de PayPal para cancelar la suscripción por ID (Subscription/Cancel). Sincronizar estado en BD (UserMembership a CANCELLED o fin de vigencia).
