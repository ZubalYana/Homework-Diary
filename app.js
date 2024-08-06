const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
dotenv.config();
const PORT = 3000;
const TOKEN = '7434998252:AAGvjoW9XAUQUbgNwN0YQs7cbsSMrooX8BA';
const bot = new TelegramBot(TOKEN, { polling: true });
const usersFilePath = path.join(__dirname, 'users.json');
let users = [];
// mongodb+srv://zubalana0:uCwCHLBRS6IBvGAl@cluster0.nkm20.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://zubalana0:uCwCHLBRS6IBvGAl@cluster0.nkm20.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
if (fs.existsSync(usersFilePath)) {
    users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    if (!users.includes(chatId)) {
        users.push(chatId);
        fs.writeFileSync(usersFilePath, JSON.stringify(users));
    }

    bot.sendMessage(chatId, "\n Привіт! Бот активовано. \nОтримуйте всю інформацію про домашнє завдання, дедлайни та події! \nВажливо: при перенавантаженні серверу, можлива затримка повідомлення до кількох хвилин. \nУ разі виникнення будь-яких проблем у використанні чи недостачі інформаціЇ, повідомляйте: @yanavesq.");
});

app.post('/send', (req, res) => {
    console.log(req.body.message);
    const message = req.body.message;

    users.forEach(userId => {
        bot.sendMessage(userId, message);
    });

    res.sendStatus(200);
});

bot.on('message', (msg) => {
    const userId = 1132590035;
    const chatId = msg.chat.id;
    const message = msg.text || '';

    if (chatId !== userId) {
        bot.sendMessage(userId, `New message from ${chatId}: ${message}`);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});
