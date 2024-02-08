document.addEventListener("DOMContentLoaded", function() {

    fetch('/member/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        // Display the API response in the result div
        // alert("Login Successful");
        console.log(JSON.stringify(data));
        if (data.success) {
            // Redirect to the admin/news page upon successful login
            window.location.href = "/member/home";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        console.log(JSON.stringify(data));
        // alert("Login Failed, Check Credentials");
    });

    // Add an event listener to the login button
    document.getElementById("loginbutton").addEventListener("click", function() {
        // Get the form data
        var memberID = document.getElementById("memberID").value;
        var password = document.getElementById("password").value;

        localStorage.setItem("memberID", memberID);

        // Check if Username and password are not empty
        if (memberID.trim() === "" || password.trim() === "") {
            Swal.fire({
                title: 'Error!',
                text: 'Username and/or password cannot be empty',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return; // Exit the function if validation fails
        }

        // API Call to validate login credentials
        fetch('/member/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                memberID: memberID,
                password: password,
            })
        })
        .then(response => response.json())
        .then(data => {
            // Display the API response in the result div
            console.log(JSON.stringify(data));
            if (data.success) {
                // Redirect to the admin/news page upon successful login
                // Get the current URL path
                const currentPath = window.location.pathname;

                // // Check if the current path starts with "/admin/news"
                // if (!currentPath.startsWith('/admin/news')) {
                //     window.location.href = "/admin/news/add";
                // }

                // console.log(currentURL)
                // if (!currentURL.startsWith('/admin/')) {
                window.location.href = "/member/home";
                // }
            }
            else{
                Swal.fire({
                    title: 'Error!',
                    text: 'Wrong username or password!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                  })
            }
        })
        .catch(error => {
            console.error('Error:', error);
            console.log(JSON.stringify(data));
        });
    });
});
