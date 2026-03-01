---
name: stripe-pagos
description: >
  Contexto para integrar Stripe: pagos únicos, suscripciones, webhooks y cancelaciones.
  Usar al implementar o mantener pagos con Stripe, configurar env, rutas de checkout o webhooks.
---

# Skill: Stripe – Pagos

## Cuándo usar este skill
- Al integrar o mantener pagos con Stripe (pago único o suscripción).
- Al configurar variables de entorno o webhooks de Stripe.
- Al añadir cancelación de suscripciones o renovaciones.

## Fuente de verdad
- **Env y webhooks**: `recursos/env-y-webhooks.md`.

## Workflow de integración

1. **Variables de entorno**  
   Definir las que indica `recursos/env-y-webhooks.md`. Sin `STRIPE_SECRET_KEY` y `STRIPE_WEBHOOK_SECRET` la app no debe arrancar el módulo de pagos.

2. **Checkout**
   - Un solo endpoint de creación de sesión: `mode: 'payment'` (pago único) o `mode: 'subscription'`.
   - Pasar `metadata` (p. ej. `userId`, `type`, `eventId` o `membershipId`) para procesar el webhook.
   - Para suscripciones, reutilizar `customerId` (Stripe Customer ID) si existe; si no, enviar `customer_email`.
   - Respuesta: `{ url, sessionId }`. Redirigir al usuario a `url`.

3. **Webhook**
   - Ruta dedicada (p. ej. `POST /payments/webhook`) con **body sin parsear** (raw) para verificación de firma.
   - Header obligatorio: `stripe-signature`.
   - Verificar con `stripe.webhooks.constructEvent(payload, signature, webhookSecret)`; si falla, devolver 400.
   - Eventos mínimos a manejar:
     - `checkout.session.completed`: crear compra/suscripción según `metadata.type`; guardar `stripeCustomerId` si viene; para suscripción guardar `subscription.id` en la entidad de membresía.
     - `invoice.payment_succeeded`: renovaciones de suscripción (extender vigencia si aplica).
     - `customer.subscription.deleted`: marcar suscripción cancelada en tu BD.
   - Respuesta 200 con `{ received: true }` tras procesar.

4. **Cancelación**
   - Endpoint o servicio que reciba `subscriptionId` (el de Stripe) y llame a `stripe.subscriptions.cancel(subscriptionId)`.
   - Sincronizar estado en tu BD (p. ej. UserMembership a CANCELLED o fin de vigencia).

## Teléfono y datos del comprador

Stripe no exige el teléfono para crear la sesión de checkout ni para el pago. Si la app recoge teléfono en checkout, es para el perfil del usuario; no es obligatorio enviarlo a Stripe.

## Reglas de diseño
- **Adapter**: El adapter de Stripe solo llama a la API de Stripe; la lógica de negocio (crear EventPurchase, UserMembership, enviar email) vive en el PaymentService.
- **Idempotencia**: En webhooks, comprobar por ID único (userId+eventId, o subscriptionId) antes de crear registros para evitar duplicados por reintentos.
- **Moneda**: Parametrizar por env (`STRIPE_CURRENCY`, p. ej. `eur`).

## Si algo falla
- Firma inválida: no procesar; devolver 400 y loguear.
- Metadata incompleta en `checkout.session.completed`: loguear y salir sin crear recurso.
- Cancelación en Stripe puede fallar si la suscripción ya está cancelada; manejar el error y actualizar BD si aplica.
