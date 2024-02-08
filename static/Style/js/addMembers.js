document.addEventListener("DOMContentLoaded", function() {
    // Add an event listener to the button to trigger the API call
    document.getElementById("buttonLink").addEventListener("click", function() {
        // Get the form data
        var name = document.getElementById("name").value;
        var university = document.getElementById("university").value;
        var designation = document.getElementById("designation").value;

        // Check if title and description are not empty
        if (name.trim() === "" || university.trim() === "" || designation.trim() === "") {
            Swal.fire({
                title: 'Error!',
                text: 'All fields are mandatory',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return; // Exit the function if validation fails
        }

        //  API call to fetch news data
        fetch('/admin/addMember', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                university: university,
                designation: designation
            })
        })
        .then(response => response.json())
        .then(data => {
            // Display the API response in the result div
            // document.getElementById("result").innerHTML = "API Response: " + JSON.stringify(data);
            if (data.success) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: name + ' has been added as a new approved member',
                showConfirmButton: false,
                timer: 1500
              })
              // Reset the form after a successful insertion
            document.getElementById("apiCallForm").reset();
            }
            else{
                Swal.fire({
                    title: 'Error!',
                    text: 'Something went wrong, Try Again',
                    icon: 'error',
                    confirmButtonText: 'OK'
                  })
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // document.getElementById("result").innerHTML = "API Request Failed";
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong, Try Again',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        });
    });
});
