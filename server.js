const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Currency = require('./models/Currency');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://azhakimi:azmihakimi@cluster0.ehnpeeg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// التحقق من صحة بيانات العملة
function validateCurrency(currency) {
    if (!currency.id || !currency.codeId || !currency.curr_name) {
        throw new Error('Missing required fields');
    }
}

app.get('/', (req, res) => {
    res.send('Welcome to the Rest API');
});

// جلب جميع العملات
app.get('/rates', async (req, res) => {
    try {
  const rates = await Currency.find();
  res.json(rates);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// جلب عملة محددة بواسطة id
app.get('/rates/:id', async (req, res) => {
    try {
        const currency = await Currency.findOne({ id: req.params.id });
        if (!currency) return res.status(404).json({ message: 'Currency not found' });
        res.json(currency);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// إضافة عملة جديدة
app.post('/rates', async (req, res) => {
  try {
    validateCurrency(req.body); // تحقق من البيانات قبل الحفظ
    const currency = new Currency(req.body);
    await currency.save();
    res.status(201).json(currency);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// تحديث عملة
app.put('/rates/:id', async (req, res) => {
  try {
    validateCurrency(req.body);
    const updated = await Currency.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Currency not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }

});

// حذف عملة
app.delete('/rates/:id', async (req, res) => {
  const deleted = await Currency.findOneAndDelete({ id: req.params.id });
  if (!deleted) return res.status(404).json({ message: 'Currency not found' });
  res.json(deleted);
});

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`Server running on  ${PORT}`);
    console.log(`API Endpoints:`);
    console.log(`- GET /rates`);
    console.log(`- GET /rates/:id`);
    console.log(`- POST /rates`);
    console.log(`- PUT /rates/:id`);
    console.log(`- DELETE /rates/:id`);
});
