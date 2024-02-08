document.addEventListener("DOMContentLoaded", function() {
    const newsContainer = document.getElementById("news-container");

    // fetch("https://api.example.com/news") // Replace with your News API URL
    fetch('/member/tickets/view', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        // Check if the response has the "newsData" property
        // data = data["tickets"];
        console.log(data)
        if (Array.isArray(data.tickets)) {
            data.tickets.forEach((item, index) => {
                


                const newsContainer = document.getElementById("news-container");

                // Create a div for the card header
                const cardHeader = document.createElement("div");
                cardHeader.classList.add("card-header", "py-3", "d-flex", "flex-row", "align-items-center", "justify-content-between");
            
                // Create the title
                const cardTitle = document.createElement("h6");
                cardTitle.classList.add("m-0", "font-weight-bold", "text-primary");
                cardTitle.textContent = item.title ;
                cardTitle.style.flex = "1";

                // /////////////////////////////////////////////////////////////
                // Create the first anchor element
                // const firstAnchor = document.createElement("a");
                // firstAnchor.href = "#";
                // firstAnchor.style.margin = "5px";
                // firstAnchor.classList.add("btn", "btn-success", "btn-circle");
                // firstAnchor.title = "Approve";

                // // Create the first icon element
                // const firstIcon = document.createElement("i");
                // firstIcon.classList.add("fas", "fa-check");
                // firstAnchor.appendChild(firstIcon);

                


                
            
                cardHeader.appendChild(cardTitle);
                // cardHeader.appendChild(firstAnchor);
                // cardHeader.appendChild(secondAnchor);

                
                // /////////////////////////////////////////////////////////////
                // Create a div for the card body
                const cardBody = document.createElement("div");
                cardBody.classList.add("card-body");

                // Create the news card
                const card = document.createElement("div");
                card.classList.add("news-card");
                card.innerHTML = `
                <p>Description: ${item.description}</p>
                <p>Response: ${item.response}</p>
                <p>Ticket Date: ${item.ticketDate}</p>
                 `;

                 // Append the news card to the card body
                 cardBody.appendChild(card);
            
                // Append the card header to the newsContainer
                newsContainer.appendChild(cardHeader);


                // Append the card body to the newsContainer
                newsContainer.appendChild(cardBody);

            });
        } else {
            console.error("API response does not contain 'newsData' or it's not an array");
        }
    })
    .catch(error => {
        console.error("Error fetching news data: " + error);
    });
});