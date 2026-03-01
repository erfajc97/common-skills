---
name: paypal-pagos
description: >
  Contexto para integrar PayPal: pagos únicos (captura al volver), suscripciones, webhooks y cancelaciones.
  Usar al implementar o mantener pagos con PayPal, configurar env, return URL o webhooks.
---

# Skill: PayPal – Pagos

## Cuándo usar este skill
- Al integrar o mantener pagos con PayPal (pago único o suscripción).
- Al configurar variables de entorno o webhooks de PayPal.
- Al distinguir flujo de “captura” (solo pago único) frente a suscripción en la URL de retorno.

## Fuente de verdad
- **Env y webhooks**: `recursos/env-y-webhooks.md`.

## Workflow de integración

1. **Variables de entorno**  
   Definir las que indica `recursos/env-y-webhooks.md`. Sin `PAYPAL_CLIENT_ID` y `PAYPAL_CLIENT_SECRET` no arrancar el adapter. Para webhooks, obligatorio `PAYPAL_WEBHOOK_ID`.

2. **Checkout**
   - **Pago único (orden)**: crear orden con `intent: capture`, `custom_id` = JSON de metadata (userId, type, eventId). Devolver URL de aprobación; el usuario paga en PayPal y vuelve a tu `returnUrl`.
   - **Suscripción**: crear plan (o reutilizar) y suscripción con `custom_id` = metadata; devolver URL de aprobación. PayPal cobra por webhook; no hay “captura” desde el backend al volver.
   - Incluir en **returnUrl** el tipo: `?payment=success&type=event` o `?payment=success&type=subscription` para que el front solo llame a “capture” cuando `type=event`.

3. **Captura de orden (solo pago único)**
   - Tras el retorno del usuario, el frontend debe llamar a un endpoint tipo `POST /payments/capture-paypal-order` con `{ orderId }` (o el token que PayPal añade a la URL). Solo cuando `type=event`. Para `type=subscription` no llamar a capture (PayPal devuelve PAYER_CANNOT_PAY si se intenta capturar una suscripción).

4. **Webhook**
   - Ruta dedicada (p. ej. `POST /payments/webhook/paypal`) con **body raw** y headers de PayPal para verificación.
   - Verificar con `verifyWebhookSignature(rawBody, headers)`; si falla, 400.
   - Eventos mínimos a manejar (tratar PENDING igual que COMPLETED para idempotencia):
     - `PAYMENT.CAPTURE.COMPLETED` y `PAYMENT.CAPTURE.PENDING`: pago único; extraer metadata de `resource` o de la orden por `getOrder(orderId)`; crear compra y enviar email si aplica.
     - `BILLING.SUBSCRIPTION.ACTIVATED`: crear/activar membresía; guardar `subscription_id` en UserMembership.
     - `BILLING.SUBSCRIPTION.PAYMENT.SUCCEEDED` y `PAYMENT.SALE.COMPLETED` / `PAYMENT.SALE.PENDING`: renovaciones; extender vigencia por `subscription_id` o `billing_agreement_id`.
     - `BILLING.SUBSCRIPTION.CANCELLED`: marcar suscripción cancelada en BD.
   - Respuesta 200 con `{ received: true }`.

5. **Cancelación**
   - Endpoint o servicio que reciba `subscriptionId` (PayPal) y llame a la API de cancelación de suscripción de PayPal. Sincronizar estado en BD.

## Teléfono y datos del comprador

Ni Stripe ni PayPal exigen el teléfono para crear la sesión de pago o capturar. Si la app recoge teléfono en checkout, es para el perfil del usuario; no es obligatorio enviarlo a las pasarelas.

## Reglas de diseño
- **Adapter**: Solo llamadas a PayPal; lógica de negocio (EventPurchase, UserMembership, emails) en el PaymentService.
- **Idempotencia**: Comprobar por userId+eventId y por paypalCaptureId antes de crear compras; mismo handler para COMPLETED y PENDING.
- **Return URL con type**: Evitar llamar a capture desde el front cuando el flujo fue suscripción; usar `type=event` | `type=subscription` en la URL de éxito.

## Si algo falla
- Firma inválida: no procesar; 400 y log.
- PAYER_CANNOT_PAY al capturar: suele indicar que se intentó capturar un flujo de suscripción; asegurar que el front solo capture cuando `type=event`.
- Metadata faltante en resource: intentar resolver por `getOrder(orderId)` o `getSubscription(subscriptionId)` usando IDs del resource.
