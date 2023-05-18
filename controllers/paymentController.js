const BigPromise = require("../middlewares/bigPromises");
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Razorpay = require("razorpay");


exports.sendStripeKey = BigPromise(async (req, res, next) => {

    res.status(200).json({
        stripekey: process.env.STRIPE_API_KEY,
    });
});

exports.captureStripePayment = BigPromise(async (req, res, next) => {

    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'inr',
              product_data: {
                name: req.body.name,
              },
              unit_amount: req.body.amount,
            },
            quantity: req.body.quantity,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:4242/success.html',
        cancel_url: 'http://localhost:4242/cancel.html',
      });


      res.status(200).json({
        success: true,
        client_secret : session,
      })
});

exports.sendRazorpayKey = BigPromise(async (req, res, next) => {

    res.status(200).json({
        razorpaykey: process.env.RAZORPAY_API_KEY,
    });
});

exports.captureRazorpayPayment = BigPromise(async (req, res, next) => {

    var instance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY, key_secret: process.env.RAZORPAY_SECRET })

    const myOrder = instance.orders.create({
      amount: req.body.amount,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        key1: "value3",
        key2: "value2"
      }
    })

      res.status(200).json({
        success: true,
        order : myOrder,
        amount : req.body.amount
      })
});

