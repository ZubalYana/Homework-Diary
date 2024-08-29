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
const Schedule = require('./models/Schedule');
const Events = require('./models/Events');
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
                [{ text: 'Струкрура навчання'}]
            ],
            resize_keyboard: true
        }
    };
    bot.sendMessage(chatId, '\n Привіт! Бот активовано. \nОтримуйте всю інформацію про домашнє завдання, дедлайни та події! \nВажливо: при перенавантаженні серверу, можлива затримка повідомлення до кількох хвилин. \nУ разі виникнення будь-яких проблем у використанні чи недостачі інформаціЇ, повідомляйте: @yanavesq.', options);
});
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    if (msg.text === 'Домашнє завдання') {
        try {
            const homework = await Homework.findOne().lean();
            const schedule = await Schedule.findOne().lean();

            if (homework && schedule) {
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
                bot.sendMessage(chatId, 'Домашнє завдання або розклад не знайдено.', { parse_mode: 'HTML' });
            }
        } catch (error) {
            console.error('Error retrieving homework or schedule:', error);
            bot.sendMessage(chatId, 'Сталася помилка при отриманні домашнього завдання або розкладу.', { parse_mode: 'HTML' });
        }
    }else if (msg.text === 'Події') {
        try{
            bot.sendMessage(chatId, 'Найближчі події: \n\n2 вересня, понеділок: <b>початок навчального року</b> \nЛінійка відбудеться о 9:30, форма одягу - вишиванка.', { parse_mode: 'HTML' });
        }catch(err){
            console.log(err)
        }
        // try {
        //     const events = await Events.find().lean();
        //     if (events.length > 0) {
        //         let eventsMessage = '<b>Найближчі події:</b>\n\n';
        //         events.forEach(event => {
        //             const formattedDate = new Date(event.date).toLocaleDateString('uk-UA', {
        //                 weekday: 'long',
        //                 year: 'numeric',
        //                 month: 'long',
        //                 day: 'numeric'
        //             });
        //             eventsMessage += `${formattedDate}: <b>${event.name}</b>\n`;
        //             if (event.details) {
        //                 eventsMessage += `Деталі: ${event.details}\n`;
        //             }
        //             eventsMessage += '\n';
        //         });
        //         bot.sendMessage(chatId, eventsMessage, { parse_mode: 'HTML' });
        //     } else {
        //         bot.sendMessage(chatId, 'Немає запланованих подій.', { parse_mode: 'HTML' });
        //     }
        // } catch (error) {
        //     console.error('Error retrieving events:', error);
        //     bot.sendMessage(chatId, 'Сталася помилка при отриманні подій.', { parse_mode: 'HTML' });
        // }
    }
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
app.post('/api/updateSchedule', (req, res) => {
    const scheduleData = req.body;

    Schedule.findOneAndUpdate({}, scheduleData, { upsert: true, new: true })
        .then(updatedSchedule => {
            res.json({ message: 'Schedule updated successfully', updatedSchedule });
        })
        .catch(error => {
            console.error('Error updating schedule:', error);
            res.status(500).json({ message: 'Failed to update schedule' });
        });
});
app.post('/distribution', (req,res)=>{
    const distribution = req.body.distributionText;
    users.forEach(userId => {
        bot.sendMessage(userId, distribution);
    });
    res.sendStatus(200);
})
app.post('/events', async (req ,res)=>{
    try{
        const newEvent = new Events({
            name: req.body.eventName,
            date: req.body.eventDate,
            details: req.body.eventDetails
        });
        const savedEvent = await newEvent.save()
        res.status(201).json(savedEvent);
    }catch(err){
        console.error('Error saving event:', err);
        res.status(500).json({ err: 'Failed to save event' });
    }

})
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
app.get('/api/getSchedule', (req, res) => {
    Schedule.findOne({})
        .then(schedule => {
            res.json(schedule);
        })
        .catch(error => {
            console.error('Error fetching schedule:', error);
            res.status(500).json({ message: 'Failed to fetch schedule' });
        });
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