document.addEventListener("DOMContentLoaded", function() {


function eventDataAdd (title, url, description, status, eventDateTime, imageFiles){

    // Check if title, description, and at least one image are provided
    if (title.trim() === "" || description.trim() === "" || eventDateTime === null) {
        Swal.fire({
            title: 'Error!',
            text: 'Title, Description and Event Time are required',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return; // Exit the function if validation fails
    }

    // Create a FormData object and append the form data
    var formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("status",status);
    formData.append("eventDateTime", eventDateTime);    

    // Append the "url" field if it's provided
    if (url.trim() !== "") {
        formData.append("url", url);
    }

    // Append the uploaded images
    for (var i = 0; i < imageFiles.length; i++) {
        formData.append("images", imageFiles[i]);
    }

    // API call to send form data and images
    fetch('/admin/addEventsData', {
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

};

    document.getElementById("buttonLink").addEventListener("click", function(event) {
        
        event.preventDefault(); // Prevent the form from submitting in the default way
    
        // Get the form data
        var title = document.getElementById("title").value;
        var url = document.getElementById("url").value;
        var description = document.getElementById("description").value;
        // var statusDropdown = document.getElementById("statusDropdown");
        // var status = statusDropdown.value || "draft";

        var statusDraft = document.getElementById("statusDraft");
        var statusWebpage = document.getElementById("statusWebpage");
        var statusMembers = document.getElementById("statusMembers");

        var status;
        if (statusDraft.checked) {
            status = statusDraft.value;
        } else if (statusWebpage.checked) {
            status = statusWebpage.value;
        } else if (statusMembers.checked) {
            status = statusMembers.value;
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'Status is required',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        var eventDateTime = document.getElementById("event-datetime").value;
        var imageFiles = document.getElementById("imageUpload").files;

        eventDataAdd(title, url, description, status, eventDateTime, imageFiles);

    });
    
});
