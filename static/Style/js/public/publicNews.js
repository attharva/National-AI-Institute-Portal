document.addEventListener("DOMContentLoaded", function () {
    const carouselContainer = document.getElementById('myCarousel');
    let allNewsData=[];
    // Sample data
    const cardData = [
        {
            imageUrl: 'https://images.pexels.com/photos/68525/soap-colorful-color-fruit-68525.jpeg',
            alt: 'Image 1',
            title: 'Card 1',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        },
        {
            imageUrl: 'https://images.pexels.com/photos/8754695/pexels-photo-8754695.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
            alt: 'Image 2',
            title: 'Card 2',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        },
        // Add more data as needed
    ];
    
    const fetchAllEventsData = () => {
        const fetchUrl = `/public/getNewsData`;
        
        fetch(fetchUrl, {
            method: 'GET',
        })
        .then(async response => await response.json())
        .then(async data => {
            if (data.hasOwnProperty("newsData") && Array.isArray(data.newsData)) {
                console.log(data)
                allNewsData = await data.newsData;
                console.log(allNewsData)
                displayData(allNewsData);
                
            } else {
                console.error("Invalid or empty API response");
            }
        })
        .catch(error => {
            console.error("Error fetching news data: " + error);
        });
    };
    
    
    const displayData = async (data) => {
        await data.forEach(item => {
            
            const card = document.createElement('div');
            card.classList.add('card', 'shadow', 'my-3');
            
            const cardImage = document.createElement('img');
            cardImage.src = item.images.length > 0 ? `data:image/${getImageFormat(item.images[0].image_data)};base64,${item.images[0].image_data}` : 'placeholder.jpg';
            cardImage.alt = "Image";
            cardImage.classList.add('card-img-top');
            cardImage.height = 300;
            
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
            
            const cardTitle = document.createElement('h5');
            cardTitle.classList.add('card-title');
            cardTitle.textContent = item.title;
            
            const cardText = document.createElement('p');
            cardText.classList.add('card-text');
            cardText.textContent = item.description;
            
            const eventDateTime = new Date(item.createdDate);
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

            // Create the info paragraph for date
            const dateInfoParagraph = document.createElement('p');
            dateInfoParagraph.classList.add('info');
            dateInfoParagraph.innerHTML = `<i class="far fa-calendar-alt"></i> ${formattedDate} <br><br><br><br>  `;
            dateInfoParagraph.style.color = "#FFFFFF";

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
            cardBody.appendChild(dateInfoParagraph);
            
            card.appendChild(cardImage);
            card.appendChild(cardBody);

            carouselContainer.appendChild(card);

        });
        $('.owl-carousel').owlCarousel({
            items: 3,
            loop: true,
            margin: 20,
            nav: true,
            navText: [
                "<i class='fas fa-chevron-left'></i>",
                "<i class='fas fa-chevron-right'></i>",
            ],
            responsive: {
                0: {
                    items: 1,
                },
                768: {
                    items: 2,
                },
                992: {
                    items: 3,
                },
            },
        });
    }
    
    // Initial fetch for all data
    fetchAllEventsData();
});

  function getImageFormat(imageData) {
            const uintArray = new Uint8Array(imageData.slice(0, 4));
            let imageFormat = '';
    
            if (uintArray[0] === 137 && uintArray[1] === 80 && uintArray[2] === 78 && uintArray[3] === 71) {
                imageFormat = 'png';
            } else if (uintArray[0] === 255 && uintArray[1] === 216) {
                imageFormat = 'jpeg';
            } else if (uintArray[0] === 255 && uintArray[1] === 218) {
                imageFormat = 'jpg';
            }
    
            return imageFormat;
    }
