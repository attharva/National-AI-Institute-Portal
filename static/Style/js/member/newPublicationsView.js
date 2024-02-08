// Dict to map event ids and image ids
let event_image_ids = {};

var storedMemberID = localStorage.getItem("memberID");


document.addEventListener("DOMContentLoaded", function () {
    const publicationsContainer = document.getElementById("publications-container");
    const paginationContainer = document.getElementById("pagination-container");
    const itemsPerPage = 15; // Adjust the number of items per page as needed
    const yearFilterDropdown = document.getElementById("yearFilter");
    const keywordValue = document.getElementById("keywordFilter");

    let currentPage = 1;
    let totalPages = 1;
    let allEventsData = [];
    let currentYearFilter = null;
    let currentKeywordFilter = null;

    
    const fetchAllEventsData = () => {
        const fetchUrl = `/member/getNewPublicationsData`;

        fetch(fetchUrl, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                if (data.hasOwnProperty("publicationsData") && Array.isArray(data.publicationsData)) {
                    allEventsData = data.publicationsData;
                    // Populate createdBy and status dropdowns
                    populateDropdown(yearFilterDropdown, getUniqueValues(allEventsData, 'year'));
                    filterAndDisplayData();

                } else {
                    console.error("Invalid or empty API response");
                }
            })
            .catch(error => {
                console.error("Error fetching publications data: " + error);
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
        let filteredData;

        if (currentYearFilter === null && currentKeywordFilter === null) {
            // No filters, show all data
            filteredData = allEventsData;
        } else {
            // Apply filters
            filteredData = allEventsData.filter(item => {
                return (!currentYearFilter || item.year === currentYearFilter) &&
                       (!currentKeywordFilter || item.name.toLowerCase().includes(currentKeywordFilter.toLowerCase()));
            });
        }
        
        // Calculate total pages based on filtered data
        totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if(totalPages === 1){
            currentPage = 1;
        }
        document.getElementById("currentPage").textContent = `Page ${currentPage} of ${totalPages}`;

        // Display data for the current page
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentPageData = filteredData.slice(startIndex, endIndex);
        publicationsContainer.innerHTML = "";
        displayData(currentPageData);
    
    };


    const displayData = (data) => {
        const table = document.createElement("table");

        table.className = "table align-items-center justify-content-center card shadow mb-4"
        table.style.tableLayout = 'fixed';
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.backgroundColor = '#f8f9fc';
        const tbdy = document.createElement('tbody');
        tbdy.style.width = '100%';
        table.appendChild(tbdy);

        const theaders = document.createElement('tr');
        theaders.className = "m-0 font-weight-bold text-primary "
        
        const nameHeader = document.createTextNode("Name");
        const nameCell = document.createElement("th");
        nameCell.style.width = '45%';
        nameCell.style.border = '1px solid #a6a8b5';
        nameCell.style.borderCollapse = 'collapse';
        nameCell.className = "text-secondary text-xxs font-weight-bolder opacity-7";
        nameCell.appendChild(nameHeader);
        theaders.appendChild(nameCell);
        
        const yearHeader = document.createTextNode("Year");
        const yearCell = document.createElement("th");
        yearCell.style.width = '5%';
        yearCell.style.border = '1px solid #a6a8b5';
        yearCell.style.borderCollapse = 'collapse';
        yearCell.className = "text-secondary text-xxs font-weight-bolder opacity-7";
        yearCell.appendChild(yearHeader);
        theaders.appendChild(yearCell);

        const venueHeader = document.createTextNode("Venue");
        const venueCell = document.createElement("th");
        venueCell.style.width = '30%';
        venueCell.style.border = '1px solid #a6a8b5';
        venueCell.style.borderCollapse = 'collapse';
        venueCell.className = "text-secondary text-xxs font-weight-bolder opacity-7";
        venueCell.appendChild(venueHeader);
        theaders.appendChild(venueCell);

        const scholarHeader = document.createTextNode("Scholar");
        const scholarCell = document.createElement("th");
        scholarCell.style.width = '5%';
        scholarCell.style.border = '1px solid #a6a8b5';
        scholarCell.style.borderCollapse = 'collapse';
        scholarCell.className = "text-secondary text-xxs font-weight-bolder opacity-7";
        scholarCell.appendChild(scholarHeader);
        theaders.appendChild(scholarCell);

        const acmHeader = document.createTextNode("ACM");
        const acmCell = document.createElement("th");
        acmCell.style.width = '5%';
        acmCell.style.border = '1px solid #a6a8b5';
        acmCell.style.borderCollapse = 'collapse';
        acmCell.className = "text-secondary text-xxs font-weight-bolder opacity-7";
        acmCell.appendChild(acmHeader);
        theaders.appendChild(acmCell);

        const openalexHeader = document.createTextNode("OpenAlex");
        const openalexCell = document.createElement("th");
        openalexCell.style.width = '5%';
        openalexCell.style.border = '1px solid #a6a8b5';
        openalexCell.style.borderCollapse = 'collapse';
        openalexCell.className = "text-secondary text-xxs font-weight-bolder opacity-7";
        openalexCell.appendChild(openalexHeader);
        theaders.appendChild(openalexCell);

        const ieeeHeader = document.createTextNode("IEEE");
        const ieeeCell = document.createElement("th");
        ieeeCell.style.width = '5%';
        ieeeCell.style.border = '1px solid #a6a8b5';
        ieeeCell.style.borderCollapse = 'collapse';
        ieeeCell.className = "text-secondary text-xxs font-weight-bolder opacity-7";
        ieeeCell.appendChild(ieeeHeader);
        theaders.appendChild(ieeeCell);

        tbdy.appendChild(theaders)

        data.forEach(item => {
            const rowValue = document.createElement('tr');

            const nameValue = document.createTextNode(item["name"] ? item["name"] : "");
            const authorValue = document.createTextNode(item["authors"] ? item["authors"]: "")
            const nameCell = document.createElement("td");
            nameCell.style.border = '1px solid #a6a8b5';
            nameCell.style.borderCollapse = 'collapse';
            const italicizedAuthor = document.createElement('div');
            italicizedAuthor.style.fontStyle = 'italic';
            italicizedAuthor.appendChild(authorValue);
            var br = document.createElement("br");
            const editBtn = document.createElement('button');
            editBtn.classList.add("btn", "btn-primary", "btn-circle", "btn-sm");
            const editIcon = document.createElement('i');
            editIcon.classList.add("fas", "fa-edit");
            editBtn.appendChild(editIcon);
            editBtn.style.marginLeft = '85%';
            editBtn.style.marginRight = '3%';
            editBtn.value = item["publicationId"];
            editBtn.setAttribute("data-toggle", "modal");
            editBtn.setAttribute("data-target", "#editModal");
            editBtn.onclick = function(){
                editFunction(item["publicationId"]);
            };
            
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add("btn", "btn-danger", "btn-circle", "btn-sm")
            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add("fas", "fa-trash");
            deleteBtn.appendChild(deleteIcon);
            deleteBtn.value = item["publicationId"];
            deleteBtn.setAttribute("data-toggle", "modal");
            deleteBtn.setAttribute("data-target", "#deleteModal");
            deleteBtn.onclick = function(){
                deleteFunction(item["publicationId"]);
            };
            nameCell.appendChild(nameValue);
            nameCell.appendChild(br);
            nameCell.appendChild(italicizedAuthor);
            nameCell.appendChild(editBtn);
            nameCell.appendChild(deleteBtn);
            rowValue.appendChild(nameCell);
            
            const yearValue = document.createTextNode(item["year"] ? item["year"] : 0);
            const yearCell = document.createElement("td");
            yearCell.style.border = '1px solid #a6a8b5';
            yearCell.style.borderCollapse = 'collapse';
            yearCell.appendChild(yearValue);
            rowValue.appendChild(yearCell);

            const venueValue = document.createTextNode(item["venue"] ? item["venue"] : "");
            const venueCell = document.createElement("td");
            venueCell.style.border = '1px solid #a6a8b5';
            venueCell.style.borderCollapse = 'collapse';
            venueCell.appendChild(venueValue);
            rowValue.appendChild(venueCell);

            const scholarValue = document.createTextNode(item["citedBy_Scholar"] ? item["citedBy_Scholar"] : 0);
            const scholarCell = document.createElement("td");
            scholarCell.style.border = '1px solid #a6a8b5';
            scholarCell.style.borderCollapse = 'collapse';
            scholarCell.appendChild(scholarValue);
            rowValue.appendChild(scholarCell);

            const acmValue = document.createTextNode(item["citedBy_ACM"] ? item["citedBy_ACM"] : 0);
            const acmCell = document.createElement("td");
            acmCell.style.border = '1px solid #a6a8b5';
            acmCell.style.borderCollapse = 'collapse';
            acmCell.appendChild(acmValue);
            rowValue.appendChild(acmCell);

            const openalexValue = document.createTextNode(item["citedBy_OpenAlex"] ? item["citedBy_OpenAlex"] : 0);
            const openalexCell = document.createElement("td");
            openalexCell.style.border = '1px solid #a6a8b5';
            openalexCell.style.borderCollapse = 'collapse';
            openalexCell.appendChild(openalexValue);
            rowValue.appendChild(openalexCell);

            const ieeeValue = document.createTextNode(item["citedBy_IEEE"] ? item["citedBy_IEEE"] : 0);
            const ieeeCell = document.createElement("td");
            ieeeCell.style.border = '1px solid #a6a8b5';
            ieeeCell.style.borderCollapse = 'collapse';
            ieeeCell.appendChild(ieeeValue);
            rowValue.appendChild(ieeeCell);

            tbdy.appendChild(rowValue)

        });

        publicationsContainer.appendChild(table);

    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            currentPage = newPage;
            document.getElementById("currentPage").textContent = `Page ${currentPage} of ${totalPages}`;
            handleFilterChange();
        }
    };

    const handleFilterChange = () => {
        // Update filters based on dropdown values
        currentYearFilter = yearFilterDropdown.value !== "All" ? yearFilterDropdown.value : null;
        currentKeywordFilter = keywordValue.value !== "All" ? keywordValue.value : null;

        localStorage.setItem("currentYearFilter", currentYearFilter);
        localStorage.setItem("currentKeywordFilter", currentKeywordFilter);
        
        // Fetch data with updated filters
        filterAndDisplayData();
    };
    
    // Initial fetch for all data
    fetchAllEventsData();
    filterAndDisplayData();

    // Event listeners for filter dropdowns
    yearFilterDropdown.addEventListener("change", handleFilterChange);
    keywordValue.addEventListener("change", handleFilterChange);
      

    document.getElementById("nextPageBtn").addEventListener("click", () => {
        handlePageChange(currentPage + 1);
    });

    document.getElementById("prevPageBtn").addEventListener("click", () => {
        handlePageChange(currentPage - 1);
    });

    function editFunction(id) {
        const publicationToEdit = allEventsData.find((element) => element.publicationId == id);
        document.getElementById("publicationId").value = id;
        document.getElementById("publicationName").value = publicationToEdit.name;
        document.getElementById("publicationYear").value = publicationToEdit.year;
        document.getElementById("publicationAuthors").value = publicationToEdit.authors;
        document.getElementById("publicationVenue").value = publicationToEdit.venue;
    }

    document.getElementById("saveEditModal").addEventListener("click", () => {
        const publicationId = parseInt(document.getElementById("publicationId").value);
        const publicationName = document.getElementById("publicationName").value;
        const publicationYear = document.getElementById("publicationYear").value;
        const publicationAuthors = document.getElementById("publicationAuthors").value;
        const publicationVenue = document.getElementById("publicationVenue").value;
        const hideUrl = `/member/editPublicationsData`
        fetch(hideUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ publicationId: publicationId, publicationName: publicationName, publicationYear: publicationYear, publicationAuthors: publicationAuthors, publicationVenue: publicationVenue}),
        })
            .then(document.location.reload())
            .catch(error => {
                console.error("Error hiding publication data: " + error);
            });
    });

    let publicationIdToBeDeleted = -1;

    function deleteFunction(id) {
        publicationIdToBeDeleted = id;
    }

    document.getElementById("deleteDeleteModal").addEventListener("click", () => {
        const selectdIds = [publicationIdToBeDeleted];
        const comment = document.getElementById("comment").value;
        const hideUrl = `/member/hidePublicationsData`
        fetch(hideUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ publicationIds: selectdIds, comments: comment}),
        })
            .then(document.location.reload())
            .catch(error => {
                console.error("Error hiding publication data: " + error);
            });
    });

});
