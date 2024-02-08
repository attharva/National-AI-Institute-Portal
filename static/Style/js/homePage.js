document.addEventListener("DOMContentLoaded", function(){
    fetch('/admin/homeData', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const universityNames = [];
        for (let i = 0; i < data.data.citations_by_university.length; i++) {
            console.log(data.data.citations_by_university[i].university)
            universityNames.push(data.data.citations_by_university[i].university);
        }
        const citations = [];
        for (let i = 0; i < data.data.citations_by_university.length; i++) {
            citations.push(data.data.citations_by_university[i].total_citations);
            console.log(data.data.citations_by_university[i].total_citations)
        }
        const papers = [];
        for (let i = 0; i < data.data.papers_by_university.length; i++) {
            papers.push(data.data.papers_by_university[i].papers);
            console.log(data.data.papers_by_university[i].papers)
        }
        const members = data.data.members_by_university;
   
        let event_div = document.getElementById('upcoming-event-box');
        event_div.textContent = data.data.next_event.title + " on "+  data.data.next_event.eventDateTime.substring(0, 10)
        // add pending requests
        let requests_div = document.getElementById('pending-requests');
        requests_div.textContent = data.data.pending_request
        // add pending report approvals
        let reports_div = document.getElementById('pending-reports');
        reports_div.textContent = data.data.pending_reports
        // open tickets and queries
        let tickets_div = document.getElementById('tickets-queries');
        tickets_div.textContent = data.data.communications
        build_barChart(universityNames, citations)
        build_areaChart(universityNames, papers)
        build_pieChart(data)
        build_horizontalChart(data)
        build_table(universityNames, citations, papers, members)
        console.log(data)
    })
})

function build_table(universityNames, citations, papers, members){
    // Assuming you have a parent element to append the table row to
    const tableBody = document.getElementById("table-body");
    for (let i = 0; i < universityNames.length; i++){
        const tableRow = document.createElement("tr");

        const cell1 = document.createElement("td");
        const div1 = document.createElement("div");
        div1.classList.add("d-flex", "px-2");
        const companyDiv = document.createElement("div");
        const companyName = document.createElement("h6");
        companyName.classList.add("mb-0", "text-sm");
        companyName.textContent = universityNames[i];
        companyDiv.appendChild(companyName);
        div1.appendChild(companyDiv);
        cell1.appendChild(div1);

        const cell2 = document.createElement("td");
        const amountParagraph = document.createElement("p");
        amountParagraph.classList.add("text-sm", "font-weight-bold", "mb-0");
        amountParagraph.textContent = members.filter(member => member.university == universityNames[i])[0].members;
        // console.log(members[i])
        // console.log(members.filter(member => member.university == universityNames[i]))
        // console.log(members[i])
        cell2.appendChild(amountParagraph);

        const cell3 = document.createElement("td");
        const statusSpan = document.createElement("span");
        statusSpan.classList.add("text-sm", "font-weight-bold");
        statusSpan.textContent = papers[i];
        cell3.appendChild(statusSpan);

        const cell4 = document.createElement("td");
        cell4.classList.add("align-middle", "text-center");
        const innerDiv4 = document.createElement("div");
        innerDiv4.classList.add("d-flex", "align-items-center", "justify-content-center");
        const percentageSpan = document.createElement("span");
        percentageSpan.classList.add("me-2", "text-sm", "font-weight-bold");
        percentageSpan.textContent = citations[i];
        innerDiv4.appendChild(percentageSpan);
        cell4.appendChild(innerDiv4);

        // Append all cells to the table row
        tableRow.appendChild(cell1);
        tableRow.appendChild(cell2);
        tableRow.appendChild(cell3);
        tableRow.appendChild(cell4);

        // Append the table row to the table body
        tableBody.appendChild(tableRow);
    }

}

