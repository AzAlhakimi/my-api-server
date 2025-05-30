const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const RATES_FILE = path.join(__dirname, 'update_rate');

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// قراءة البيانات مع معالجة الأخطاء
function readRates() {
    try {
        const data = fs.readFileSync(RATES_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading rates file:', err);
        return { posts: [] }; // إرجاع مصفوفة فارغة إذا كان الملف غير موجود
    }
}

// كتابة البيانات مع معالجة الأخطاء
function writeRates(content) {
    try {
        fs.writeFileSync(RATES_FILE, JSON.stringify(content, null, 2), 'utf-8');
    } catch (err) {
        console.error('Error writing to rates file:', err);
        throw err;
    }
}

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
app.get('/rates', (req, res) => {
    try {
        const data = readRates();
        res.json(data.posts);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// جلب عملة محددة بواسطة id
app.get('/rates/:id', (req, res) => {
    try {
        const data = readRates();
        const currency = data.posts.find(item => item.id === req.params.id);
        if (!currency) {
            return res.status(404).json({ message: 'Currency not found' });
        }
        res.json(currency);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// إضافة عملة جديدة
app.post('/rates', (req, res) => {
    try {
        const data = readRates();
        const newCurrency = req.body;
        
        validateCurrency(newCurrency);
        
        // التحقق من عدم وجود id مكرر
        if (data.posts.some(item => item.id === newCurrency.id)) {
            return res.status(400).json({ message: 'Currency ID already exists' });
        }
        
        data.posts.push(newCurrency);
        writeRates(data);
        res.status(201).json(newCurrency);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// تحديث عملة
app.put('/rates/:id', (req, res) => {
    try {
        const data = readRates();
        const id = req.params.id;
        const index = data.posts.findIndex(item => item.id === id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Currency not found' });
        }
        
        const updatedCurrency = { ...data.posts[index], ...req.body };
        validateCurrency(updatedCurrency);
        
        data.posts[index] = updatedCurrency;
        writeRates(data);
        res.json(updatedCurrency);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// حذف عملة
app.delete('/rates/:id', (req, res) => {
    try {
        const data = readRates();
        const id = req.params.id;
        const index = data.posts.findIndex(item => item.id === id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Currency not found' });
        }
        
        const deleted = data.posts.splice(index, 1);
        writeRates(data);
        res.json(deleted[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
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
