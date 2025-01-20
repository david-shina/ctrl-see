ClassicEditor
    .create(document.querySelector('#editor'))
    .then( editor => {
        editor.model.document.on('keydown', (evt, data) => {
            const character = data.event.key;
            fetch('/pronunceChar/', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json', 
                },
                body: JSON.stringify({'character': character})
            })
            .then(response => {

            })
            .catch(error => {
                console.error('Error', error);
            });
        });
    })
    .catch( error => {
        console.error(error);
    });