function build_barChart(universityNames, citations){
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796';

    function number_format(number, decimals, dec_point, thousands_sep) {
    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    number = (number + '').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function(n, prec) {
        var k = Math.pow(10, prec);
        return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
    }
    
    // Bar Chart Example
    var ctx = document.getElementById("myBarChart");
    var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: universityNames,
        datasets: [{
        label: "Citations",
        backgroundColor: "#4e73df",
        hoverBackgroundColor: "#2e59d9",
        borderColor: "#4e73df",
        data: citations,
        }],
    },
    options: {
        maintainAspectRatio: false,
        layout: {
        padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0
        }
        },
        scales: {
        xAxes: [{
            time: {
            unit: 'month'
            },
            gridLines: {
            display: false,
            drawBorder: false
            },
            ticks: {
            maxTicksLimit: 6
            },
            maxBarThickness: 25,
        }],
        yAxes: [{
            ticks: {
            min: 0,
            max: Math.max(...citations),
            maxTicksLimit: 5,
            padding: 10,
            // Include a dollar sign in the ticks
            callback: function(value, index, values) {
                return '' + number_format(value);
            }
            },
            gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
            }
        }],
        },
        legend: {
        display: false
        },
        tooltips: {
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
        callbacks: {
            label: function(tooltipItem, chart) {
            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return datasetLabel + ': ' + number_format(tooltipItem.yLabel);
            }
        }
        },
    }
    });
}

function build_horizontalChart(response_data){
    // <h4 class="small font-weight-bold">University at Buffalo <span class="float-right">60%</span></h4>
    //                                 <div class="progress mb-4">
    //                                     <div class="progress-bar" role="progressbar" style="width: 60%" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
    //                                 </div>
    // const universityNames = [];
    // for (let i = 0; i < response_data.data.citations_by_university.length; i++) {
    //     console.log(response_data.data.citations_by_university[i].university)
    //     universityNames.push(response_data.data.citations_by_university[i].university);
    // }
    // const citations = [];
    // for (let i = 0; i < response_data.data.citations_by_university.length; i++) {
    //     citations.push(response_data.data.citations_by_university[i].total_citations);
    //     console.log(response_data.data.citations_by_university[i].total_citations)
    // }
    let parent = document.getElementById('citations-by-university');
    for(let i = 0; i < response_data.data.citations_by_university.length; i++){
        let div = document.createElement('div');
        let heading = document.createElement('h4');
        heading.classList.add('small', 'font-weight-bold');
        heading.textContent = response_data.data.citations_by_university[i].university;
        const progressDiv = document.createElement('div');
        progressDiv.classList.add('progress', 'mb-4');

        // Create the inner div with class "progress-bar"
        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');
        progressBar.setAttribute('role', 'progressbar');
        progressBar.style.width = '60%';
        progressBar.setAttribute('aria-valuenow', '60');
        progressBar.setAttribute('aria-valuemin', '0');
        progressBar.setAttribute('aria-valuemax', '100');

        // Append the inner div to the outer div
        progressDiv.appendChild(progressBar);
        div.appendChild(heading);
        div.appendChild(progressDiv)
    }
    
}

function build_areaChart(universityNames, papers){
    // Set new default font family and font color to mimic Bootstrap's default styling
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796';

    function number_format(number, decimals, dec_point, thousands_sep) {
        // *     example: number_format(1234.56, 2, ',', ' ');
        // *     return: '1 234,56'
        number = (number + '').replace(',', '').replace(' ', '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function(n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }

    
    var ctx = document.getElementById("myAreaChart");
    var myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: universityNames,
        datasets: [{
        label: "Citations",
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: papers,
        }],
    },
    options: {
        maintainAspectRatio: false,
        layout: {
        padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0
        }
        },
        scales: {
        xAxes: [{
            time: {
            unit: 'date'
            },
            gridLines: {
            display: false,
            drawBorder: false
            },
            ticks: {
            maxTicksLimit: 7
            }
        }],
        yAxes: [{
            ticks: {
            maxTicksLimit: 5,
            padding: 10,
            // Include a dollar sign in the ticks
            callback: function(value, index, values) {
                return number_format(value);
            }
            },
            gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
            }
        }],
        },
        legend: {
        display: false
        },
        tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: 'index',
        caretPadding: 10,
        callbacks: {
            label: function(tooltipItem, chart) {
            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return datasetLabel + ': ' + number_format(tooltipItem.yLabel);
            }
        }
        }
    }
    });

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
        labels: ["Approved", "Pending", "Rejected"],
        datasets: [{
        data: [data.data.approved_reports, data.data.pending_reports, data.data.rejected_reports],
        backgroundColor: ['#1cc88a', '#f6c23e', '#e74a3b'],
        hoverBackgroundColor: ['#1cc88a', '#f6c23e', '#e74a3b'],
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
async function logout() {
    // Redirect to the first URL
    window.location.href = 'http://0.0.0.0:8000/admin/logout';

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