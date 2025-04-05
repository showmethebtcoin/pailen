
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Payment = require('../models/Payment');

// Crear una sesión de checkout para suscripciones
const createCheckoutSession = async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;
    
    if (!priceId || !successUrl || !cancelUrl) {
      return res.status(400).json({ message: 'Faltan parámetros requeridos' });
    }
    
    // Busca si el usuario ya tiene un customer ID de Stripe
    let customer;
    const user = await User.findByPk(req.user.id);
    
    if (user.stripeCustomerId) {
      // Si ya tiene un customer ID, lo usamos
      customer = user.stripeCustomerId;
    } else {
      // Si no tiene, creamos un nuevo customer
      const newCustomer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id.toString()
        }
      });
      
      // Guardamos el customer ID en la base de datos
      await user.update({ stripeCustomerId: newCustomer.id });
      customer = newCustomer.id;
    }
    
    // Creamos la sesión de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customer,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: req.user.id.toString()
      }
    });
    
    res.json({ url: session.url });
  } catch (error) {
    req.logger.error('Error al crear sesión de checkout:', error);
    res.status(500).json({ message: 'Error al crear sesión de checkout' });
  }
};

// Webhook para manejar eventos de Stripe
const handleWebhook = async (req, res) => {
  // Esta ruta recibe datos raw, no JSON parseado
  const sig = req.headers['stripe-signature'];
  
  let event;
  
  try {
    // Verificar la firma del evento
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Manejar el evento según su tipo
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata.userId;
      
      // Registrar el pago en la base de datos
      await Payment.create({
        userId: userId,
        stripePaymentId: session.payment_intent,
        amount: session.amount_total / 100, // Stripe usa centavos
        currency: session.currency,
        status: 'completed',
        paymentDate: new Date(),
        subscriptionId: session.subscription,
        planType: 'premium' // Ajustar según sea necesario
      });
      
      // Actualizar el estado de la suscripción del usuario
      const user = await User.findByPk(userId);
      if (user) {
        await user.update({
          subscription: {
            status: 'active',
            planId: 'premium',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
          }
        });
      }
      
      break;
    }
    
    case 'invoice.paid': {
      const invoice = event.data.object;
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      const userId = subscription.metadata.userId;
      
      // Registrar el pago de renovación
      await Payment.create({
        userId: userId,
        stripePaymentId: invoice.payment_intent,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        status: 'completed',
        paymentDate: new Date(),
        subscriptionId: invoice.subscription,
        planType: 'premium'
      });
      
      // Extender el periodo de suscripción
      const user = await User.findByPk(userId);
      if (user) {
        await user.update({
          subscription: {
            status: 'active',
            planId: 'premium',
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
          }
        });
      }
      
      break;
    }
    
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const userId = subscription.metadata.userId;
      
      // Cancelar la suscripción del usuario
      const user = await User.findByPk(userId);
      if (user) {
        await user.update({
          subscription: {
            status: 'cancelled',
            planId: 'basic',
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
          }
        });
      }
      
      break;
    }
  }
  
  // Responder a Stripe
  res.json({ received: true });
};

// Obtener estado de la suscripción
const getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Si el usuario tiene un ID de suscripción, obtener detalles actualizados
    if (user.subscription && user.subscription.subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(
        user.subscription.subscriptionId
      );
      
      // Actualizar información de la suscripción
      const updatedSubscription = {
        status: subscription.status,
        planId: user.subscription.planId,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      };
      
      await user.update({ subscription: updatedSubscription });
      
      return res.json({ subscription: updatedSubscription });
    }
    
    // Si no tiene suscripción, devolver suscripción básica
    res.json({ subscription: user.subscription || { status: 'none', planId: 'basic' } });
  } catch (error) {
    req.logger.error('Error al obtener estado de suscripción:', error);
    res.status(500).json({ message: 'Error al obtener estado de suscripción' });
  }
};

// Cancelar suscripción
const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user || !user.subscription || !user.subscription.subscriptionId) {
      return res.status(404).json({ message: 'Suscripción no encontrada' });
    }
    
    // Cancelar la suscripción en Stripe
    await stripe.subscriptions.del(user.subscription.subscriptionId);
    
    // Actualizar estado en base de datos
    await user.update({
      subscription: {
        ...user.subscription,
        status: 'cancelled'
      }
    });
    
    res.json({ message: 'Suscripción cancelada correctamente' });
  } catch (error) {
    req.logger.error('Error al cancelar suscripción:', error);
    res.status(500).json({ message: 'Error al cancelar suscripción' });
  }
};

module.exports = {
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
  cancelSubscription
};
