const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
dotenv.config();
const TOKEN = '7434998252:AAGvjoW9XAUQUbgNwN0YQs7cbsSMrooX8BA';
const bot = new TelegramBot(TOKEN, { polling: true });
const usersFilePath = path.join(__dirname, 'users.json');
let users = [];
const mongoose = require('mongoose');
const env = require('dotenv').config();
const PORT = process.env.PORT || 3000;
const Homework = require('./models/Homework');
mongoose.connect(`mongodb+srv://zubalana0:${process.env.PASSWORD}@cluster0.niyre.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
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

    const options = {
        reply_markup: {
            keyboard: [
                [{ text: 'Домашнє завдання' }, { text: 'Події' }],
            ],
            resize_keyboard: true
        }
    };
    bot.sendMessage(chatId, '\n Привіт! Бот активовано. \nОтримуйте всю інформацію про домашнє завдання, дедлайни та події! \nВажливо: при перенавантаженні серверу, можлива затримка повідомлення до кількох хвилин. \nУ разі виникнення будь-яких проблем у використанні чи недостачі інформаціЇ, повідомляйте: @yanavesq.', options);
});
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const schedule = {
        monday: [
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' }
        ],
        tuesday: [
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
        ],
        wednesday: [
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
        ],
        thursday: [
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
        ],
        friday: [
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
            { subject: 'Розклад' },
        ]
    };

    if (msg.text === 'Домашнє завдання') {
        try {
            const homework = await Homework.findOne().lean();
            if (homework) {
                const daysInUkrainian = {
                    monday: 'Понеділок',
                    tuesday: 'Вівторок',
                    wednesday: 'Середа',
                    thursday: 'Четвер',
                    friday: 'П’ятниця'
                };

                let homeworkMessage = '<b>Домашнє завдання та розклад на тиждень:</b>\n\n';
                ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
                    if (homework[day] || schedule[day]) {
                        homeworkMessage += `\n<b>${daysInUkrainian[day]}:</b>\n`;
                        
                        if (schedule[day]) {
                            schedule[day].forEach((lesson, index) => {
                                homeworkMessage += ` ${index + 1}. <b>${lesson.subject ? lesson.subject + ': ' : ''}</b>`;
                                
                                if (homework[day] && homework[day].lessons[index] && homework[day].lessons[index].homework) {
                                    homeworkMessage += `${homework[day].lessons[index].homework}`;
                                }
                                
                                homeworkMessage += `\n`;
                            });
                        }
                    }
                });

                bot.sendMessage(chatId, homeworkMessage, { parse_mode: 'HTML' }); 
            } else {
                bot.sendMessage(chatId, 'Домашнє завдання не знайдено.', { parse_mode: 'HTML' });
            }
        } catch (error) {
            console.error('Error retrieving homework:', error);
            bot.sendMessage(chatId, 'Сталася помилка при отриманні домашнього завдання.', { parse_mode: 'HTML' });
        }
    } else if (msg.text === 'Події') {
        bot.sendMessage(chatId, 'Найблищі події: \n<b>1 вересня, неділя:</b> початок навчального року. \nДетальніша інформація з\'явиться блище до кінця серпня.', { parse_mode: 'HTML' });
    }
    
    const options = {
        reply_markup: {
            keyboard: [
                [{ text: 'Button 1' }, { text: 'Button 2' }],
                [{ text: 'Button 3' }]
            ],
            resize_keyboard: true
        }
    };
});

app.post('/send', (req, res) => {
    console.log(req.body.message);
    const message = req.body.message;

    users.forEach(userId => {
        bot.sendMessage(userId, message);
    });

    res.sendStatus(200);
});
app.post('/api/saveHomework', async (req, res) => {
    try {
        const { monday, tuesday, wednesday, thursday, friday } = req.body;
        const newHomework = new Homework({
            monday,
            tuesday,
            wednesday,
            thursday,
            friday
        });
        await newHomework.save();
        res.status(201).json({ message: 'Homework saved successfully!' });
    } catch (error) {
        console.error('Error saving homework:', error);
        res.status(500).json({ error: 'Failed to save homework', details: error.message });
    }
});
app.post('/api/updateHomework', async (req, res) => {
    try {
        const { monday, tuesday, wednesday, thursday, friday } = req.body;

        const updateResult = await Homework.findOneAndUpdate(
            {}, 
            { monday, tuesday, wednesday, thursday, friday }, 
            { new: true, upsert: true, timeout: 20000 }
        );

        if (updateResult) {
            res.status(200).json({ success: true, message: 'Homework updated successfully' });
        } else {
            res.status(404).json({ error: 'Failed to update homework', details: 'Homework not found' });
        }
    } catch (error) {
        console.error('Error updating homework:', error);
        res.status(500).json({ error: 'Failed to update homework', details: error.message });
    }
});
bot.on('message', (msg) => {
    const userId = 1132590035;
    const chatId = msg.chat.id;
    const message = msg.text || '';

    if (chatId !== userId) {
        bot.sendMessage(userId, `New message from ${chatId}: ${message}`);
    }
});
app.get('/api/getHomework', async (req, res) => {
    try {
        const homework = await Homework.find();
        res.status(200).json(homework);
    } catch (err) {
        res.status(500).json({ message: 'Error when getting homework', error: err.message });
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