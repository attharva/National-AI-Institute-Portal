document.addEventListener("DOMContentLoaded", function() {
    // Add an event listener to the button to trigger the API call
    document.getElementById("buttonLink").addEventListener("click", function() {
        // Get the form data
        var title = document.getElementById("title").value;
        var description = document.getElementById("description").value;
        var monthValue = document.getElementById("month").value;
        var deadlineDateTime = document.getElementById("event-datetime").value;
        // Manipulate the date format (add day '01')
        var submissionMonth = monthValue + '-01';

        var statusActive = document.getElementById("statusActive");
        var statusInactive = document.getElementById("statusInactive");

        var status;
        if (statusActive.checked) {
            status = statusActive.value;
        } else if (statusInactive.checked) {
            status = statusInactive.value;
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'Status is required',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Check if title, description, and at least one image are provided
        if (title.trim() === "" || submissionMonth.trim() === "" ||  deadlineDateTime.trim() === "" ) {
            Swal.fire({
                title: 'Error!',
                text: 'Title, Submission Month and Deadline Information is required',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return; // Exit the function if validation fails
        }

        // Create a FormData object and append the form data
        var formData = new FormData();
        formData.append("title", title);
        formData.append("submissionMonth", submissionMonth);
        formData.append("deadlineDateTime", deadlineDateTime);
        formData.append("status",status);
        
        // Append the "url" field if it's provided
        if (description.trim() !== "") {
            formData.append("description", description);
        }

        // API call to send form data and images
        fetch('/admin/addDeadlileData', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Your work has been saved',
                    showConfirmButton: false,
                    timer: 1500
                });
                // Reset the form after a successful insertion
                document.getElementById("apiCallForm").reset();
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Something went wrong, Try Again',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong, Try Again',
                icon: 'error',
                confirmButtonText: 'OK'
            });
    });
});
});