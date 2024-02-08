document.addEventListener("DOMContentLoaded", function(){
    fetch('/member/home/data', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        // const universityNames = [];
        // for (let i = 0; i < data.data.citations_by_university.length; i++) {
        //     console.log(data.data.citations_by_university[i].university)
        //     universityNames.push(data.data.citations_by_university[i].university);
        // }
        // const citations = [];
        // for (let i = 0; i < data.data.citations_by_university.length; i++) {
        //     citations.push(data.data.citations_by_university[i].total_citations);
        //     console.log(data.data.citations_by_university[i].total_citations)
        // }
        // const papers = [];
        // for (let i = 0; i < data.data.papers_by_university.length; i++) {
        //     papers.push(data.data.papers_by_university[i].papers);
        //     console.log(data.data.papers_by_university[i].papers)
        // }
        // const members = data.data.members_by_university;
   
        let event_div = document.getElementById('upcoming-event-box');

        if (data.data.next_event.title != "") {
            event_div.textContent = data.data.next_event.title + " on " + data.data.next_event.eventDateTime.substring(0, 10);
        } else {
            event_div.textContent = "No upcoming event";
        }
        
        // add pending requests

        let deadline_div = document.getElementById('upcoming-deadlines');
        deadline_div.textContent = data.data.next_deadline.title + " on "+  data.data.next_deadline.deadlineDateTime.substring(0, 10)

        let requests_div = document.getElementById('pending-submissions');
        requests_div.textContent = data.data.total_pendingSubmission
        // add pending report approvals

        let reports_div = document.getElementById('papers-uploaded');
        reports_div.textContent = data.data.total_paperSubmission
        // open tickets and queries

        // let tickets_div = document.getElementById('tickets-queries');
        // tickets_div.textContent = data.data.communications

        build_pieChart(data)
        build_EventCard(data)
        build_NewsCard(data)
        build_reportCard(data)



        var calendarData = data.data.cal_list;


        var calendar = new Calendar("calendar", calendarData);


    })
})

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

function build_pieChart(data){
    // Set new default font family and font color to mimic Bootstrap's default styling
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796';

    // Pie Chart Example
    var ctx = document.getElementById("myPieChart");

    var myPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ["on Time", "Late"],
        datasets: [{
        data: [data.data.onTime_reports, data.data.late_reports],
        backgroundColor: ['#1cc88a', '#f6c23e'],
        hoverBackgroundColor: ['#1cc88a', '#f6c23e'],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
    },
    options: {
        maintainAspectRatio: false,
        tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
        },
        legend: {
        display: false
        },
        cutoutPercentage: 80,
    },
    });

}

function build_EventCard(data){

    // Get the parent div
    // Additional code to handle eventsData
    var eventDiv = document.getElementById("event");
    eventDiv.style.display = 'flex';
    var eventsData = data.data.eventsData;

    if (eventsData.length > 0) {
        var firstEvent = eventsData[0];

        var imageDiv = document.createElement("div");

        // Create and append the image
        var image = document.createElement("img");
        image.className = "img-fluid px-3 px-sm-4 mt-3 mb-4";
        image.style.width = "15rem";
        image.style.width = "15rem";
        if (firstEvent.images.length > 0){
            let imageFormat = getImageFormat(firstEvent.images[0].image_data);
            image.src = "data:image/"+imageFormat+";base64," + firstEvent.images[0].image_data;
        }
        else{
            image.src = "/static/Style/img/event.webp"
        }
        imageDiv.appendChild(image);
        eventDiv.appendChild(imageDiv);

        
        var textDiv = document.createElement("div");

        var title = document.createElement("p");
        title.textContent = "Title: " + firstEvent.title;
        textDiv.appendChild(title);

        // Create and append the description
        var description = document.createElement("p");
        description.textContent = "Description: " + firstEvent.description;
        textDiv.appendChild(description);

        var eventDateTime = firstEvent.eventDateTime;
        var formattedEventDate = new Date(eventDateTime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
            timeZoneName: 'short'
        });

        var eventDate = document.createElement("p");
        eventDate.textContent = "Event Date: " + formattedEventDate;
        textDiv.appendChild(eventDate);

        // Create and append the created by and modified by information
        var createdBy = document.createElement("p");
        createdBy.textContent = "Created By: " + firstEvent.createdBy;
        textDiv.appendChild(createdBy);
        
        // Create and append the created by and modified by information
        var url = document.createElement("p");
        url.textContent = "URL: " + firstEvent.url;
        textDiv.appendChild(url);
 

        eventDiv.appendChild(textDiv);

        
    } else {
        eventDiv.textContent = "No events data available";
    }

}

