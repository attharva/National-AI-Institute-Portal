// Dict to map event ids and image ids
let report_file_ids = {};

var storedMemberID = localStorage.getItem("memberID");

function reportDataUpdate (id, title, description, submissionTitle){

    // Check if title, description, and at least one image are provided
    if (id === "" || title.trim() === "") {
        Swal.fire({
            title: 'Error!',
            text: 'Title is required',
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
    
    // Append the "url" field if it's provided
    if (submissionTitle !== "") {
        formData.append("submissionTitle", submissionTitle);
    }

    // API call to send form data and files
    fetch('/member/updateReportData', {
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

function reportFileUpdate(id, updated_files, newFiles){

    console.log(updated_files)

    // Check if title, description, and at least one image are provided
    if (id === "" ) {
        Swal.fire({
            title: 'Error!',
            text: 'Report Does not exist',
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
    for (var i = 0; i < newFiles.length; i++) {
        formData.append("files", newFiles[i]);
    }
    let fileArray;

    // Convert the Set to an array
    if (updated_files != null) {
        fileArray = Array.from(updated_files);
        // Now you can use the imageArray
      } else {
        fileArray = [null];
        // Handle the case when updated_images is an empty array by sending a null array
      }

    formData.append("file_ids", JSON.stringify(fileArray));

    // TO-DO: Edit this to handle update of image files

    // API call to send form data and images
    fetch('/member/updateReportFileData', {
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

function populateTitleDropdown(data) {
    var activeTitles = data.data.active_titles;
    var statusDropdown = document.getElementById("statusDropdown");

    // Clear existing options
    statusDropdown.innerHTML = '';

    // Populate dropdown options
    activeTitles.forEach(function (title) {
        var option = document.createElement("option");
        option.value = title;
        option.text = title;
        statusDropdown.add(option);
    });
}


document.addEventListener("DOMContentLoaded", function () {
    const newsContainer = document.getElementById("news-container");
    const paginationContainer = document.getElementById("pagination-container");
    const itemsPerPage = 5; // Adjust the number of items per page as needed
    const createdByFilterDropdown = document.getElementById("createdByFilter");
    const statusFilterDropdown = document.getElementById("statusFilter");
    const keywordValue = document.getElementById("keywordFilter");

    let currentPage = 1;
    let totalPages = 1;
    let allReportData = [];
    let currentCreatedByFilter = null;
    let currentStatusFilter = null;
    let currentKeywordFilter = null;

    
    const fetchAllEventsData = () => {
        const fetchUrl = `/member/getReportData`;

        fetch(fetchUrl, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                if (data.hasOwnProperty("reportData") && Array.isArray(data.reportData)) {
                    allReportData = data.reportData;
                    // console.log("check 1", allReportData)
                    // Populate createdBy and status dropdowns
                    populateDropdown(createdByFilterDropdown, getUniqueValues(allReportData, 'createdBy'));
                    populateDropdown(statusFilterDropdown, getUniqueValues(allReportData, 'submissionStatus'));
                    // console.log("check 1", allReportData)
                    filterAndDisplayData();

                } else {
                    console.error("Invalid or empty API response");
                }
            })
            .catch(error => {
                console.error("Error fetching report data: " + error);
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
            filteredData = allReportData;
            // console.log("check 2", filteredData)
        } else {
            // Apply filters
            filteredData = allReportData.filter(item => {
                return (!currentCreatedByFilter || item.createdBy === currentCreatedByFilter) && 
                (!currentKeywordFilter || item.title.toLowerCase().includes(currentKeywordFilter.toLowerCase())) && 
                (!currentStatusFilter || item.submissionStatus === currentStatusFilter);
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
        // const newsContainer = document.getElementById("news-container");
        newsContainer.innerHTML = "";
        displayData(currentPageData);
    
    };


    const displayData = (data) => {
        data.forEach(item => {

            const newsContainer = document.getElementById("news-container");

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
                fetch('/member/report/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ report_id: cardId }),
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
            // setTimeout(function() {
            //     location.reload();
            // }, 500);
            });
        });
            
        firstAnchor.addEventListener("click",  async function () {
            
            let filePreviews = createFilePreviews();
                
            // Function to create image elements for the item.images                    
            swal_html =  `
            <div id =  "container" style="text-align: left;">
            <label for="title">Title: <span style="color: red;">*</span></label>
            <input type="text" id="title" name="title" class = "form-control bg-light border-0 small" required value="${item.title}"><br><br>

            <label for="description">Description:</label>
            <textarea id="description" name="description" class = "form-control bg-light border-0 small" required value="${item.description}"></textarea><br><br>

            <br>
            <br>
            
            <label for="status">Submission Title:<span id="asterisk" style="color: red;">*</span></label>
            <select id="statusDropdown" name="status" class="form-control bg-light border-0 small" required>
                <!-- Placeholder option -->
                <option value="" disabled selected>Select Submission Title</option>
            </select><br><br>

         
            <label for="file">Files: (PDF)<span style="color: red;">*</span></label>
            <input type="file" id="fileUpload" name = "fileUpload"  accept=".pdf" multiple><br><br>
            <div id="file-preview" style="display:flex">
            ${filePreviews}
            </div>
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
            didOpen: () => {

                fetch('/member/deadlines', {
                    method: 'GET'
                })
                .then(response => response.json())
                .then(data => {
                    // Call the function to populate dropdown options
                    populateTitleDropdown(data);
                    var submissionTitle = document.getElementById("statusDropdown");
                    submissionTitle.value = item.submissionTitle;
                });
                
                setTimeout(() => {
                    removeFile();
                }, 100); // Use a short delay to ensure proper execution

            }}).then((result) => {
                if (result.isConfirmed) {
                    let updated_title = document.getElementById('title').value
                    let updated_desc =  document.getElementById('description').value
                    var updated_submissionTitle;
                    updated_submissionTitle = document.getElementById("statusDropdown").value; 
                    let new_file = document.getElementById('fileUpload').files
                    let updated_files =  report_file_ids[item.id]
                    reportDataUpdate(item.id, updated_title, updated_desc, updated_submissionTitle );
                    reportFileUpdate(item.id,updated_files, new_file);
                }
            });

            // Function to create file previews based on item.files
            async function createFilePreviews() {
                // Assuming the 'item.files' array contains information about the PDF files
                return new Promise((resolve) => {
                setTimeout(() => {
                const filesContainer = document.getElementById('file-preview');

                if (filesContainer) {
                    const fileBlocks = item.files.map((file, index) => {
                        const fileBlock = document.createElement("div");
                        
                        if (!report_file_ids[item.id]) {
                            report_file_ids[item.id] = new Set();
                            }

                        if (file.file_data) {
                            const imageSrc = '/static/Style/img/pdfIcon.png';

                            const fileIcon = document.createElement("img");
                            fileIcon.src = imageSrc;
                            fileIcon.style.height = "75px";
                            
                            // fileIcon.style.width = "100%";
                            fileIcon.alt = "File Icon";
                            
                            // Create a span for the filename or any other information
                            const filenameSpan = document.createElement("span");
                            filenameSpan.textContent = `File ${index + 1}`;

                            // Add a click event listener to each file thumbnail
                            fileIcon.addEventListener("click", () => {
                                    // Open the PDF in a new tab or display in a viewer as needed
                                    url = "data:application/pdf;base64," + file.file_data, "_blank";
                                    const iframeHtml = `<iframe src="${url}" width="100%" height="100%"></iframe>`;

                                    const newWindow = window.open('', '_blank');
                                    newWindow.document.write(iframeHtml);
                            });

                            fileBlock.style.flexDirection = "column";
                            fileBlock.style.justifyContent = "center";
                            fileBlock.style.alignItems = "center";
                            fileBlock.style.textAlign = "center";
                            fileBlock.style.display = "flex";
                            fileBlock.style.paddingRight = "20px";
                            fileBlock.appendChild(fileIcon);
                            fileBlock.appendChild(filenameSpan);

                        }

                        const removeButton = document.createElement("button");
                        removeButton.textContent = "Remove";
                        removeButton.style.backgroundColor = "#e84a5f";
                        removeButton.style.textDecorationColor = 'white';
                        removeButton.className = "remove-file-button";
                        removeButton.style.textAlign = "center";
                        removeButton.style.justifyItems = "center";
                        removeButton.style.borderRadius = "10px"
                        removeButton.setAttribute("data-index", index);

                        fileBlock.appendChild(removeButton);

                        return fileBlock;
                    });

                    // Clear the existing content of the container
                    filesContainer.innerHTML = '';

                    // Append the file blocks to the container
                    fileBlocks.forEach((fileBlock) => {
                        filesContainer.appendChild(fileBlock);
                    });
                }
                resolve(); // Resolve the promise after creating the image previews
            }, 100);
            });
            }

            // Function to handle the removal of files
            function removeFile() {
                setTimeout(() => {
                    const removeButtons = document.querySelectorAll('.remove-file-button');
                    removeButtons.forEach(button => {
                        button.addEventListener('click', (e) => {
                            if (e.target.classList.contains('remove-file-button')) {
                                const selectedIndex = parseInt(e.target.getAttribute('data-index'));

                                // Handle the removal of a file
                                if (selectedIndex >= 0 && selectedIndex < item.files.length) {
                                    const removedFileId = item.files[selectedIndex].file_id;
                                    item.files.splice(selectedIndex, 1);
                                    console.log(report_file_ids)
                                    // Handle the removal of the corresponding file_id from the Set
                                    if (report_file_ids[item.id]) {
                                        report_file_ids[item.id].add(removedFileId);
                                    }

                                    // Refresh file previews after removal
                                    createFilePreviews();
                                    removeFile();
                                }
                            }
                        });
                    });
                }, 100);
            }

            // Initial creation of file previews
            createFilePreviews();

            // Call removeFile to initialize the removal functionality
            removeFile();




            });
            
                cardHeader.appendChild(cardTitle);
                if (item.createdBy == storedMemberID){
                    cardHeader.appendChild(firstAnchor);
                    cardHeader.appendChild(secondAnchor);
                }
                // Create a div for the card body
                let cardBody = document.createElement("div");
                cardBody.classList.add("card-body");
                cardBody.style.overflow = "auto"; // Allow content to scroll if it overflows
                

                // Create the news card
                const card = document.createElement("div");
                card.classList.add("news-card");
                card.innerHTML = `
                <p>Title: <span class="editable" contenteditable="false"> ${item.title}</p>
                <p>Description: <span class="editable" contenteditable="false"> ${item.description}</p>
                <p>Submission Title: ${item.submissionTitle}
                <p>Submission Status: ${item.submissionStatus}
                <p>Created By: ${item.createdBy}</p>
                <p>Created Date: ${item.createdDate}</p>
                <p>Files:</p>
                `;

                    // Append the news card to the card body
                    cardBody.appendChild(card);

                    // Assuming the 'item.files' array contains information about the PDF files
                    let filesContainer = document.createElement("div");
                    // filesContainer.className =  "container";
                    filesContainer.style.display = "flex";
                    filesContainer.style.flexWrap = "wrap";
                    filesContainer.style.justifyContent = "flex-start";
                    // filesContainer.style.height = "100px";
                    // filesContainer.style.width = "60px";
                    filesContainer.style.width = "100%";

                    item.files.forEach((file, index) => {
                        let fileBlock = document.createElement("div");
                        fileBlock.style.alignItems = "center"
                        fileBlock.style.textAlign = "center"
                        // fileBlock.style.display = "flex";
                        console.log("here")
                        if (file.file_data) {

                            // Create an icon element for the file
                            // Assuming you have an image URL, replace 'path/to/your/image.png' with the actual path
                            const imageSrc = '/static/Style/img/pdfIcon.png';

                            const fileIcon = document.createElement("img");
                            fileIcon.src = imageSrc;
                            fileIcon.style.height = "150px";
                            fileIcon.style.width = "100%";
                            fileIcon.alt = "File Icon";
                            
                            // Create a span for the filename or any other information
                            const filenameSpan = document.createElement("span");
                            filenameSpan.textContent = `File ${index + 1}`;

                            // Add a click event listener to each file thumbnail
                            fileIcon.addEventListener("click", () => {
                                    // Open the PDF in a new tab or display in a viewer as needed
                                    url = "data:application/pdf;base64," + file.file_data, "_blank";
                                    const iframeHtml = `<iframe src="${url}" width="100%" height="100%"></iframe>`;

                                    const newWindow = window.open('', '_blank');
                                    newWindow.document.write(iframeHtml);

                            });
                            
                            fileBlock.appendChild(fileIcon);
                            fileBlock.appendChild(filenameSpan);
                        }

                        filesContainer.appendChild(fileBlock);
                        cardBody.appendChild(filesContainer);
                    });
                           
                // Append the card header to the newsContainer
                newsContainer.appendChild(cardHeader);

                // Append the card body to the newsContainer
                newsContainer.appendChild(cardBody);

                });
            
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
        
        // console.log("CurrentCreatedByFilter:", currentCreatedByFilter);
        // console.log("CurrentStatusFilter:", currentStatusFilter);
    
        // Fetch data with updated filters
        filterAndDisplayData();
    };
    
    // Initial fetch for all data
    fetchAllEventsData();
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
