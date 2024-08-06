$(document).ready(function() {
    $('.setChanges_btn').click(async function() {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        
        for (const day of days) {
            for (let i = 1; i <= 8; i++) {
                const subjectElement = $(`#${day.toLowerCase()}_subject${i}`);
                const homeworkElement = $(`#${day.toLowerCase()}_homework${i}`);

                console.log(`Subject Element: ${subjectElement.length}`);
                console.log(`Homework Element: ${homeworkElement.length}`);

                const subject = subjectElement.text().replace(':', '');
                const homework = homeworkElement.val();

                console.log(`Subject: ${subject}`);
                console.log(`Homework: ${homework}`);

                if (homework) {
                    try {
                        await axios.post('/homework', {
                            homework,
                            day,
                            subject
                        });
                    } catch (error) {
                        console.error('Error adding homework:', error);
                    }
                }
            }
        }

        alert('Homework updated successfully!');
    });
});
