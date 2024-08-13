// Pages navigation
$('#nav_homework').click(() => {
    $('#events').css('display', 'none');
    $('#distribution').css('display', 'none');
    $('#homework').css('display', 'flex');
    $('#nav_homework').addClass('active_nav');
    $('#nav_events').removeClass('active_nav');
    $('#nav_distribution').removeClass('active_nav');
});
$('#nav_events').click(() => {
    $('#events').css('display', 'flex');
    $('#distribution').css('display', 'none');
    $('#homework').css('display', 'none');
    $('#nav_homework').removeClass('active_nav');
    $('#nav_events').addClass('active_nav');
    $('#nav_distribution').removeClass('active_nav');
});
$('#nav_distribution').click(() => {
    $('#events').css('display', 'none');
    $('#distribution').css('display', 'flex');
    $('#homework').css('display', 'none');
    $('#nav_homework').removeClass('active_nav');
    $('#nav_events').removeClass('active_nav');
    $('#nav_distribution').addClass('active_nav');
});

//schedule
const schedule = {
    monday: [
        { subject: 'Математика' },
        { subject: 'Українська мова' },
        { subject: 'Фізика' },
        { subject: 'Англійська мова' },
        { subject: 'Біологія' },
        { subject: 'Історія' },
        { subject: 'Хімія' },
        { subject: 'Музика' }
    ],
    tuesday: [
        { subject: 'Хімія' },
        { subject: 'Історія' },
        { subject: 'Англійська мова' },
        { subject: 'Англійська мова' },
        { subject: 'Англійська мова' },
        { subject: 'Англійська мова' },
        { subject: 'Англійська мова' },
        { subject: 'Англійська мова' },
    ],
    wednesday: [
        { subject: 'Біологія' },
        { subject: 'Географія' },
        { subject: 'Музика' },
        { subject: 'Географія' },
        { subject: 'Географія' },
        { subject: 'Географія' },
        { subject: 'Географія' },
        { subject: 'Географія' },
    ],
    thursday: [
        { subject: 'Фізкультура' },
        { subject: 'Інформатика' },
        { subject: 'Література' },
        { subject: 'Фізкультура' },
        { subject: 'Фізкультура' },
        { subject: 'Фізкультура' },
        { subject: 'Фізкультура' },
        { subject: 'Фізкультура' },
    ],
    friday: [
        { subject: 'Трудове навчання' },
        { subject: 'Етика' },
        { subject: 'Захист Вітчизни' },
        { subject: 'Етика' },
        { subject: 'Захист Вітчизни' },
        { subject: 'Інформатика' },
        { subject: 'Інформатика' },
        { subject: 'Інформатика' },
    ]
};


document.addEventListener('DOMContentLoaded', (event) => {
    updateSchedule(schedule);
    // Other code for fetching and displaying homework
});


//homework saving
$('.setChanges_btn').click(()=>{
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const homeworkData = {};

    days.forEach(day => {
        const dayElement = document.getElementById(day);
        const lessons = [];
        for (let i = 1; i <= 8; i++) {
            const subjectElement = dayElement.querySelector(`#${day.toLowerCase().slice(0, 3)}_subject${i}`);
            const homeworkElement = dayElement.querySelector(`#${day.toLowerCase().slice(0, 3)}_homework${i}`);

            if (subjectElement && homeworkElement) {
                const subject = subjectElement.innerText;
                const homework = homeworkElement.value;
                lessons.push({ subject, homework });
                // console.log(lessons)
            }
        }
        homeworkData[day.toLowerCase()] = {
            lessons: lessons
        };
        console.log(homeworkData)
    });

    saveHomework(homeworkData);
})

//homework displaying
document.addEventListener('DOMContentLoaded', (event) => {
    axios.get('/api/getHomework')
    .then((res) => {
        const homework = res.data[0];
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach((day, index) => {
            for (let i = 0; i < 8; i++) {
                document.querySelector(`#${day.substring(0, 3)}_homework${i + 1}`).value = homework[day].lessons[i].homework;
            }
        });
    })
    .catch((error) => {
        console.error('Error fetching homework:', error);
    });
});

//homework updating
document.querySelector('.setChanges_btn').addEventListener('click', function() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const homeworkData = {};

    days.forEach(day => {
        const dayElement = document.getElementById(day.charAt(0).toUpperCase() + day.slice(1));
        const lessons = [];
        for (let i = 1; i <= 8; i++) {
            const homeworkElement = dayElement.querySelector(`#${day.substring(0, 3)}_homework${i}`);
            if (homeworkElement) {
                const homework = homeworkElement.value;
                lessons.push({ homework });
            }
        }
        homeworkData[day] = {
            lessons: lessons
        };
    });

    saveHomework(homeworkData);
    
});
function saveHomework(homeworkData) {
    console.log(homeworkData);
    
    axios.post('/api/updateHomework', homeworkData, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Success:', response.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

//schedule updating
function updateSchedule(schedule) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    days.forEach(day => {
        const daySchedule = schedule[day];
        daySchedule.forEach((lesson, index) => {
            const subjectElement = document.querySelector(`#${day.substring(0, 3)}_subject${index + 1}`);
            const homeworkElement = document.querySelector(`#${day.substring(0, 3)}_homework${index + 1}`);

            if (subjectElement) {
                subjectElement.textContent = lesson.subject ? lesson.subject + ':' : 'Вільний урок:';
            }
            if (homeworkElement) {
                homeworkElement.placeholder = lesson.homework || 'some homework';
            }
        });
    });
}

// Call this function after the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateSchedule(schedule);  // Assuming 'schedule' is available in the scope
});
