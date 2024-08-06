$(document).ready(function() {
    $('.setChanges_btn').click(async function() {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        
        for (const day of days) {
            for (let i = 1; i <= 8; i++) {
                const subject = $(`#${day.toLowerCase()}_subject${i}`).text().replace(':', '').trim();
                const homework = $(`#${day.toLowerCase()}_homework${i}`).val().trim();

                if (homework) {
                    try {
                        await axios.post('/addHomework', {
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
