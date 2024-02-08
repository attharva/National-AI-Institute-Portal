async function logout() {
    // Redirect to the first URL
    window.location.href = 'http://127.0.0.1:8000/member/logout';

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