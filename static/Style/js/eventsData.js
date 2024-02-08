// Create a variable to track whether editing is in progress
let editingInProgress = false;

// Define a variable to keep track of the currently edited card
let editedCard = null;

// Create an array to store the previously edited cards
const editedCards = {};

function eventDataUpdate (id, title, url, description, eventDate, imageFiles){

    // Check if title, description, and at least one image are provided
    if (id === "" || title.trim() === "" || description.trim() === "" || eventDate === null) {
        Swal.fire({
            title: 'Error!',
            text: 'Title and Description are required',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return; // Exit the function if validation fails
    }

    // Create a FormData object and append the form data
    var formData = new FormData();
    formData.append("id", id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("eventDate", eventDate);
    
    // Append the "url" field if it's provided
    if (url.trim() !== "") {
        formData.append("url", url);
    }

    // TO-DO: Edit this to handle update of image files


    // // Append the "imageFiles" field if it's provided
    // if (imageFiles !== "") {
    //     formData.append("imageFiles", imageFiles);
    // }
    // else{
    // // Append the uploaded images
    // for (var i = 0; i < imageFiles.length; i++) {
    //     formData.append("images", imageFiles[i]);
    // }
    // }

    // API call to send form data and images
    fetch('/admin/updateEventsData', {
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
    setTimeout(function() {
        location.reload();
    }, 500);

};

function editCard(preEdit, cardBody, firstIcon, cardId,firstAnchor ) {
    const editableElements = cardBody.querySelectorAll(".editable");
    
    // Set editingInProgress to true when clicking on the anchor
    editingInProgress = true;

    for (const element of editableElements) {
        element.contentEditable = "true";
        element.style.backgroundColor = "#ffffcc"; // You can add a highlight to indicate editing mode.
    }

    // You can also enable other form elements or add additional functionality here.

    const editButton = firstAnchor;
    editButton.classList.remove("btn-warning");
    editButton.classList.add("btn-success");

    const editIcon = firstIcon;
    editIcon.classList.remove("fa-edit");
    editIcon.classList.add("fa-save");
    
}

function saveCard(preEdit, cardBody, firstIcon, cardId, firstAnchor) {
    
    // Set editingInProgress to true when clicking on the anchor
    editingInProgress = true;
    
    const editableElements = cardBody.querySelectorAll(".editable");
    
    const oldDataElements = preEdit.querySelectorAll(".editable");

    // Create a mapping object with data-key attributes in your cardBody structure
    const elementMapping = {
        title: oldDataElements["0"].textContent,
        description: oldDataElements["1"].textContent,
        eventDate: oldDataElements["2"].textContent,
        url: oldDataElements["3"].textContent
        // Add more properties and corresponding numeric keys as needed.
    };
    

    for (const element of editableElements) {
        element.contentEditable = "false";
        element.style.backgroundColor = ""; // Remove the highlight.
    }

    // You can also disable other form elements or save the edited data here.

    const editButton = firstAnchor;
    editButton.classList.remove("btn-success");
    editButton.classList.add("btn-warning");

    const saveButton = firstIcon
    saveButton.classList.remove("fa-save");
    saveButton.classList.add("fa-edit");

    // You can extract and save the edited data, for example, by creating an object from the edited values.
    const editedData = {
        id: cardId,
        title: editableElements[0].textContent,
        description: editableElements[1].textContent,
        eventDate: editableElements[2].textContent,
        url: editableElements[3].textContent
        
        // Add more properties as needed.
    };

    // You can extract and save the edited data, for example, by creating an object from the edited values.
    const compareData = {
        title: editableElements[0].textContent,
        description: editableElements[1].textContent,
        eventDate: editableElements[2].textContent,
        url: editableElements[3].textContent
        
        // Add more properties as needed.
    };

    // Create a variable to track if there are differences
    let hasDifferences = false;

    // Iterate through the properties in editedData
    for (const key in compareData) {

        if (compareData.hasOwnProperty(key)) {
            // Access the corresponding element from the mapping
            const cardBodyElement = elementMapping[key];

            if (cardBodyElement) {
                // Compare the innerText of the cardBody element with the editedData property
                if (cardBodyElement !== compareData[key]) {
                    hasDifferences = true;
                    // You can trigger a condition or perform other actions here.
                }
            }
        }
    }

    // Check if there are differences
    if (hasDifferences) {
           // Call the `eventDataUpdate` function with the data from `editedData`
        // Display a confirmation dialog using Swal
        Swal.fire({
            title: 'Edit '+editedData.title+' ?',
            text: "Are you Sure?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Edit it',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
           eventDataUpdate(
            editedData.id,
            editedData.title,
            editedData.url,
            editedData.description,
            editedData.eventDate
        );
    }});
    };

    // Set editingInProgress to true when clicking on the anchor
    editingInProgress = false;
}


document.addEventListener("DOMContentLoaded", function() {
    
    const newsContainer = document.getElementById("news-container");

    // Events Data Fetch API 
    fetch('/admin/getEventsData', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        // Check if the response has the "newsData" property
        if (data.hasOwnProperty("eventsData") && Array.isArray(data.eventsData)) {
            data.eventsData.forEach((item, index) => {

                let newsContainer = document.getElementById("news-container");

                // Create a div for the card header
                const cardHeader = document.createElement("div");
                cardHeader.classList.add("card-header", "py-3", "d-flex", "flex-row", "align-items-center", "justify-content-between");
            
                // Create the title
                const cardTitle = document.createElement("h6");
                cardTitle.classList.add("m-0", "font-weight-bold", "text-primary");
                cardTitle.textContent = item.title ;
                cardTitle.style.flex = "1";
                
                // Create the first anchor element
                const firstAnchor = document.createElement("a");
                firstAnchor.href = "#";
                firstAnchor.style.margin = "5px";
                firstAnchor.classList.add("btn", "btn-warning", "btn-circle");
                firstAnchor.title = "Edit";

                // Create the first icon element
                const firstIcon = document.createElement("i");
                firstIcon.classList.add("fas", "fa-edit");
                firstAnchor.appendChild(firstIcon);

                // Create the second anchor element
                const secondAnchor = document.createElement("a");
                secondAnchor.href = "#";
                secondAnchor.style.margin = "5px";
                secondAnchor.classList.add("btn", "btn-danger", "btn-circle");
                secondAnchor.title = "Delete";

                // Create the second icon element
                const secondIcon = document.createElement("i");
                secondIcon.classList.add("fas", "fa-trash");
                secondAnchor.appendChild(secondIcon);

                // Add a click event listener to the "fa-trash" icon
                secondAnchor.addEventListener("click", function () {
                // Get the unique identifier for the card you want to delete, e.g., item.id
                const cardId = item.id; // Assuming you have an ID property in your data

                // Display a confirmation dialog using Swal
                Swal.fire({
                    title: 'Delete '+item.title+' ?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it',
                    cancelButtonText: 'Cancel',
                }).then((result) => {
                    if (result.isConfirmed) {
                    // User confirmed, proceed with the deletion

                    // Send a DELETE request to your FastAPI backend with 'news_id' in the request body
                    fetch('/admin/events/delete', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ events_id: cardId }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            cardHeader.remove();
                            cardBody.remove();
                            Swal.fire(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                            );
                        } else {
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
                        Swal.fire({
                            title: 'Error!',
                            text: 'Something went wrong, Try Again',
                            icon: 'error',
                            confirmButtonText: 'OK'
                            })
                    });
                }
                setTimeout(function() {
                    location.reload();
                }, 500);
            });
        });



        firstAnchor.addEventListener("click", function () {
            

            if (editedCard == null && editingInProgress == false) {
                // Set the card to be edited
                // Create a deep copy of the cardBody structure
                const preEdit = cardBody.cloneNode(true);
                editedCards[item.id] = preEdit;
                editedCard = cardBody;
                editCard(preEdit, cardBody, firstIcon, item.id, firstAnchor);

            } else if (editedCard == cardBody && editingInProgress == true) {
                // Save the card if it's already being edited
                preEdit = editedCards[item.id];
                saveCard(preEdit, cardBody, firstIcon, item.id, firstAnchor);
                editedCard = null;

                // editedCards.pop();
                if (item.id in editedCards) {
                    delete editedCards[item.id];}
            } 
        })

                cardHeader.appendChild(cardTitle);
                cardHeader.appendChild(firstAnchor);
                cardHeader.appendChild(secondAnchor);

                // Create a div for the card body
                let cardBody = document.createElement("div");
                cardBody.classList.add("card-body");
                

                // Create the news card
                const card = document.createElement("div");
                card.classList.add("news-card");
                card.innerHTML = `
                    <p>Title: <span class="editable" contenteditable="false">${item.title}</p>
                    <p>Description: <span class="editable" contenteditable="false">${item.description}</p>
                    <p>Event Date: <span class="editable" contenteditable="false">${item.eventDate}</p>
                    <p>Created By: ${item.createdBy}</p>
                    <p>Created Date: ${item.createdDate}</p>
                    <p>Modified By: ${item.modifiedBy}</p>
                    <p>Modified Date: ${item.modifiedDate}</p>
                    <p>URL:<span class="editable" contenteditable="false"> <a href="${item.url}" target="_blank">${item.url}</a><br></p>
                    <p>Images:</p>
                `;

                 // Append the news card to the card body
                 cardBody.appendChild(card);

                 let imagesContainer = document.createElement("div");
                 imagesContainer.style.display = "flex";  // Set display to "flex"
                 imagesContainer.style.flexWrap = "wrap";  // Allow images to wrap to the next row if needed
                 imagesContainer.style.justifyContent = "flex-start"; // Adjust as needed
                 imagesContainer.style.height = "150px";
                 imagesContainer.style.width = "50%";
            
                item.images.forEach(image => {
                
                let imageBlock = document.createElement("div");
                
                if (image.image_data) {
                    // Determine the image format based on the binary data
                    let imageFormat = getImageFormat(image.image_data);
                    
                    const imageElement = document.createElement("img");
                    imageElement.width = 150;  // Set the width to 100 pixels
                    imageElement.height = 150; // Set the height to 100 pixels
                    imageElement.style.flex = "1";
                    imageElement.style.marginRight = "10%"; 
                    imageElement.className = "thumbnail"; 
                    imageElement.setAttribute("data-image-url", imageElement.src);
                    imageElement.src = "data:image/"+imageFormat+";base64," + image.image_data; // Change the MIME type as needed

                    imageBlock.appendChild(imageElement); // Append the image to the DOM or use it as needed
                    
                }
                imagesContainer.appendChild(imageBlock);
                cardBody.appendChild(imagesContainer);
            });

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
                        
                // Append the card header to the newsContainer
                newsContainer.appendChild(cardHeader);

                // Append the card body to the newsContainer
                newsContainer.appendChild(cardBody);

            });

            // // Assuming you have a container for your thumbnail images with the class "thumbnail"
            const thumbnailImages = document.querySelectorAll(".thumbnail");

            // Add a click event listener to each thumbnail image
            thumbnailImages.forEach((image) => {
                image.addEventListener("click", () => {
                    const imageUrl = image.getAttribute("src"); // Get the source URL
                    // displayOverlay(imageUrl);
                    Swal.fire({
                        imageUrl: imageUrl,
                        imageWidth: 500,
                        imageHeight: 500,
                        imageAlt: 'Custom image',
                      })
                });
            });
        } else {
            console.error("API response does not contain 'eventsData' or it's not an array");
        }
    })
    .catch(error => {
        console.error("Error fetching event data: " + error);
    });
});