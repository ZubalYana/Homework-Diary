$(document).ready(function() {
    //page navigation
    $('#events').hide();
    $('#distribution').hide();
    $('#nav_homework').click(() => {
        $('#events').hide();
        $('#distribution').hide();
        $('#homework').css('display', 'flex');
        $('#nav_homework').addClass('active_nav');
        $('#nav_events').removeClass('active_nav');
        $('#nav_distribution').removeClass('active_nav');
    });
    $('#nav_events').click(() => {
        $('#events').css('display', 'flex');
        $('#distribution').hide();
        $('#homework').hide();
        $('#nav_homework').removeClass('active_nav');
        $('#nav_events').addClass('active_nav');
        $('#nav_distribution').removeClass('active_nav');
    });
    $('#nav_distribution').click(() => {
        $('#events').hide();
        $('#distribution').css('display', 'flex');
        $('#homework').hide();
        $('#nav_homework').removeClass('active_nav');
        $('#nav_events').removeClass('active_nav');
        $('#nav_distribution').addClass('active_nav');
    });

    // Function to populate the schedule in the UI
    function populateSchedule(schedule) {
        if (!schedule) return;

        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

        days.forEach(day => {
            schedule[day].forEach((item, index) => {
                $(`#${day.substring(0, 3)}_subject${index + 1}`).val(item.subject);
            });
        });
    }

    // Fetch and populate schedule on page load
    function fetchAndPopulateSchedule() {
        axios.get('/api/getSchedule')
            .then((res) => {
                const schedule = res.data;
                populateSchedule(schedule);
            })
            .catch((error) => {
                console.error('Error fetching schedule:', error);
            });
    }

    fetchAndPopulateSchedule();

    // Save the updated schedule
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

    // Handle saving and updating the schedule
    $('.setChanges_btn').click(function() {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const scheduleData = {};

        days.forEach(day => {
            const dayKey = day.toLowerCase();
            scheduleData[dayKey] = [];

            for (let i = 1; i <= 8; i++) {
                const subject = $(`#${dayKey.substring(0, 3)}_subject${i}`).val();

                if (subject) {
                    scheduleData[dayKey].push({ subject });
                }
            }
        });

        saveSchedule(scheduleData);
    });

    // Save the homework
    function saveHomework(homeworkData) {
        console.log('Saving Homework:', homeworkData);
        axios.post('/api/updateHomework', homeworkData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('Homework Saved:', response.data);
        })
        .catch(error => {
            console.error('Error saving homework:', error);
        });
    }

    // Handle saving and updating homework
    $('.setChanges_btn').click(() => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const homeworkData = {};
        days.forEach(day => {
            const dayKey = day.toLowerCase();
            homeworkData[dayKey] = {
                lessons: []
            };

            for (let i = 1; i <= 8; i++) {
                const homework = $(`#${dayKey.substring(0, 3)}_homework${i}`).val();

                if (homework) {
                    homeworkData[dayKey].lessons.push({ homework });
                }
            }
        });
        saveHomework(homeworkData);
    });

    //fetch and populate homework on page load
    function fetchAndPopulateHomework() {
        axios.get('/api/getHomework')
            .then((res) => {
                const homework = res.data[0];
                const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

                days.forEach(day => {
                    homework[day].lessons.forEach((lesson, index) => {
                        $(`#${day.substring(0, 3)}_homework${index + 1}`).val(lesson.homework);
                    });
                });
            })
            .catch((error) => {
                console.error('Error fetching homework:', error);
            });
    }
    fetchAndPopulateHomework();

    //distribution sending
    $('.sendDistribution_btn').click(()=>{
        const distributionText = $('#distribution_textarea').val()
        console.log(distributionText)
        axios.post('/distribution', distributionText)
    })
});
