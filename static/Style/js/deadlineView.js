// Dict to map event ids and image ids
let news_image_ids = {};

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
    // setTimeout(function() {
    //     location.reload();
    // }, 500);

};


document.addEventListener("DOMContentLoaded", function () {
    const newsContainer = document.getElementById("news-container");
    const paginationContainer = document.getElementById("pagination-container");
    const itemsPerPage = 5; // Adjust the number of items per page as needed
    const createdByFilterDropdown = document.getElementById("createdByFilter");
    const statusFilterDropdown = document.getElementById("statusFilter");
    const keywordValue = document.getElementById("keywordFilter");

    let currentPage = 1;
    let totalPages = 1;
    let allDeadlineData = [];
    let currentCreatedByFilter = null;
    let currentStatusFilter = null;
    let currentKeywordFilter = null;
    
    const fetchAllNewsData = () => {
        const fetchUrl = `/admin/getDeadlineData`;

        fetch(fetchUrl, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                if (data.hasOwnProperty("deadlineData") && Array.isArray(data.deadlineData)) {
                    allDeadlineData = data.deadlineData;
                    // Populate createdBy and status dropdowns
                    populateDropdown(createdByFilterDropdown, getUniqueValues(allDeadlineData, 'createdBy'));
                    populateDropdown(statusFilterDropdown, getUniqueValues(allDeadlineData, 'status'));
                    filterAndDisplayData();

                } else {
                    console.error("Invalid or empty API response");
                }
            })
            .catch(error => {
                console.error("Error fetching news data: " + error);
            });
    };

    const populateDropdown = (dropdown, values) => {
        // Clear existing options
        dropdown.innerHTML = "";

        // Sort values alphabetically
        values.sort();

        // Add default option
        const defaultOption = document.createElement("option");
        defaultOption.text = "All";
        dropdown.add(defaultOption);

        // Add options based on values
        values.forEach(value => {
            const option = document.createElement("option");
            option.text = value;
            dropdown.add(option);
        });
    };

    const getUniqueValues = (data, key) => {
        // Get unique values for a given key in the data array
        return [...new Set(data.map(item => item[key]))];
    };

    const filterAndDisplayData = () => {
        // Filter data based on current filter values
        
        // console.log(currentCreatedByFilter, currentStatusFilter)
        let filteredData;

        if (currentCreatedByFilter === null && currentKeywordFilter === null && currentStatusFilter === null) {
            // console.log("all data")
            // No filters, show all data
            filteredData = allDeadlineData;
        } else {
            // Apply filters
            filteredData = allDeadlineData.filter(item => {
                return (!currentCreatedByFilter || item.createdBy === currentCreatedByFilter) &&
                       (!currentKeywordFilter || item.title.toLowerCase().includes(currentKeywordFilter.toLowerCase())) && 
                       (!currentStatusFilter || item.status === currentStatusFilter);
            });
        }
        
        // console.log("filtererd data:", filteredData)
        
        // Calculate total pages based on filtered data
        totalPages = Math.ceil(filteredData.length / itemsPerPage);
        // console.log("total page", totalPages)
        if(totalPages === 1){
            // console.log("curr page", currentPage)
            currentPage = 1;
        }
        document.getElementById("currentPage").textContent = `Page ${currentPage} of ${totalPages}`;

        // Display data for the current page
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentPageData = filteredData.slice(startIndex, endIndex);
        // console.log(startIndex, endIndex)
        // console.log(currentPageData)
        const newsContainer = document.getElementById("news-container");
        newsContainer.innerHTML = "";
        displayData(currentPageData);
    
    };


    const displayDataForCurrentPage = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentPageData = allDeadlineData.slice(startIndex, endIndex);
        // console.log(currentPageData)
        const newsContainer = document.getElementById("news-container");
        newsContainer.innerHTML = "";

        displayData(currentPageData);
        updatePaginationButtons();
    };

    const displayData = (data) => {
        data.forEach(item => {

                // Clear the existing content in the news container
                const newsContainer = document.getElementById("news-container");
                
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
                        body: JSON.stringify({ deadline_id: cardId }),
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
                // setTimeout(function() {
                //     location.reload();
                // }, 500);
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

         

    })
    };


    const updatePaginationButtons = () => {
        const prevPageBtn = document.getElementById("prevPageBtn");
        const nextPageBtn = document.getElementById("nextPageBtn");

        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    };

    const handlePageChange = (newPage) => {
        // console.log("curr page", newPage)
        // console.log("total pages",totalPages)
        if (newPage >= 1 && newPage <= totalPages) {
            currentPage = newPage;
            document.getElementById("currentPage").textContent = `Page ${currentPage} of ${totalPages}`;
            // console.log("page change click")
            handleFilterChange();
            // displayDataForCurrentPage();
        }
    };

    const handleFilterChange = () => {
        // Update filters based on dropdown values
        currentCreatedByFilter = createdByFilterDropdown.value !== "All" ? createdByFilterDropdown.value : null;
        currentStatusFilter = statusFilterDropdown.value !== "All" ? statusFilterDropdown.value : null;
        currentKeywordFilter = keywordValue.value !== "All" ? keywordValue.value : null;

        localStorage.setItem("currentCreatedByFilter", currentCreatedByFilter);
        localStorage.setItem("currentStatusFilter", currentStatusFilter);
        localStorage.setItem("currentKeywordFilter", currentKeywordFilter);
            
        // Fetch data with updated filters
        filterAndDisplayData();
    };
    
    // Initial fetch for all data
    fetchAllNewsData();
    filterAndDisplayData();

    // Event listeners for filter dropdowns
    createdByFilterDropdown.addEventListener("change", handleFilterChange);
    statusFilterDropdown.addEventListener("change", handleFilterChange);
    keywordValue.addEventListener("change", handleFilterChange); 

    document.getElementById("nextPageBtn").addEventListener("click", () => {
        // console.log("click")
        handlePageChange(currentPage + 1);
    });

    document.getElementById("prevPageBtn").addEventListener("click", () => {
        handlePageChange(currentPage - 1);
    });


});
