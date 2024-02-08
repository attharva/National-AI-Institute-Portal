
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("submit").addEventListener("click", function() {
        const formData = new FormData();
        formData.append('name', document.getElementById("contact-name").value);
        formData.append('email', document.getElementById("contact-email").value);
        formData.append('phone', document.getElementById("contact-phone").value);
        formData.append('message', document.getElementById("contact-message").value);
        // Events Data Fetch API 
        fetch('/contact', {
            method: 'POST',
            body:formData
        })
        .then(async response => await response.json())
        .then(data => {
            console.log(data); // Log the server response
            if (data.success) {

            // window.alert("Success")
            window.alert("swal")
                Swal.fire({
                    title: 'Submitted',
                    text: 'Your Query has been submitted successfully',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

            }else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Something went wrong, Try Again',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch(error => {
            console.error("Error fetching event data: " + error);
        });
    
    });
});

