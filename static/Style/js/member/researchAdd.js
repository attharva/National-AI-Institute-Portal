document.addEventListener("DOMContentLoaded", function() {
    // Add an event listener to the button to trigger the API call
    document.getElementById("buttonLink").addEventListener("click", function() {
        // Get the form data
        var title = document.getElementById("title").value;
        var year = document.getElementById("year").value;
        var venue = document.getElementById("venue").value;
        var authors = document.getElementById("authors").value;
        var reportFiles = document.getElementById("fileUpload").files;
        
        // Check if title, type, description, and at least one file are provided
        if (title.trim() === "" || reportFiles.length === 0) {
            Swal.fire({
                title: 'Error!',
                text: 'Title and least one file are required',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return; // Exit the function if validation fails
        }
  
        // Create a FormData object and append the form data
        var formData = new FormData();
        formData.append("title", title);
        formData.append("year", year);
        formData.append("venue", venue);
        formData.append("authors", authors);

        // // Append the "description" field if it's provided
        // if (submissionTitle !== "") {
        //     formData.append("submissionTitle", submissionTitle);
        // }
                
        // // Append the "description" field if it's provided
        // if (description.trim() !== "") {
        //     formData.append("description", description);
        // }

        // Append the uploaded files
        for (var i = 0; i < reportFiles.length; i++) {
            formData.append("files", reportFiles[i]);
        }


        // API call to send form data and files
        fetch('/member/addResearchReportData', {
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
