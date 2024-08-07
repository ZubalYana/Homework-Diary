//pages navigation
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


// $(document).ready(function() {
//     $('.setChanges_btn').click(async function() {
//         const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        
//         for (const day of days) {
//             for (let i = 1; i <= 8; i++) {
//                 const subjectElement = $(`#${day.toLowerCase()}_subject${i}`);
//                 const homeworkElement = $(`#${day.toLowerCase()}_homework${i}`);

//                 console.log(`Subject Element: ${subjectElement.length}`);
//                 console.log(`Homework Element: ${homeworkElement.length}`);

//                 const subject = subjectElement.text().replace(':', '');
//                 const homework = homeworkElement.val();

//                 console.log(`Subject: ${subject}`);
//                 console.log(`Homework: ${homework}`);

//                 if (homework) {
//                     try {
//                         await axios.post('/homework', {
//                             homework,
//                             day,
//                             subject
//                         });
//                     } catch (error) {
//                         console.error('Error adding homework:', error);
//                     }
//                 }
//             }
//         }

//         alert('Homework updated successfully!');
//     });
// });
