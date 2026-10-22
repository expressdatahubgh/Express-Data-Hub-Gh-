const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const app = express();
app.use(express.json());

app.get('/', (req,res)=> res.send('Express DataHub LIVE - Ready'));

app.post('/paystack-webhook', async (req,res)=>{
  try{
    const secret = process.env.PAYSTACK_SECRET;
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    if(hash !== req.headers['x-paystack-signature']) return res.status(400).send('invalid');
    if(req.body.event !== 'charge.success') return res.sendStatus(200);
    const data = req.body.data;
    const meta = data.metadata || {};
    console.log('Payment:', data.amount, meta);
    res.sendStatus(200);
  }catch(e){
    console.error(e);
    res.sendStatus(200);
  }
});

app.listen(10000, ()=> console.log('Running'));
