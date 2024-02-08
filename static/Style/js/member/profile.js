// Dict to map event ids and image ids
let profile_img_id = {};

var storedMemberID = localStorage.getItem("memberID");

function profileDataUpdate(id, firstNameField, lastNameField, emailField, phoneNumberField, googleScholarField, acmField, openAlexField, dblpField, universityField, designationField,  usernameField){

    // Check if title, description, and at least one image are provided
    if (id === "" || firstNameField === "" || lastNameField === "" || usernameField === ""  ) {
        Swal.fire({
            title: 'Error!',
            text: 'Fields marked in red are required',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return; // Exit the function if validation fails
    }

    // Create a FormData object and append the form data
    var formData = new FormData();
    formData.append("id", id);
    formData.append("firstName", firstNameField);
    formData.append("lastName", lastNameField);
    formData.append("username", usernameField);

    
    // Append the "email" field if it's provided
    if (emailField !== "") {
        formData.append("email", emailField);
    }

    // Append the "phoneNumberField" field if it's provided
    if (phoneNumberField !== "") {
        formData.append("phoneNumber", phoneNumberField);
    }

    // Append the "googleScholarUrl" field if it's provided
    if (googleScholarField !== "") {
        formData.append("googleScholarUrl", googleScholarField);
    }

    // Append the "acmField" field if it's provided
    if (acmField !== "") {
        formData.append("acmUrl", acmField);
    }  

    // Append the "openAlexField" field if it's provided
    if (openAlexField !== "") {
        formData.append("openAlexUrl", openAlexField);
    }  

    // Append the "dblpField" field if it's provided
    if (dblpField !== "") {
        formData.append("dblpUrl", dblpField);
    }  

    // Append the "universityField" field if it's provided
    if (universityField !== "") {
        formData.append("university", universityField);
    } 

    // Append the "designationField" field if it's provided
    if (designationField !== "") {
        formData.append("designation", designationField);
    }  

    // API call to send form data and files
    fetch('/member/updateProfileData', {
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
    // setTimeout(function() {
    //     location.reload();
    // }, 500);

};

function profileImageUpdate(id, updated_images, imageFiles){

    // Check if title, description, and at least one image are provided
    if (id === "" ) {
        Swal.fire({
            title: 'Error!',
            text: 'Profile Does not exist',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        console.log("error!");
        return; // Exit the function if validation fails
    }

    // Create a FormData object and append the form data
    var formData = new FormData();
    formData.append("id", id);
    
    // Append the uploaded images
    for (var i = 0; i < imageFiles.length; i++) {
        formData.append("images", imageFiles[i]);
    }
    let imageArray;

    // Convert the Set to an array
    if (updated_images != null) {
        imageArray = Array.from(updated_images);
        // Now you can use the imageArray
      } else {
        imageArray = [null];
        // Handle the case when updated_images is an empty array by sending a null array
      }

    formData.append("image_ids", JSON.stringify(imageArray));

    // TO-DO: Edit this to handle update of image files

    // API call to send form data and images
    fetch('/member/updateProfileImgData', {
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
    // setTimeout(function() {
    //     location.reload();
    // }, 500);

};


// Assuming changePasswordButton is the button you want to hide
const divButton = document.getElementById("buttonDiv");




function profilePasswordUpdate(id, password) {

    // Check if title, description, and at least one image are provided
    if (id === "" || password === "" ) {
        Swal.fire({
            title: 'Error!',
            text: 'New Password is required',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return; // Exit the function if validation fails
    }

    // Create a FormData object and append the form data
    var formData = new FormData();
    formData.append("id", id);
    formData.append("password", password);

    // API call to send form data and files
    fetch('/member/updateProfilePassword', {
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
    // setTimeout(function() {
    //     location.reload();
    // }, 500);
    
}


// Function to determine the image format based on the binary data
function getImageFormat(imageData) {
    // Identify the image format based on the starting bytes
    const uintArray = new Uint8Array(imageData.slice(0, 4));
    let imageFormat = '';

    if (uintArray[0] === 137 && uintArray[1] === 80 && uintArray[2] === 78 && uintArray[3] === 71) {
        imageFormat = 'png';
    } else if (uintArray[0] === 255 && uintArray[1] === 216) {
        imageFormat = 'jpeg';
    } else if (uintArray[0] === 255 && uintArray[1] === 218) {
        imageFormat = 'jpg';
    }
    // Add more checks for other image formats as needed

    return imageFormat;
}

document.addEventListener("DOMContentLoaded", function () {
    const firstNameField = document.getElementById("firstName");
    const lastNameField = document.getElementById("lastName");
    const emailField = document.getElementById("email");
    const phoneNumberField = document.getElementById("phone");
    const googleScholarField = document.getElementById("googleScholar");
    const acmField = document.getElementById("acm");
    const openAlexField = document.getElementById("openAlex");
    const dblpField = document.getElementById("dblp");
    const universityField = document.getElementById("university");
    const designationField = document.getElementById("designation");
    const usernameField = document.getElementById('username');
    const saveButton = document.getElementById("save");
    // To - do: on cancel reset the changes
    const cancelButton = document.getElementById("cancel");
    

    const uploadButton = document.getElementById('uploadImg');
    const resetButton = document.getElementById('resetImg');
    const imageElement = document.getElementById('profilePhoto');

    const uploadedFiles = {};

    // const changePasswordLink = document.getElementById("changePassword");
    // const generalLink = document.getElementById("general");
    // const linksLink = document.getElementById("links");

    // console.log(changePasswordLink);

    // // Check if the "Change password" link is active
    // if (changePasswordLink.classList.contains("active")) {
    //     // Hide the button
    //     divButton.style.display = "none";
    // }

    // // Add click event listener to the "Change password" link
    // generalLink.addEventListener("click", function () {
    //     // Hide the button when the link is clicked
    //     divButton.style.display = "none";
    // });

    // linksLink.addEventListener("click", function () {
    //     // Hide the button when the link is clicked
    //     divButton.style.display = "none";
    // });


    const fetchAllEventsData = () => {
        const fetchUrl = `/member/getProfileData`;

        fetch(fetchUrl, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                if (data.hasOwnProperty("profileData") && Array.isArray(data.profileData)) {
                    const profileData = data.profileData[0]; // Assuming it's an array and you want the first item

                    // Set values to respective fields
                    firstNameField.value = profileData.firstName;
                    lastNameField.value = profileData.lastName;
                    emailField.value = profileData.email;
                    phoneNumberField.value = profileData.phoneNumber;
                    googleScholarField.value = profileData.googleScholarUrl;
                    acmField.value = profileData.acmUrl;
                    openAlexField.value = profileData.openAlexUrl;
                    dblpField.value = profileData.dblpUrl;
                    universityField.value = profileData.university;
                    designationField.value = profileData.designation;
                    usernameField.value = profileData.memberID;
                    const imageElement = document.getElementById("profilePhoto");
                
                    if(profileData.images.length > 0){
                        let imageFormat = getImageFormat(profileData.images[0].image_data);    
                        imageElement.src = "data:image/"+imageFormat+";base64," + profileData.images[0].image_data;
                    }
                    else{
                        imageElement.src = "/static/Style/img/undraw_profile.svg"
                    }

                    const originalImageSrc = imageElement.src;

                    imageElement.addEventListener("click", () => {
                        const imageUrl = imageElement.getAttribute("src"); // Get the source URL
                        // displayOverlay(imageUrl);
                        Swal.fire({
                            imageUrl: imageUrl,
                            imageWidth: 400,
                            imageHeight: 400,
                            imageAlt: 'Custom image',
                            })
                    });
                    
                    // Event listener for the file input change event
                    uploadButton.addEventListener('change', function (event) {
                        const file = event.target.files[0];

                        // Assuming profileData has an 'id' property
                        const profileId = profileData.id;

                        // Store the file information in the dictionary
                        uploadedFiles[profileId] = file;
                        // console.log(uploadedFiles)


                        // Update the image source with the selected file
                        const reader = new FileReader();
                        reader.onload = function (e) {
                            imageElement.src = e.target.result;
                        };
                        reader.readAsDataURL(file);
                        profile_img_id[profileId] = new Set();
                        profile_img_id[profileData.id].add(profileData.images[0].image_id);
                        console.log(profile_img_id);
                    });

                    // Add an event listener to the submit button
                    const submitButton = document.getElementById("savePassword");
                    submitButton.addEventListener("click", function (event) {

                        // Check if the passwords match and are not empty
                        const passwordsNotEmpty = passwordField.value.trim() !== '' && checkPasswordField.value.trim() !== '';
                        const passwordsMatch = passwordField.value === checkPasswordField.value;
                        
                        const password = passwordField.value

                        if (passwordsNotEmpty && passwordsMatch) {
                            // Call your API endpoint here
                            profilePasswordUpdate(profileData.id, password);
                        } else {
                            // Show an error message with SweetAlert
                            event.preventDefault();
                            showError('Passwords do not match or are empty. Please try again.');
                        }
                    });

                    function showError(errorMessage) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: errorMessage,
                        });
                    }

                    // Event listener for the "Reset" button
                    resetButton.addEventListener('click', function () {
                        // Reset the file input
                        uploadButton.value = '';

                        // Revert the image source to the original
                        imageElement.src = originalImageSrc;

                        // Remove the file information from the dictionary
                        const profileId = profileData.id;
                        delete uploadedFiles[profileId];

                        delete profile_img_id[profileData.id];
                        console.log(profile_img_id);
                    });
                    
                    saveButton.addEventListener("click", function () {

                        Swal.fire({
                            title: 'Edit ' + profileData.memberID,
                            width: '50%',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Save',
                            focusConfirm: false,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    const updated_firstNameField = document.getElementById("firstName").value;
                                    const updated_lastNameField = document.getElementById("lastName").value;
                                    const updated_emailField = document.getElementById("email").value;
                                    const updated_phoneNumberField = document.getElementById("phone").value;
                                    const updated_googleScholarField = document.getElementById("googleScholar").value;
                                    const updated_acmField = document.getElementById("acm").value;
                                    const updated_openAlexField = document.getElementById("openAlex").value;
                                    const updated_dblpField = document.getElementById("dblp").value;
                                    const updated_universityField = document.getElementById("university").value;
                                    const updated_designationField = document.getElementById("designation").value;
                                    const updated_usernameField = document.getElementById('username').value;
                                    
                                    let new_image = document.getElementById('uploadImg').files
                                    let updated_images =  profile_img_id[profileData.id]

                                    profileDataUpdate(profileData.id, updated_firstNameField, updated_lastNameField, updated_emailField,updated_phoneNumberField, updated_googleScholarField,updated_acmField, updated_openAlexField, updated_dblpField, updated_universityField, updated_designationField,  updated_usernameField);
                                    profileImageUpdate(profileData.id,updated_images, new_image);
                                }
                            });

                    });


                } else {
                    console.error("Invalid or empty API response");
                }
            })
            .catch(error => {
                console.error("Error fetching report data: " + error);
            });
    };
    // Call the function to fetch and populate data
    fetchAllEventsData();
});
