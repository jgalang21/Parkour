const stripe = require('stripe')(
  'sk_test_51HSpkTIvprkD8Pr3COPkpVl0hWouubBZ1sgipbWIkbv1RKN9HXsdKgIhbMhMGLBxI6XBRRoSCSqad54K0ilqc17700MD2SPdkc'
);

module.exports.createCustomer = async () => {
  const customer = await stripe.customers.create();
  return customer;
};

module.exports.getCustomer = async (stripeId) => {
  const customer = await stripe.customers.retrieve(stripeId);
  return customer;
};

module.exports.getCards = async (stripeId) => {
  const stripeCards = await stripe.customers.listSources(stripeId, {
    object: 'card'
  });
  return stripeCards;
};

module.exports.deleteCard = async (stripeId, cardId) => {
  const deleted = await stripe.customers.deleteSource(stripeId, cardId);
  return deleted;
};

module.exports.updateDefaultCard = async (stripeId, cardId) => {
  await stripe.customers.update(stripeId, { default_source: cardId });
};

module.exports.createCard = async (stripeId, source) => {
  const cards = await stripe.customers.createSource(stripeId, {
    source: source
  });
  return cards;
};
