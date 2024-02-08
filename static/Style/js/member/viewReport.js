

document.addEventListener("DOMContentLoaded", function() {
    const newsContainer = document.getElementById("news-container");


    fetch('/member/getReportData', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        // Check if the response has the "newsData" property
        if (data.hasOwnProperty("reportData")) {
            data.reportData.forEach((item, index) => {

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
                <p>Title: <span class="editable" contenteditable="false"> ${item.title}</p>
                <p>Description: <span class="editable" contenteditable="false"> ${item.description}</p>
                <p>Type: ${item.type}</p> 
                <p>Submission Title: ${item.submissionTitle}
                <p>Submission Status: ${item.submissionStatus}
                <p>Created By: ${item.createdBy}</p>
                <p>Created Date: ${item.createdDate}</p>
                <p>Files:</p>
                 `;

                 // Append the news card to the card body
                 cardBody.appendChild(card);

                //  item.files.forEach(file => {
                //     // Create a placeholder for the PDF
                //     const pdfPlaceholder = document.createElement("a");
                //     pdfPlaceholder.href = "data:application/pdf;base64," + file.file_data;
                //     pdfPlaceholder.download = "report.pdf";
                //     pdfPlaceholder.textContent = " Download PDF ";
                
                //     // Append the PDF placeholder to the card body
                //     cardBody.appendChild(pdfPlaceholder);
                // });
                

                // Append the card header to the newsContainer
                newsContainer.appendChild(cardHeader);


                // Append the card body to the newsContainer
                newsContainer.appendChild(cardBody);
    });

        } else {
            console.error("API response does not contain 'reportData' or it's not an array");
        }
    })
    .catch(error => {
        console.error("Error fetching news data: " + error);
    });
});