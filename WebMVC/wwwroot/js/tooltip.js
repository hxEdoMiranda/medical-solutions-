/*Tooltips Menu superior*/


// $('#item-accesibilidad').tooltip();
$('.cont-caja-sura').tooltip();
$('#btnSelectBeneficiario').tooltip();
// $('#item-alertas').tooltip();
// $('#item-ayuda').tooltip();
$('#item-salir').tooltip();
$('.positiva-login--info-user').tooltip();
$('.positiva-home--tooltip').tooltip();

$(document).ready(function () {
    // Check if the device is a touch device (mobile)
    if ('ontouchstart' in window) {
        // For mobile devices, show tooltip on focus
        $('[data-toggle="tooltip"]').on('focus', function () {
            $(this).tooltip('show');
        }).on('blur', function () {
            $(this).tooltip('hide');
        });
    }
});

/*$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="tooltip"]').on('show.bs.tooltip', function () {
        $(this).on('mouseover', function () {
            $(this).tooltip('hide');
        });
    });
});
*/

/* $(function () {
     $('[data-toggle="tooltip"]').tooltip({
         trigger: 'click'
     }
    );
    
});*/