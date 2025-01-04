$(document).ready(function() {
    //page navigation
    $('#events').hide();
    $('#distribution').hide();
    $('.nav_homework').click(() => {
        $('#events').hide();
        $('#distribution').hide();
        $('#homework').css('display', 'flex');
        $('#notes').css('display', 'none');
        $('.nav_notes').removeClass('active_nav');
        $('.nav_homework').addClass('active_nav');
        $('.nav_events').removeClass('active_nav');
        $('.nav_distribution').removeClass('active_nav');
        $('.burgerPopup_con').css('display', 'none')
    });
    $('.nav_events').click(() => {
        $('#events').css('display', 'flex');
        $('#distribution').hide();
        $('#homework').hide();
        $('#notes').css('display', 'none');
        $('.nav_notes').removeClass('active_nav');
        $('.nav_homework').removeClass('active_nav');
        $('.nav_events').addClass('active_nav');
        $('.nav_distribution').removeClass('active_nav');
        $('.burgerPopup_con').css('display', 'none')
    });
    $('.nav_distribution').click(() => {
        $('#events').hide();
        $('#distribution').css('display', 'flex');
        $('#homework').hide();
        $('#notes').css('display', 'none');
        $('.nav_notes').removeClass('active_nav');
        $('.nav_homework').removeClass('active_nav');
        $('.nav_events').removeClass('active_nav');
        $('.nav_distribution').addClass('active_nav');
        $('.burgerPopup_con').css('display', 'none')
    });
    $('.nav_notes').click(() => {
        $('#events').hide();
        $('#distribution').css('display', 'none');
        $('#homework').hide();
        $('#notes').css('display', 'flex');
        $('.nav_notes').addClass('active_nav');
        $('.nav_homework').removeClass('active_nav');
        $('.nav_events').removeClass('active_nav');
        $('.nav_distribution').removeClass('active_nav');
        $('.burgerPopup_con').css('display', 'none')
    });
    $('.burger').click(()=>{
        $('.burgerPopup_con').css('display', 'flex')
    })
    $('#burgerXmark').click(()=>{
        $('.burgerPopup_con').css('display', 'none')
    })
    //function to populate the schedule in the UI
    function populateSchedule(schedule) {
        if (!schedule) return;

        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

        days.forEach(day => {
            schedule[day].forEach((item, index) => {
                $(`#${day.substring(0, 3)}_subject${index + 1}`).val(item.subject);
            });
        });
    }

    //fetch and populate schedule on page load
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

    //save the updated schedule
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
    
    //saving and updating the schedule
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
        axios.post('/distribution', {distributionText})
        $('#distribution_textarea').val('')
    })

    //events creating
    $('.eventBtn').click(() => {
        const data = {
            eventName: $('#eventName').val(),
            eventDate: $('#eventDate').val(),
            eventDetails: $('#evenDetails').val(),
        };
        console.log('Event data:', data); 
        axios.post('/events', data)
            .then(response => {
                console.log('Event saved:', response.data);
                $('#eventName').val('')
                $('#eventDate').val('')
                $('#evenDetails').val('')
            })
            .catch(error => {
                console.error('Error saving event:', error);
            });
    });

    //notes creating
    $('#createNoteBtn').click(() => {
        const formData = new FormData();
        const files = $('#notesInput')[0].files;
    
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
    
        formData.append('name', $('#notesName').val());
        formData.append('description', $('#notesDescription').val());
        formData.append('date', $('#notesDate').val());
    
        console.log('Notes data:', [...formData]);
    
        axios.post('/createNotes', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {
                console.log('Notes saved:', response.data);
                $('#notesName').val('');
                $('#notesDescription').val('');
                $('#notesDate').val('');
                $('#notesInput').val('');
            })
            .catch(error => {
                console.error('Error saving notes:', error);
            });
    });

    //notes deleting
    function deleteNote(noteId, noteDiv) {
        axios.delete(`/api/deleteNotes/${noteId}`)
            .then(response => {
                console.log('Note deleted:', response.data);
                noteDiv.remove();
            })
            .catch(error => {
                console.error('Error deleting note:', error);
                alert('Failed to delete the note. Please try again.');
            });
    }
    
    //displaying notes
    function fetchAndDisplayNotes() {
        axios.get('/api/getNotes')
            .then((res) => {
                const notes = res.data;
                const notesContainer = $('.notesContainer');
                notesContainer.empty();
    
                notes.forEach(note => {
                    const imagesContainer = $('<div class="notesImgsContainer"></div>');
    
                    note.files.forEach(file => {
                        const fileImg = $(`<img class="noteImg" src="${file}" alt="${note.name}">`);
                        imagesContainer.append(fileImg);
                    });
    
                    const formattedDate = new Intl.DateTimeFormat('uk-UA', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                    }).format(new Date(note.date));
    
                    const noteDiv = $(`
                        <div class="note">
                            <h3 class="noteName">${note.name}</h3>
                            <p class="noteDescription">${note.description}</p>
                            <p class="noteDate">Дата створення: <span class="noteDateNum">${formattedDate}</span></p>
                            <button class="deleteNoteBtn"><i class="fa-solid fa-trash-can"></i>Видалити</button>
                        </div>
                    `);
                    noteDiv.prepend(imagesContainer);
                    notesContainer.append(noteDiv);
    
                    const deleteNoteBtn = noteDiv.find('.deleteNoteBtn');
                    deleteNoteBtn.on('click', () => {
                        deleteNote(note._id, noteDiv);
                    });
                });
            })
            .catch((error) => {
                console.error('Error fetching notes:', error);
            });
    }
    fetchAndDisplayNotes()
    
    //custom notes input
const notesInput = document.getElementById('notesInput');
const fileNameDisplay = document.getElementById('fileNameDisplay');

notesInput.addEventListener('change', () => {
    const files = notesInput.files;
    if (files.length) {
        const fileNames = Array.from(files).map(file => file.name).join(', ');
        fileNameDisplay.textContent = `Вибрані файли: ${fileNames}`;
    } else {
        fileNameDisplay.textContent = 'Немає вибраних файлів';
    }
});

     
});

//theme changing
let theme = localStorage.getItem('theme') || 'light';
$('#adminsettings').click(()=>{
    $('.settingsCon').css('display', 'flex')
})
$('#settingsXmark').click(()=>{
    $('.settingsCon').css('display', 'none')
})