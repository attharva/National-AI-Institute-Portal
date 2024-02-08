// document.addEventListener("DOMContentLoaded", function() {
//     // Add an event listener to the button to trigger the API call
//     document.getElementById("buttonLink").addEventListener("click", function() {
//         // Get the form data
//         var title = document.getElementById("title").value;
//         var type = document.getElementById("type").value;
//         var description = document.getElementById("description").value;
//         var reportFiles = document.getElementById("fileUpload").files;

//                 // Check if title, description, and at least one image are provided
//         if (title.trim() === "" || type.trim() === "" ) {
//             Swal.fire({
//                 title: 'Error!',
//                 text: 'Title and type are required',
//                 icon: 'error',
//                 confirmButtonText: 'OK'
//             });
//             return; // Exit the function if validation fails
//         }
  
//         // Create a FormData object and append the form data
//         var formData = new FormData();
//         formData.append("title", title);
        
//         formData.append("type", type);
        
//         // Append the "url" field if it's provided
//         if (description.trim() !== "") {
//             formData.append("description", description);
//         }

//         // Append the uploaded images
//         for (var i = 0; i < reportFiles.length; i++) {
//             formData.append("files", reportFiles[i]);
//         }

//         // API call to send form data and images
//         fetch('/member/addReportData', {
//             method: 'POST',
//             body: formData
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 Swal.fire({
//                     position: 'center',
//                     icon: 'success',
//                     title: 'Your work has been saved',
//                     showConfirmButton: false,
//                     timer: 1500
//                 });
//                 // Reset the form after a successful insertion
//                 document.getElementById("apiCallForm").reset();
//             } else {
//                 Swal.fire({
//                     title: 'Error!',
//                     text: 'Something went wrong, Try Again',
//                     icon: 'error',
//                     confirmButtonText: 'OK'
//                 });
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             Swal.fire({
//                 title: 'Error!',
//                 text: 'Something went wrong, Try Again',
//                 icon: 'error',
//                 confirmButtonText: 'OK'
//             });
//     });
// });
// });
document.addEventListener("DOMContentLoaded", function() {
    // Add an event listener to the button to trigger the API call
    document.getElementById("btn-id").addEventListener("click", function() {
        // Get the form data
        var title = document.getElementById("title").value;
        var description = document.getElementById("description").value;

        
  
        // Create a FormData object and append the form data
        var formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        


        // API call to send form data and files
        fetch('/member/tickets/add', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.success) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Your Ticket has been created!',
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
