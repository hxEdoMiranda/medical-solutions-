

window.addEventListener('load', () => {
    function ObtenerTamanioFuente(selectorAccesibilidad) {
        let tamanio = window.getComputedStyle(selectorAccesibilidad, null)
            .getPropertyValue('font-size');
        return parseFloat(tamanio);
    }

    function ControlTamanioElementos(selectorClaseAccesibilidad, aumentar, normal) {
        for (let i = 0; i < selectorClaseAccesibilidad.length; i++) {
            const element = selectorClaseAccesibilidad[i];
            let fontSizeAtual = 0;

            if (normal) {
                element.style.fontSize = '1rem';
            }
            else {
                if (aumentar)
                    fontSizeAtual = ObtenerTamanioFuente(element) + 1;
                else
                    fontSizeAtual = ObtenerTamanioFuente(element) - 1;

                element.style.fontSize = fontSizeAtual.toString() + 'px';
            }
        }
    }
        
    document.querySelectorAll('#increase-font').forEach(input => input.addEventListener('click', e => {
        let acessibilidad = document.getElementsByClassName('fuente-accesible');
        ControlTamanioElementos(acessibilidad, true);
    })); 
   
    document.querySelectorAll('#normal-font').forEach(input => input.addEventListener('click', e => {
        let acessibilidad = document.getElementsByClassName('fuente-accesible');
        ControlTamanioElementos(acessibilidad, null, true);
    }));

    document.querySelectorAll('#decrease-font').forEach(input => input.addEventListener('click', e => {
        let acessibilidad = document.getElementsByClassName('fuente-accesible');
        ControlTamanioElementos(acessibilidad, false);
    }));

    document.querySelectorAll('#increase-font-desk').forEach(input => input.addEventListener('click', e => {
        let acessibilidad = document.getElementsByClassName('fuente-accesible');
        ControlTamanioElementos(acessibilidad, true);
    }));

    document.querySelectorAll('#normal-font-desk').forEach(input => input.addEventListener('click', e => {
        let acessibilidad = document.getElementsByClassName('fuente-accesible');
        ControlTamanioElementos(acessibilidad, null, true);
    }));
   
    document.querySelectorAll('#decrease-font-desk').forEach(input => input.addEventListener('click', e => {
        let acessibilidad = document.getElementsByClassName('fuente-accesible');
        ControlTamanioElementos(acessibilidad, false);
    }));
});



$('#dropdown-accesible').on('click', function (e) {
    e.stopPropagation();
});