// Function to populate dropdown options
function populateTitleDropdown(data) {
    var activeTitles = data.data.active_titles;
    var statusDropdown = document.getElementById("statusDropdown");

    // Clear existing options
    statusDropdown.innerHTML = '';

    // Populate dropdown options
    activeTitles.forEach(function (title) {
        var option = document.createElement("option");
        option.value = title;
        option.text = title;
        statusDropdown.add(option);
    });
}


document.addEventListener("DOMContentLoaded", function () {
    fetch('/member/deadlines', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        // Call the function to populate dropdown options
        populateTitleDropdown(data);
    });
});

