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

$(document).ready(function() {
    function populateSchedule() {
        schedule.monday.forEach((item, index) => {
            $(`#mon_subject${index + 1}`).val(item.subject);
        });
        schedule.tuesday.forEach((item, index) => {
            $(`#tue_subject${index + 1}`).val(item.subject);
        });
        schedule.wednesday.forEach((item, index) => {
            $(`#wed_subject${index + 1}`).val(item.subject);
        });
        schedule.thursday.forEach((item, index) => {
            $(`#thu_subject${index + 1}`).val(item.subject);
        });
        schedule.friday.forEach((item, index) => {
            $(`#fri_subject${index + 1}`).val(item.subject);
        });
    }
    populateSchedule();

    $('.setChanges_btn').click(function() {
        schedule.monday.forEach((item, index) => {
            item.subject = $(`#mon_subject${index + 1}`).val();
        });
        schedule.tuesday.forEach((item, index) => {
            item.subject = $(`#tue_subject${index + 1}`).val();
        });
        schedule.wednesday.forEach((item, index) => {
            item.subject = $(`#wed_subject${index + 1}`).val();
        });
        schedule.thursday.forEach((item, index) => {
            item.subject = $(`#thu_subject${index + 1}`).val();
        });
        schedule.friday.forEach((item, index) => {
            item.subject = $(`#fri_subject${index + 1}`).val();
        });
        console.log('Updated Schedule:', schedule);
    });
});

// Homework | Schedule saving and updating
$('.setChanges_btn').click(() => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const homeworkData = {};
    const scheduleData = {};

    days.forEach(day => {
        const dayElement = document.getElementById(day);
        const lessons = [];
        const subjects = [];

        for (let i = 1; i <= 8; i++) {
            const subjectElement = dayElement.querySelector(`#${day.toLowerCase().slice(0, 3)}_subject${i}`);
            const homeworkElement = dayElement.querySelector(`#${day.toLowerCase().slice(0, 3)}_homework${i}`);

            if (subjectElement && homeworkElement) {
                const homework = homeworkElement.value;
                const subject = subjectElement.value;

                lessons.push({ homework });
                subjects.push({ subject });
            }
        }
        homeworkData[day.toLowerCase()] = {
            lessons: lessons
        };
        scheduleData[day.toLowerCase()] = subjects;
    });

    saveHomework(homeworkData);
    saveSchedule(scheduleData);
});

function saveSchedule(scheduleData) {
    console.log('Saving Schedule:', scheduleData);
    axios.post('/api/updateSchedule', scheduleData, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Schedule Saved:', response.data);
    })
    .catch(error => {
        console.error('Error saving schedule:', error);
    });
}


// Function to save homework (no subject saving)
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

// Homework displaying
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

// Schedule updating only on the frontend
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

document.addEventListener('DOMContentLoaded', () => {
    updateSchedule(schedule);  
});
