// Dict to map event ids and image ids
let news_image_ids = {};

function newsDataUpdate (id, title, description, url, status){

    // Check if title, description, and at least one image are provided
    if (id === "" || title.trim() === "" || description.trim() === "" ) {
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
    formData.append("status", status);
    
    // Append the "url" field if it's provided
    if (url.trim() !== "") {
        formData.append("url", url);
    }

    // TO-DO: Edit this to handle update of image files

    // API call to send form data and images
    fetch('/admin/updateNewsData', {
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

function newsImageUpdate(id, updated_images, imageFiles){

    // Check if title, description, and at least one image are provided
    if (id === "" ) {
        Swal.fire({
            title: 'Error!',
            text: 'Event Does not exist',
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
    fetch('/admin/updateNewsImgData', {
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



document.addEventListener("DOMContentLoaded", function () {
    const newsContainer = document.getElementById("news-container");
    const paginationContainer = document.getElementById("pagination-container");
    const itemsPerPage = 5; // Adjust the number of items per page as needed
    const createdByFilterDropdown = document.getElementById("createdByFilter");
    const statusFilterDropdown = document.getElementById("statusFilter");
    const keywordValue = document.getElementById("keywordFilter");

    let currentPage = 1;
    let totalPages = 1;
    let allNewsData = [];
    let currentCreatedByFilter = null;
    let currentStatusFilter = null;
    let currentKeywordFilter = null;
    
    const fetchAllNewsData = () => {
        const fetchUrl = `/admin/getNewsData`;

        fetch(fetchUrl, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                if (data.hasOwnProperty("newsData") && Array.isArray(data.newsData)) {
                    allNewsData = data.newsData;
                    // Populate createdBy and status dropdowns
                    populateDropdown(createdByFilterDropdown, getUniqueValues(allNewsData, 'createdBy'));
                    populateDropdown(statusFilterDropdown, getUniqueValues(allNewsData, 'status'));
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
            filteredData = allNewsData;
        } else {
            // Apply filters
            filteredData = allNewsData.filter(item => {
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
        const currentPageData = allNewsData.slice(startIndex, endIndex);
        // console.log(currentPageData)
        const newsContainer = document.getElementById("news-container");
        newsContainer.innerHTML = "";

        displayData(currentPageData);
        updatePaginationButtons();
    };

    const displayData = (data) => {
        data.forEach(item => {
            // Render news cards (modify this part based on your existing code)
            
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

                // Create the second icon element
                const secondIcon = document.createElement("i");
                secondIcon.classList.add("fas", "fa-trash");
                secondAnchor.appendChild(secondIcon);
                secondAnchor.title = "Delete";

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
                        fetch('/admin/news/delete', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ news_id: cardId }),
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
                });
            });

            firstAnchor.addEventListener("click", async function () {
            
                let imagePreviews = createImagePreviews();

                // Function to create image elements for the item.images                    
                swal_html =  `
                <div id =  "container" style="text-align: left;">
                <label for="title" style="text-align: left;":>Title: </label>
                <input id="title" class = "form-control bg-light border-0 small" value="${item.title}"><br>
                <label for="description">Description: </label>
                <input id="description" class = "form-control bg-light border-0 small" value="${item.description}"><br>
                <label for="url" >URL: </label>
                <input id="url" class = "form-control bg-light border-0 small" value="${item.url}"<br><br> <!-- You can set a default value if you have one -->
                <label for="status">Status:<span id="asterisk" style="color: red;">*</span></label>
                <select id="statusDropdown" name="status" class="form-control bg-light border-0 small" required>
                <option value="Draft">Draft</option>
                <option value="Publish to Webpage">Publish to Webpage</option>
                <option value="Publish to Members">Publish to Members</option>
                </select><br>
                <label for="imageUpload">Images: (JPG, JPEG or PNG)</label>
            <input type="file" id="imageUpload" name = "imageUpload" accept=".jpg, .jpeg, .png"  multiple><br><br>
                <div id="image-preview" style="display:flex">
                ${imagePreviews} <!-- Insert the image previews here --
                </div>
                </div>`;
                    
                      await Swal.fire({
                        title: 'Edit ' + item.title,
                        html: swal_html,
                        width: '80%',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Edit',
                        focusConfirm: false,
                        didOpen: () => {
                            
                            var statusDropdown = document.getElementById("statusDropdown");
                            statusDropdown.value = item.status;

                            setTimeout(() => {
                                removeImage();
                            }, 100); // Use a short delay to ensure proper execution
                
                        }}).then((result) => {
                            if (result.isConfirmed) {
                                let updated_title = document.getElementById('title').value
                                let updated_desc =  document.getElementById('description').value
                                let updated_url = document.getElementById('url').value
                                let updated_status = document.getElementById("statusDropdown").value;
                                let new_image = document.getElementById('imageUpload').files
                                let updated_images =  news_image_ids[item.id]
                                newsDataUpdate(item.id, updated_title, updated_desc, updated_url, updated_status);

                                newsImageUpdate(item.id,updated_images, new_image);
                            }
                        });
    
                function removeImage() {
                    setTimeout(() => {
                      const removeButtons = document.querySelectorAll('.remove-image-button');
                      removeButtons.forEach(button => {
                        button.addEventListener('click', (e) => {
                          if (e.target.classList.contains('remove-image-button')) {
                            const selectedIndex = parseInt(e.target.getAttribute('data-index'));
    
                        // Handle the removal of an image
                        if (selectedIndex >= 0 && selectedIndex < item.images.length) {
                            const removedImageId = item.images[selectedIndex].image_id;
                            item.images.splice(selectedIndex, 1);
    
                            // Handle the removal of the corresponding image_id from the Set
                            if (news_image_ids[item.id]) {
                                news_image_ids[item.id].add(removedImageId);
                            }
    
                            imagePreviews = refreshImagePreviews();
                            // Swal.update({
                            //     html: swal_html,
                            // });
                            const imagePreviewsDiv = document.getElementById("image-previews");
    
                            if (imagePreviewsDiv) {
                            // Check if the div exists
    
                            // Replace the content of the div with the new content
                            imagePreviewsDiv.innerHTML = imagePreviews;
                            }
                            removeImage();
                        }}
                        });
                      });
                    }, 100);
                  }
    
    
                // Function to create image previews based on item.images
                async function createImagePreviews() {
                    return new Promise((resolve) => {
                    setTimeout(() => {
                        const imagePreviewContainer = document.getElementById('image-preview');
                        imagePreviewContainer.style.overflowY = "auto";
                        if (imagePreviewContainer) {
                        const imageBlocks = item.images.map((image, index) => {
                            // Initialize a Set if it doesn't exist
                            if (!news_image_ids[item.id]) {
                            news_image_ids[item.id] = new Set();
                            }
                
                            if (image.image_data) {
                            let imageFormat = getImageFormat(image.image_data);
                
                            const imageElement = document.createElement("img");
                            imageElement.src = `data:image/${imageFormat};base64, ${image.image_data}`;
                            imageElement.width = 150; // Set the width to 150 pixels
                            imageElement.height = 150; // Set the height to 150 pixels
                            imageElement.margin = 10;
                            imageElement.style.flex = "1";
                            imageElement.style.margin = "10%";
                            imageElement.className = "thumbnail";
                            imageElement.setAttribute("data-image-url", imageElement.src);
                
                            const removeButton = document.createElement("button");
                            removeButton.textContent = "Remove";
                            removeButton.style.backgroundColor = "#e84a5f";
                            removeButton.style.textDecorationColor = 'white';
                            removeButton.className = "remove-image-button";
                            removeButton.style.textAlign = "center";
                            removeButton.style.justifyItems = "center";
                            removeButton.style.borderRadius = "10px"
                            // removeButton.style.marginTop = "10%";
                            removeButton.setAttribute("data-index", index);
                
                            const imageBlock = document.createElement("div");
                            imageBlock.style.justifyContent = "center";
                            imageBlock.style.alignItems = "center";
                            imageBlock.style.textAlign = "center";
                            imageBlock.appendChild(imageElement);
                            imageBlock.appendChild(removeButton);
                
                            return imageBlock;
                            }
                        });
                
                        // Clear the existing content of the container
                        imagePreviewContainer.innerHTML = '';
                
                        // Append the image blocks to the container
                        imageBlocks.forEach((imageBlock) => {
                            imagePreviewContainer.appendChild(imageBlock);
                        });
                        }
                
                        resolve(); // Resolve the promise after creating the image previews
                    }, 100);
                    });
                }
      
      
                // Function to refresh image previews based on item.images
                async function refreshImagePreviews() {
                   await createImagePreviews(); // Re-create the image previews
                }


            });
            
                cardHeader.appendChild(cardTitle);
                cardHeader.appendChild(firstAnchor);
                cardHeader.appendChild(secondAnchor);

                // Create a div for the card body
                const cardBody = document.createElement("div");
                cardBody.classList.add("card-body");
                cardBody.style.overflow = "auto"; // Allow content to scroll if it overflows

                // Create the news card
                const card = document.createElement("div");
                card.classList.add("news-card");
                card.innerHTML = `
                <p>Title: <span class="editable" contenteditable="false"> ${item.title}</p>
                <p>Description: <span class="editable" contenteditable="false"> ${item.description}</p>
                <p>Status: <span class="editable" contenteditable="false">${item.status}</p>
                <p>Created By: ${item.createdBy}</p>
                <p>Created Date: ${item.createdDate}</p>
                <p>Modified By: ${item.modifiedBy}</p>
                <p>Modified Date: ${item.modifiedDate}</p>
                <p>URL:  <span class="editable" contenteditable="false"><a href="${item.url}" target="_blank">${item.url}</a><p>
                <p>Images:</p>
                 `;

                 // Append the news card to the card body
                 cardBody.appendChild(card);


                let imagesContainer = document.createElement("div");
                imagesContainer.style.display = "flex";  // Set display to "flex"
                imagesContainer.style.flexWrap = "wrap";  // Allow images to wrap to the next row if needed
                imagesContainer.style.justifyContent = "flex-start"; // Adjust as needed
                imagesContainer.style.height = "150px";
                imagesContainer.style.width = "100%";


                let imageBlock = document.createElement("div");
                
            
                item.images.forEach(image => {
                
                    let imageBlock = document.createElement("div");
                    
                    if (image.image_data) {
                        // Determine the image format based on the binary data
                        let imageFormat = getImageFormat(image.image_data);
                        
                        const imageElement = document.createElement("img");
                        imageElement.width = 150;  // Set the width to 100 pixels
                        imageElement.height = 150; // Set the height to 100 pixels
                        imageElement.style.flex = "1";
                        imageElement.style.marginRight = "30px";
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
