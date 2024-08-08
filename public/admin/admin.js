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

    //Monday
    $('#mon_homework1').val(`${res.data[0].monday.lessons[0].homework}`)
    $('#mon_homework2').val(`${res.data[0].monday.lessons[1].homework}`)
    $('#mon_homework3').val(`${res.data[0].monday.lessons[2].homework}`)
    $('#mon_homework4').val(`${res.data[0].monday.lessons[3].homework}`)
    $('#mon_homework5').val(`${res.data[0].monday.lessons[4].homework}`)
    $('#mon_homework6').val(`${res.data[0].monday.lessons[5].homework}`)
    $('#mon_homework7').val(`${res.data[0].monday.lessons[6].homework}`)
    $('#mon_homework8').val(`${res.data[0].monday.lessons[7].homework}`)

    //Tuesday
    $('#tue_homework1').val(`${res.data[0].tuesday.lessons[0].homework}`)
    $('#tue_homework2').val(`${res.data[0].tuesday.lessons[1].homework}`)
    $('#tue_homework3').val(`${res.data[0].tuesday.lessons[2].homework}`)
    $('#tue_homework4').val(`${res.data[0].tuesday.lessons[3].homework}`)
    $('#tue_homework5').val(`${res.data[0].tuesday.lessons[4].homework}`)
    $('#tue_homework6').val(`${res.data[0].tuesday.lessons[5].homework}`)
    $('#tue_homework7').val(`${res.data[0].tuesday.lessons[6].homework}`)
    $('#tue_homework8').val(`${res.data[0].tuesday.lessons[7].homework}`)

    //Wednesday
    $('#wed_homework1').val(`${res.data[0].wednesday.lessons[0].homework}`)
    $('#wed_homework2').val(`${res.data[0].wednesday.lessons[1].homework}`)
    $('#wed_homework3').val(`${res.data[0].wednesday.lessons[2].homework}`)
    $('#wed_homework4').val(`${res.data[0].wednesday.lessons[3].homework}`)
    $('#wed_homework5').val(`${res.data[0].wednesday.lessons[4].homework}`)
    $('#wed_homework6').val(`${res.data[0].wednesday.lessons[5].homework}`)
    $('#wed_homework7').val(`${res.data[0].wednesday.lessons[6].homework}`)
    $('#wed_homework8').val(`${res.data[0].wednesday.lessons[7].homework}`)

    //Thursday
    $('#thu_subject1').val(`${res.data[0].thursday.lessons[0].homework}`)
    $('#thu_subject2').val(`${res.data[0].thursday.lessons[1].homework}`)
    $('#thu_subject3').val(`${res.data[0].thursday.lessons[2].homework}`)
    $('#thu_subject4').val(`${res.data[0].thursday.lessons[3].homework}`)
    $('#thu_subject5').val(`${res.data[0].thursday.lessons[4].homework}`)
    $('#thu_subject6').val(`${res.data[0].thursday.lessons[5].homework}`)
    $('#thu_subject7').val(`${res.data[0].thursday.lessons[6].homework}`)
    $('#thu_subject8').val(`${res.data[0].thursday.lessons[7].homework}`)

    //Friday
    $('#fri_subject1').val(`${res.data[0].friday.lessons[0].homework}`)
    $('#fri_subject2').val(`${res.data[0].friday.lessons[1].homework}`)
    $('#fri_subject3').val(`${res.data[0].friday.lessons[2].homework}`)
    $('#fri_subject4').val(`${res.data[0].friday.lessons[3].homework}`)
    $('#fri_subject5').val(`${res.data[0].friday.lessons[4].homework}`)
    $('#fri_subject6').val(`${res.data[0].friday.lessons[5].homework}`)
    $('#fri_subject7').val(`${res.data[0].friday.lessons[6].homework}`)
    $('#fri_subject8').val(`${res.data[0].friday.lessons[7].homework}`)



})