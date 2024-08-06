$(document).ready(function() {
    $('.setChanges_btn').on('click', function() {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        days.forEach(day => {
            $(`#${day} .string`).each(function() {
                const homework = $(this).find('.homework').val();
                if (homework) {
                    axios.post('/homework', {
                        homework: homework,
                        day: day
                    })
                    .then(response => {
                        console.log(response.data);
                    })
                    .catch(error => {
                        console.error('There was an error saving the homework!', error);
                    });
                }
            });
        });
    });
});
