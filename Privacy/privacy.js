document.addEventListener('DOMContentLoaded', function() {
    // Example: Adding dynamic date in the privacy policy
    const effectiveDate = document.querySelector('.privacy-policy p strong');
    const currentDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    effectiveDate.textContent = currentDate;
});
