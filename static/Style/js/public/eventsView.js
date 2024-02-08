// Create an array to store the previously edited cards
const editedCards = {};

// Dict to map event ids and image ids
let event_image_ids = {};

// Function to generate modal HTML
const generateModalHTML = (projectName, projectImageSrc, projectDescription, client, category) => {
    return `
        <div class="portfolio-modal modal fade" id="portfolioModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="close-modal" data-bs-dismiss="modal"><img src="assets/img/close-icon.svg" alt="Close modal" /></div>
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-lg-8">
                                <div class="modal-body">
                                    <!-- Project details-->
                                    <h2 class="text-uppercase">${projectName}</h2>
                                    <p class="item-intro text-muted">${projectDescription}</p>
                                    <img class="img-fluid d-block mx-auto" src="${projectImageSrc}" alt="..." />
                                    <p>${projectDescription}</p>
                                    <ul class="list-inline">
                                        <li>
                                            <strong>Client:</strong>
                                            ${client}
                                        </li>
                                        <li>
                                            <strong>Category:</strong>
                                            ${category}
                                        </li>
                                    </ul>
                                    <button class="btn btn-primary btn-xl text-uppercase" data-bs-dismiss="modal" type="button">
                                        <i class="fas fa-xmark me-1"></i>
                                        Close Project
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
};


document.addEventListener("DOMContentLoaded", function() {

    // Events Data Fetch API 
    fetch('/public/getEventsData', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        // Check if the response has the "newsData" property
        if (data.hasOwnProperty("eventsData") && Array.isArray(data.eventsData)) {
            data.eventsData.forEach((item, index) => {
                
                const eventDateTime = new Date(item.eventDateTime);
                // Format the date as needed (e.g., using toLocaleDateString and toLocaleTimeString)
                const formattedDate = eventDateTime.toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    timeZoneName: 'short'
                });
                // const formattedTime = eventDateTime.toLocaleTimeString();

                // Create the main container
                const colContainer = document.createElement('div');
                colContainer.classList.add('col');
                colContainer.style.marginRight  = '20px';
                colContainer.style.width = "33%";

                const itemContainer = document.createElement('div');
                itemContainer.classList.add('card', 'shadow-sm'); // Bootstrap class for 3 columns per row
                itemContainer.classList.add('item-container');
                itemContainer.style.marginRight = '20px';
                
                // Create the body container
                const bodyContainer = document.createElement('div');
                bodyContainer.classList.add('body-container');

                // Create the overlay div
                const overlayDiv = document.createElement('div');
                overlayDiv.classList.add('overlay');

                // Append the overlay div to the body container
                bodyContainer.appendChild(overlayDiv);

                // Create the event info container
                const eventInfo = document.createElement('div');
                eventInfo.classList.add('event-info');

                // Create the title paragraph
                const titleParagraph = document.createElement('p');
                titleParagraph.classList.add('title');
                titleParagraph.textContent = item.title;

                // Create the info paragraph for date
                const dateInfoParagraph = document.createElement('p');
                dateInfoParagraph.classList.add('info');
                dateInfoParagraph.innerHTML = `<i class="far fa-calendar-alt"></i>${formattedDate}<br><br><br><br>  `;

                // Create the additional info container
                const separator = document.createElement('div');
                separator.classList.add('separator');

                // Create the additional info container
                const additionalInfo = document.createElement('div');
                additionalInfo.classList.add('additional-info');

                // Create the url paragraph
                const urlParagraph = document.createElement('p');
                urlParagraph.classList.add('info');
                urlParagraph.innerHTML = `<i class="fas fa-link"></i> <a href="${item.url}" target="_blank">${item.url}</a><br><br>`;

                // Create the description paragraph
                const descriptionParagraph = document.createElement('p');
                descriptionParagraph.classList.add('info', 'description');
                descriptionParagraph.textContent = item.description;

                // Append the paragraphs to the additional info container
                additionalInfo.appendChild(descriptionParagraph);
                additionalInfo.appendChild(urlParagraph);

                // Append the paragraphs to the event info container
                eventInfo.appendChild(titleParagraph);
                eventInfo.appendChild(dateInfoParagraph);
                eventInfo.appendChild(separator);
                eventInfo.appendChild(additionalInfo);
                bodyContainer.appendChild(eventInfo);


                // Create the image container
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('img-container');

                if (item.images.length > 0) {
                const firstImage = item.images[0];

                if (firstImage.image_data) {
                    // Determine the image format based on the binary data
                    let imageFormat = getImageFormat(firstImage.image_data);
                        
                    // Create the image element
                        var imgElement = document.createElement('img');

                        imgElement.setAttribute("data-image-url", imgElement.src);
                        imgElement.src = "data:image/"+imageFormat+";base64," + firstImage.image_data; // Change the MIME type as needed
                        // Append the image element to the image container
                        imgContainer.appendChild(imgElement);
                }
            }

                // Append the containers to the main container
                itemContainer.appendChild(imgContainer);
                itemContainer.appendChild(bodyContainer);
                
                colContainer.appendChild(itemContainer);

                // Append the main container to the document body or any other parent element
                container = document.getElementById("eventcontainer");
                container.appendChild(colContainer);


                bodyContainer.addEventListener("click", () => {
                    console.log("click") 
                    // Modify this part to get other project details
                const projectName = "Project Name";
                const projectDescription = "Lorem ipsum dolor sit amet consectetur.";
                const client = "Threads";
                const category = "Illustration";

                // Generate modal HTML dynamically
                const modalHTML = generateModalHTML(projectName,  imgElement.src, projectDescription, client, category);

                // Display the modal using Swal
                // Swal.fire({
                //     html: modalHTML,
                //     showCloseButton: true,
                //     showConfirmButton: false,
                // });
                const mainContainer = document.getElementById("main");
                mainContainer.innerHTML = modalContent;
            });
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
                        
        } else {
            console.error("API response is invalid");
        }
    })
    .catch(error => {
        console.error("Error fetching event data: " + error);
    });
});
