




$('.js-filter').on('click', function () {
    var $tema = $(this).attr('data-tema');
    if (!$tema) return;
    if ($tema == '0') {
        $('.js-filterable').removeClass('is-hidden');
    } else {
        $('.js-filterable').addClass('is-hidden');
        $('.js-filterable[data-tema=' + $tema + ']').removeClass('is-hidden');
    }

});


$('a').click(function (e) {
    let $TextoTema = $(this).attr('value');
    if ($TextoTema)
        document.getElementById('dropdownMenuButton').innerText = $TextoTema;   
});

$('.btn-icon').click(function (e) {
    document.getElementById('dropdownMenuButton').innerText = 'Todos los temas';
});

