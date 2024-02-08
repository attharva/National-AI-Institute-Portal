// Create an array to store the previously edited cards
const editedCards = {};

// Dict to map event ids and image ids
let event_image_ids = {};


// Function to generate modal content
const generateModalContent = (index, title, ImageSrc, description, eventDateTime, url) => {
    return `
        <div class="portfolio-modal modal fade" id="portfolioModal${index + 1}" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="close-modal" data-bs-dismiss="modal"><img src="static/Style/img/close-icon.svg" alt="Close modal" /></div>
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-lg-8">
                                <div class="modal-body">
                                    <!-- Project details-->
                                    <h2 class="text-uppercase">${title}</h2>
                                    <p class="item-intro text-muted"><i class="far fa-calendar-alt"></i> ${eventDateTime} </p>
                                    <img class="img-fluid d-block mx-auto" src="${ImageSrc}" alt="..." />
                                    <p>${description}</p>
                                    <ul class="list-inline">

                                        <li>
                                            <strong>Url:</strong>
                                            ${url}
                                        </li>
                                    </ul>
                                    <button class="btn btn-primary btn-xl text-uppercase" data-bs-dismiss="modal" type="button">
                                        <i class="fas fa-xmark me-1"></i>
                                        Close window
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
            
            if (data.eventsData.length <= 0) {
                // The array is empty, handle this case
                console.log("eventsData is empty");
                        // Append the main container to the document body or any other parent element
                const container = document.getElementById("row");
                container.style.justifyContent = "center";
                // Create a text element
                const noEventsText = document.createElement('p');
                noEventsText.style.alignContent = "center";
                noEventsText.textContent = 'No upcoming events';

                            
                container.appendChild(noEventsText);
            }
            data.eventsData.forEach((item, index) => {
                console.log("entered function on empty")
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
        colContainer.classList.add('col-lg-4', 'col-sm-6', 'mb-4');

        // Create the portfolio item
        const portfolioItem = document.createElement('div');
        portfolioItem.classList.add('portfolio-item');

        // Create the portfolio link with data-bs-toggle and href attributes
        const portfolioLink = document.createElement('a');
        portfolioLink.classList.add('portfolio-link');
        portfolioLink.setAttribute('data-bs-toggle', 'modal');
        portfolioLink.setAttribute('href', `#portfolioModal${index + 1}`);

        // Create the portfolio hover
        const portfolioHover = document.createElement('div');
        portfolioHover.classList.add('portfolio-hover');

        // Create the portfolio hover content
        const portfolioHoverContent = document.createElement('div');
        portfolioHoverContent.classList.add('portfolio-hover-content');
        portfolioHoverContent.innerHTML = '<i class="fas fa-plus fa-3x"></i>';

        // Create the portfolio image
        const portfolioImage = document.createElement('img');
        portfolioImage.classList.add('img-fluid');
        portfolioImage.setAttribute('src', `data:image/${getImageFormat(item.images[0].image_data)};base64, ${item.images[0].image_data}`);
        portfolioImage.setAttribute('alt', '...');
        portfolioImage.style.width = "26rem";
        portfolioImage.style.height = "26rem";

        // Create the portfolio caption
        const portfolioCaption = document.createElement('div');
        portfolioCaption.classList.add('portfolio-caption');

        // Create the portfolio caption heading
        const portfolioCaptionHeading = document.createElement('div');
        portfolioCaptionHeading.classList.add('portfolio-caption-heading');
        portfolioCaptionHeading.textContent = item.title;

        // Create the portfolio caption subheading

        // Create the info paragraph for date
        // const dateInfoParagraph = document.createElement('p');
        // dateInfoParagraph.classList.add('info');
        // dateInfoParagraph.innerHTML = `<i class="far fa-calendar-alt"></i>${formattedDate}<br><br><br><br>  `;

        const portfolioCaptionSubheading = document.createElement('div');
        portfolioCaptionSubheading.classList.add('portfolio-caption-subheading', 'text-muted');
        portfolioCaptionSubheading.innerHTML = `<i class="far fa-calendar-alt"></i> ${formattedDate} `;

        // Append elements to build the structure
        portfolioHover.appendChild(portfolioHoverContent);
        portfolioLink.appendChild(portfolioHover);
        portfolioLink.appendChild(portfolioImage);
        portfolioCaption.appendChild(portfolioCaptionHeading);
        portfolioCaption.appendChild(portfolioCaptionSubheading);
        portfolioItem.appendChild(portfolioLink);
        portfolioItem.appendChild(portfolioCaption);
        colContainer.appendChild(portfolioItem);

        
        // Append the main container to the document body or any other parent element
        const container = document.getElementById("row");
        container.appendChild(colContainer);

        // Generate modal content dynamically
        const modalContent = generateModalContent(index, item.title, `data:image/${getImageFormat(item.images[0].image_data)};base64, ${item.images[0].image_data}`, item.description, formattedDate, item.url);

        // Append the modal content to the main container
        document.body.innerHTML += modalContent;

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