function build_NewsCard(data){

    // Get the parent div
    // Additional code to handle eventsData
    var eventDiv = document.getElementById("news");
    eventDiv.style.display = 'flex';
    var newsData = data.data.newsData;

    if (newsData.length > 0) {
        var firstNews = newsData[0];

        var imageDiv = document.createElement("div");

        // Create and append the image
        var image = document.createElement("img");
        image.className = "img-fluid px-3 px-sm-4 mt-3 mb-4";
        image.style.width = "15rem";
        image.style.width = "15rem";

        if (firstNews.images.length > 0){
            let imageFormat = getImageFormat(firstNews.images[0].image_data);
            image.src = "data:image/"+imageFormat+";base64," + firstNews.images[0].image_data;
        }
        else{
            image.src = "/static/Style/img/news.webp"
        }


        
        imageDiv.appendChild(image);
        eventDiv.appendChild(imageDiv);

        
        var textDiv = document.createElement("div");

        var title = document.createElement("p");
        title.textContent = "Title: " + firstNews.title;
        textDiv.appendChild(title);

        // Create and append the description
        var description = document.createElement("p");
        description.textContent = "Description: " + firstNews.description;
        textDiv.appendChild(description);

        var createdDate = firstNews.createdDate;
        var formattedEventDate = new Date(createdDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
            timeZoneName: 'short'
        });

        var eventDate = document.createElement("p");
        eventDate.textContent = "Created on: " + formattedEventDate;
        textDiv.appendChild(eventDate);

        // Create and append the created by and modified by information
        var createdBy = document.createElement("p");
        createdBy.textContent = "Created By: " + firstNews.createdBy;
        textDiv.appendChild(createdBy);
        
        // Create and append the created by and modified by information
        var url = document.createElement("p");
        url.textContent = "URL: " + firstNews.url;
        textDiv.appendChild(url);
 

        eventDiv.appendChild(textDiv);

        
    } else {
        eventDiv.textContent = "No news data available";
    }

}

function build_reportCard(data){

    // Get the parent div
    // Additional code to handle eventsData
    var reportDiv = document.getElementById("report");
    reportDiv.style.display = 'flex';
    var reportData = data.data.reportData;
    // console.log("len test", (Object.keys(reportData[0]).length > 0))
    if (Object.keys(reportData[0]).length > 0) {
        var firstReport = reportData[0];
        var FileDiv = document.createElement("div");

        // Create and append the image
        var image = document.createElement("img");
        image.className = "img-fluid px-3 px-sm-4 mt-3 mb-4";
        image.style.width = "15rem";
        image.style.width = "15rem";
        image.src = '/static/Style/img/pdfIcon.png';
                
        // Add a click event listener to each file thumbnail
        image.addEventListener("click", () => {
                // Open the PDF in a new tab or display in a viewer as needed
                url = "data:application/pdf;base64," + firstReport.files[0].file_data, "_blank";
                const iframeHtml = `<iframe src="${url}" width="100%" height="100%"></iframe>`;

                const newWindow = window.open('', '_blank');
                newWindow.document.write(iframeHtml);
        });


        FileDiv.appendChild(image);
        reportDiv.appendChild(FileDiv);

        
        var textDiv = document.createElement("div");

        var title = document.createElement("p");
        title.textContent = "Title: " + firstReport.title;
        textDiv.appendChild(title);

        // Create and append the description
        var description = document.createElement("p");
        description.textContent = "Description: " + firstReport.description;
        textDiv.appendChild(description);

        var createdDate = firstReport.createdDate;
        // console.log(createdDate)
        var formattedEventDate = new Date(createdDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
            timeZoneName: 'short'
        });

        var eventDate = document.createElement("p");
        eventDate.textContent = "Created On: " + formattedEventDate;
        textDiv.appendChild(eventDate);

        // Create and append the created by and modified by information
        var submissionStatus = document.createElement("p");
        submissionStatus.textContent = "Status: " + firstReport.submissionStatus;
        textDiv.appendChild(submissionStatus);
    
        // Create and append the created by and modified by information
        var submissionTitle = document.createElement("p");
        submissionTitle.textContent = "Submitted for: " + firstReport.submissionTitle;
        textDiv.appendChild(submissionTitle);

        // Create and append the created by and modified by information
        var createdBy = document.createElement("p");
        createdBy.textContent = "Created By: " + firstReport.createdBy;
        textDiv.appendChild(createdBy);
        

        

        reportDiv.appendChild(textDiv);

        
    } else {
        reportDiv.textContent = "No report data available";
    }

}


async function logout() {
    // Redirect to the first URL
    window.location.href = 'http://0.0.0.0:8000/member/logout';

    // Wait for a moment (e.g., 2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Reload the page
    window.location.reload(true);
    // window.location.reload(true);
    

    // Replace the current history entry to disable the back button
    window.location.replace(window.location.href);


    // After the page is reloaded, you can proceed with the second URL if needed
    // window.location.href = 'http://127.0.0.1:8000/admin/adminLogin';
}