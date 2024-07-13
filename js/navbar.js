$(document).ready(function() {
    $(".nav-menu").hover(function(event) {
        // Buat elemen tooltip
        var tooltip = $("<div class='tooltip'></div>");
        
        // Ambil keterangan dari atribut data-tooltip
        var tooltipText = $(this).attr("data-tooltip");
        tooltip.text(tooltipText);
        
        // Tambahkan tooltip ke body
        $("body").append(tooltip);
        
        // Posisi tooltip di sebelah kanan elemen yang sedang dihover
        var left = $(this).offset().left + $(this).width() + 5; // 5px jarak dari ikon
        var top = $(this).offset().top + $(this).height() / 2 - tooltip.height() / 2;
        tooltip.css({ left: left, top: top });
        
        // Tampilkan tooltip
        tooltip.fadeIn();
    }, function() {
        // Hapus tooltip saat mouse keluar
        $(".tooltip").remove();
    });
    $(".nav-menu").click(function() {
        // Hapus tooltip saat ikon diklik
        $(".tooltip").remove();
    });
});