// This is your test secret API key.
const stripe = require('stripe')('sk_test_51OOilBCbCczEUrZJvQkXov7Zq7oMe8jnen908fHcJ8wnkc9GoRCptemIrD0r8G17KsH84ONK7xDmBs8znGurLIoz00AcYpu6WH');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('public'));

const YOUR_DOMAIN = 'https://mofbeco.netlify.app/';

app.post('/create-checkout-session', async (req, res) => {

  const productId = req.body.productID;
  console.log("productId", productId)

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: productId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.send({clientSecret: session.client_secret});
  console.log("pr===========", session.client_secret)
});

app.get('/session-status', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
});

app.listen(4242, () => console.log('Running on port 4242'));