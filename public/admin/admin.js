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
document.querySelector('.setChanges_btn').addEventListener('click', function() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const homeworkData = {};

    function parseDate(dateStr) {
        const [day, month] = dateStr.split('.');
        const year = new Date().getFullYear(); 
        return new Date(`${year}-${month}-${day}`);
    }

    days.forEach(day => {
        const dayElement = document.getElementById(day);
        const lessons = [];
        for (let i = 1; i <= 8; i++) {
            const subjectElement = dayElement.querySelector(`#${day.toLowerCase().slice(0, 3)}_subject${i}`);
            const homeworkElement = dayElement.querySelector(`#${day.toLowerCase().slice(0, 3)}_homework${i}`);

            if (subjectElement && homeworkElement) {
                const subject = subjectElement.innerText.replace(':', '');
                const homework = homeworkElement.value;
                lessons.push({ subject, homework });
            }
        }
        homeworkData[day.toLowerCase()] = {
            date: parseDate(dayElement.querySelector('.date').innerText),
            lessons: lessons
        };
    });

    console.log(homeworkData); 
    saveHomework(homeworkData);
});
function saveHomework(homeworkData) {
    fetch('/api/saveHomework', {
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

//homework appending
axios.get('/api/getHomework')
.then((res)=>{
    console.log(res.data)
    $('#mon_homework1').val(`${res.data[0].monday.lessons[0].homework}`)
})