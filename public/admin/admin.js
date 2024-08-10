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

//homework saving
$('.setChanges_btn').click(()=>{
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const homeworkData = {};

    days.forEach(day => {
        const dayElement = document.getElementById(day);
        const lessons = [];
        for (let i = 1; i <= 8; i++) {
            const subjectElement = dayElement.querySelector(`#${day.toLowerCase().slice(0, 3)}_subject${i}`);
            // console.log(subjectElement.innerText)
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
    console.log(homeworkData)
    fetch('/api/updateHomework', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(homeworkData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}