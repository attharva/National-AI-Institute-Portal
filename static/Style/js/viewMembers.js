document.addEventListener("DOMContentLoaded", function() {
    const newsContainer = document.getElementById("news-container");

    // fetch("https://api.example.com/news") // Replace with your News API URL
    fetch('/admin/getMembers', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        // Check if the response has the "newsData" property
        if (data.hasOwnProperty("members") && Array.isArray(data.members)) {
            data.members.forEach((item, index) => {
                


                const newsContainer = document.getElementById("news-container");

                // Create a div for the card header
                const cardHeader = document.createElement("div");
                cardHeader.classList.add("card-header", "py-3", "d-flex", "flex-row", "align-items-center", "justify-content-between");
            
                // Create the title
                const cardTitle = document.createElement("h6");
                cardTitle.classList.add("m-0", "font-weight-bold", "text-primary");
                cardTitle.textContent = item.name ;
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

                // Create the second anchor element
                const secondAnchor = document.createElement("a");
                secondAnchor.href = "#";
                secondAnchor.style.margin = "5px";
                secondAnchor.classList.add("btn", "btn-danger", "btn-circle");

                // Create the second icon element
                const secondIcon = document.createElement("i");
                secondIcon.classList.add("fas", "fa-trash");
                secondAnchor.appendChild(secondIcon);
                secondAnchor.title = "Remove Member";


                
                // Add a click event listener to the "fa-trash" icon
                secondAnchor.addEventListener("click", function () {
                    // Get the unique identifier for the card you want to delete, e.g., item.id
                    const cardId = item.id; // Assuming you have an ID property in your data

                    // Display a confirmation dialog using Swal
                    Swal.fire({
                        title: 'Delete '+item.name+' ?',
                        text: "You can not revert this action!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Remove Member',
                        cancelButtonText: 'Cancel',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // User confirmed, proceed with the deletion
                            // Send a DELETE request to your FastAPI backend with 'news_id' in the request body
                            fetch('/admin/removeMember', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ memberID: cardId }),
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    cardHeader.remove();
                                    cardBody.remove();
                                    Swal.fire(
                                        'Removed!',
                                        'Member has been deleted.',
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

            
                cardHeader.appendChild(cardTitle);
                // cardHeader.appendChild(firstAnchor);
                cardHeader.appendChild(secondAnchor);

                
                // /////////////////////////////////////////////////////////////
                // Create a div for the card body
                const cardBody = document.createElement("div");
                cardBody.classList.add("card-body");

                // Create the news card
                const card = document.createElement("div");
                card.classList.add("news-card");
                card.innerHTML = `
                <p>Name: ${item.name}</p>
                <p>University: ${item.university}</p>
                <p>Designation: ${item.designation}</p>
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