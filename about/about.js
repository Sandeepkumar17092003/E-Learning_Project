document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission

    const formData = new FormData(this); // Collect form data

    fetch(this.action, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Message sent successfully!');
            this.reset(); // Reset the form
            window.location.href = 'Demo.html'; // Redirect back to the contact page
        } else {
            alert('Error sending message.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error sending message.');
    });
});
