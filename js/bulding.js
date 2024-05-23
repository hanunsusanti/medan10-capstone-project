document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

    let jsonData = [];

    // Function to update total building/property
    function updateTotalProperty(data, borough = 'all') {
        let totalCategories;
        if (borough === 'all') {
            totalCategories = data[0].total_categories;
        } else {
            const boroughData = data.find(item => item.BOROUGH === borough);
            totalCategories = boroughData ? boroughData.total_categories : 'N/A';
        }
        console.log('Total categories:', totalCategories); // Debug
        document.querySelector('.scoreprop').textContent = totalCategories;
    }

    // Load JSON data from file
    fetch('json/bulding.json')
        .then(response => response.json())
        .then(data => {
            console.log('Data loaded successfully:', data); // Debug
            jsonData = data;
            updateTotalProperty(data);
            return data;
        })
        .catch(error => console.error('Error loading JSON:', error));

    // Handle borough selection
    document.querySelectorAll('.borough-dropdwn-content a').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const borough = event.target.getAttribute('data-id');
            console.log('Borough selected:', borough); // Debug
            updateTotalProperty(jsonData, borough);
        });
    });
})
