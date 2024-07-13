// Fungsi untuk memperbarui kartu skor
function updateScoreCards(data, boroughId) {
    // Filter data berdasarkan borough jika ada yang dipilih
    const filteredData = boroughId ? data.filter(property => property.BOROUGH == boroughId) : data;

    // Hitung total harga jual
    const totalSalePrice = filteredData.reduce((sum, property) => sum + parseFloat(property.SALE_PRICE || 0), 0);
    document.getElementById('total-sale-price').innerText = totalSalePrice.toLocaleString('en-US', {style: 'currency', currency: 'USD'});

    // Hitung total properti
    const totalProperties = filteredData.length;
    document.getElementById('total-property').innerText = totalProperties.toLocaleString('en-US');
}

// Ambil data properti dari server
fetch('json/nycPropSales.json')
    .then(response => response.json())
    .then(data => {
        window.propertyData = data;
        
        // Tampilkan total keseluruhan saat pertama kali memuat data
        updateScoreCards(data, null);

        // Tangani seleksi borough
        document.getElementById('borough-select').addEventListener('change', event => {
            const boroughId = event.target.value;
            updateScoreCards(window.propertyData, boroughId);
        });
    })
    .catch(error => {
        console.error('Error fetching the property data:', error);
    });