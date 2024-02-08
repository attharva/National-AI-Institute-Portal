document.addEventListener("DOMContentLoaded", function() {
    const newsContainer = document.getElementById("activities-container");

    // fetch("https://api.example.com/news") // Replace with your News API URL
    fetch('/admin/getApprovedActivities', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        // Check if the response has the "newsData" property
        if (data.hasOwnProperty("newsData") && Array.isArray(data.newsData)) {
            data.newsData.forEach((item, index) => {
                const newsContainer = document.getElementById("activities-container");

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
                firstAnchor.title = "Pending";

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

                // Add a click event listener to the "fa-success" icon
                firstAnchor.addEventListener("click", function () {
                    // Get the unique identifier for the card you want to delete, e.g., item.id
                    const cardId = item.id; // Assuming you have an ID property in your data

                    // Display a confirmation dialog using Swal
                    Swal.fire({
                        title: 'Mark '+item.title+' as pending?',
                        text: "You can edit this change in Approved Papers",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Mark Pending',
                        cancelButtonText: 'Cancel',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // User confirmed, proceed with the deletion
                            // Send a DELETE request to your FastAPI backend with 'news_id' in the request body
                            fetch('/admin/markPendingActivity', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ activity_id: cardId }),
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    cardHeader.remove();
                                    cardBody.remove();
                                    Swal.fire(
                                        'Marked for review!',
                                        'Successfully added to Pending Activities',
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
                    confirmButtonText: 'Yes, delete it',
                    cancelButtonText: 'Cancel',
                }).then((result) => {
                    if (result.isConfirmed) {
                        // User confirmed, proceed with the deletion

                        // Send a DELETE request to your FastAPI backend with 'news_id' in the request body
                        fetch('/admin/rejectActivity', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ activity_id: cardId }),
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

            
                cardHeader.appendChild(cardTitle);
                cardHeader.appendChild(firstAnchor);
                cardHeader.appendChild(secondAnchor);

                // Create a div for the card body
                const cardBody = document.createElement("div");
                cardBody.classList.add("card-body");

                // Create the news card
                const card = document.createElement("div");
                card.classList.add("news-card");
                card.innerHTML = `
                    <p>Title: ${item.title}</p>
                    <p>Description: ${item.description}</p>
                    <a href="http://127.0.0.1:8000/admin/getPDF/${item.id}" target="_blank">View File</a>
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