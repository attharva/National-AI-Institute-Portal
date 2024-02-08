
function deadlineDataUpdate (id, title, description, monthValue, status, deadlineDateTime){

    // Check if title, description, and at least one image are provided
    if (id === "" || title.trim() === "" || deadlineDateTime === null || submissionMonth === null) {
        Swal.fire({
            title: 'Error!',
            text: 'Title, Description, Submission Month and Deadline Time are required',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return; // Exit the function if validation fails
    }

    // Create a FormData object and append the form data
    var formData = new FormData();
    formData.append("id", id);
    formData.append("title", title);

    formData.append("deadlineDateTime", deadlineDateTime);
    formData.append("status", status)

    var submissionMonth = monthValue + '-01';

    formData.append("submissionMonth", submissionMonth);

    // Append the "url" field if it's provided
    if (description.trim() !== "") {
        formData.append("description", description);
    }

    // API call to send form data and images
    fetch('/admin/updateDeadlineData', {
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


document.addEventListener("DOMContentLoaded", function() {

    const currentDate = new Date();
    // console.log(currentDate)
    let filterType = "all"; // Initialize the default filter type

    // Handle filter selection, e.g., when a user clicks on a filter
    const filters = Array.from(document.getElementById("portfolio-flters").getElementsByTagName("li"));
    for (const filter of filters) {
        filter.addEventListener("click", function() {
            // Remove the "filter-active" class from all filters
            filters.forEach((f) => f.classList.remove("filter-active"));
            // Add the "filter-active" class to the selected filter
            filter.classList.add("filter-active");
            filterType = filter.id; // Update the filter type based on the selected li's id
            applyFilter(); // Call the function to apply the filter
        });
    }

    function applyFilter(){  
    // Events Data Fetch API 
    fetch('/admin/getDeadlineData', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.hasOwnProperty("deadlineData") && Array.isArray(data.deadlineData)) {
            data.deadlineData.forEach((item, index) => {

                // Clear the existing content in the news container
                const newsContainer = document.getElementById("news-container");
                newsContainer.innerHTML = '';
                
                data.deadlineData.forEach(item => {
                const deadlineDateTime = new Date(item.deadlineDateTime);

                if (filterType === "all" ||
                (filterType === "upcoming" && deadlineDateTime >= currentDate) ||
                (filterType === "past" && deadlineDateTime < currentDate)) {

                // Create and append the card for the event

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
                    confirmButtonText: 'Delete',
                    cancelButtonText: 'Cancel',
                }).then((result) => {
                    if (result.isConfirmed) {
                    // User confirmed, proceed with the deletion

                    // Send a DELETE request to your FastAPI backend with 'news_id' in the request body
                    fetch('/admin/deadline/delete', {
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
                                'Your entry has been deleted.',
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


        // Assuming item.submissionMonth is a string like 'YYYY-MM-DD'
        let submissionMonthDate = new Date(item.submissionMonth + 'T00:00:00Z');

        // Now you can safely use toISOString()
        let formattedSubmissionMonth = submissionMonthDate.toISOString().slice(0, 7);

        firstAnchor.addEventListener("click",  async function () {

            // Function to create image elements for the item.images                    
            swal_html =  `
            <div id =  "container" style="text-align: left;">
            <label for="title" style="text-align: left;":>Title: </label>
            <input id="title" class = "form-control bg-light border-0 small" value="${item.title}"><br>
            <label for="description">Description: </label>
            <input id="description" class = "form-control bg-light border-0 small" value="${item.description}"><br>
            <label for="datepicker">Event Date Time: </label>
            <div class="event-date-input">
            <input type="datetime-local" name="datepicker" id="event-datetime" class = "form-control bg-light border-0 small" value="${item.deadlineDateTime}" required>
            </div>
            <br>
            <label for="start">Submission Month:</label><span id = "asterisk" style="color: red;">*</span>
            <input type="month" id="month" class = "form-control bg-light border-0 small" name="start" value="${formattedSubmissionMonth}"  /><br>
            
            <label>Status:<span id="asterisk" style="color: red;">*</span></label><br>
            <input type="radio" id="statusActive" name="status" value="Active" ${item.status == 'Active' ? 'checked' : ''} required>
            <label for="statusActive">Active</label><br>

            <input type="radio" id="statusInactive" name="status" value="Inactive" ${item.status == 'Inactive' ? 'checked' : ''} required>
            <label for="statusInactive">Inactive</label>
            
            </div>`;
                
                  await Swal.fire({
                    title: 'Edit ' + item.title,
                    html: swal_html,
                    width: '80%',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Save',
                    focusConfirm: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            let updated_title = document.getElementById('title').value
                            let updated_desc =  document.getElementById('description').value
                            let updated_submissionMonth = document.getElementById('month').value
                            let updated_deadlinedateTime = document.getElementById('event-datetime').value                            

                            var statusActive = document.getElementById("statusActive");
                            var statusInactive = document.getElementById("statusInactive");

                            var updated_status;
                            if (statusActive.checked) {
                                updated_status = statusActive.value;
                            } else if (statusInactive.checked) {
                                updated_status = statusInactive.value;
                            } else {
                                Swal.fire({
                                    title: 'Error!',
                                    text: 'Status is required',
                                    icon: 'error',
                                    confirmButtonText: 'OK'
                                });
                                return;
                            }
                            deadlineDataUpdate(item.id, updated_title, updated_desc, updated_submissionMonth, updated_status, updated_deadlinedateTime);
                        }
                    });
        
          });

                cardHeader.appendChild(cardTitle);
                cardHeader.appendChild(firstAnchor);
                cardHeader.appendChild(secondAnchor);

                // Create a div for the card body
                let cardBody = document.createElement("div");
                cardBody.classList.add("card-body");
                cardBody.style.overflow = "auto"; // Allow content to scroll if it overflows
                

                // Create the news card
                const card = document.createElement("div");
                card.classList.add("news-card");
                card.innerHTML = `
                    <p>Title: <span class="editable" contenteditable="false">${item.title}</p>
                    <p>Description: <span class="editable" contenteditable="false">${item.description}</p>
                    <p>Deadline Date Time: <span class="editable" contenteditable="false">${item.deadlineDateTime}</p>
                    <p>Submission Month:<span class="editable" contenteditable="false"> ${formattedSubmissionMonth}<br></p>
                    <p>Status:<span class="editable" contenteditable="false"> ${item.status}<br></p>
                    <p>Created By: ${item.createdBy}</p>
                    <p>Created Date: ${item.createdDate}</p>
                    <p>Modified By: ${item.modifiedBy}</p>
                    <p>Modified Date: ${item.modifiedDate}</p>
                    
                `;

                 // Append the news card to the card body
                 cardBody.appendChild(card);

                // Append the card header to the newsContainer
                newsContainer.appendChild(cardHeader);

                // Append the card body to the newsContainer
                newsContainer.appendChild(cardBody);

            // });

         
        }
                });
    })
        } else {
            console.error("API response does not contain 'DeadlineData' or it's not an array");
        }
    })
    .catch(error => {
        console.error("Error fetching event data: " + error);
    });
}
    // Initially, fetch and display events with the default filter (all)
    applyFilter();
});
