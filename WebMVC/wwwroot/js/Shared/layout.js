const tiempoInactividad = 300000000;
var tiempoRestante = 300000;
var temporizadorInactividad;
var temporizadorInactividadModal;
var intervalo;
var sessionExpired;
var verificarInactividad;
var startRegresiveCount;
var actualizarCuentaRegresiva;

$(document).ready(function () {
    if (!window.host.includes('saludproteccion.') && !window.host.includes('masproteccionsalud.') && !window.host.includes('clinicamundoscotia.') && !window.host.includes('prevenciononcologica.') && !window.host.includes('saludtumundoseguro.') && !window.host.includes('cardif')) {
        sessionExpired = function logout() {
            if (window.location.href.toLowerCase().includes('medico')) {
                window.location.href = window.location.origin + "/Account/Logout?rol=Medico";
            } else {
                window.location.href = window.location.origin + "/Account/Logout?rol=Paciente";
            }

        }

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                verificarInactividad();
            } else {
                clearTimeout(temporizadorInactividad);
            }
        });
        window.addEventListener("mousemove", () => {
           verificarInactividad();
        });

        window.addEventListener("keydown", () => {
            verificarInactividad();
        });

        verificarInactividad = function verificarInactividadFunction() {
            if ("/Medico/Atencion_Box/" === window.location.pathname.slice(0, -window.location.pathname.split("").reverse().join("").search("/")))
                return;
            clearTimeout(temporizadorInactividad);
            temporizadorInactividad = setTimeout(() => {
                Swal.fire({
                    title: '<strong class="title-expired">Tu sesión ha expirado</strong>',
                    icon: 'info',
                    allowOutsideClick: false,
                    html:
                        '<p>Para volver a ingresar, debes volver al home de nuestra plataforma e ingresar con tu usuario y contraseña.</p>' +
                        '<div id="canvasContainer" style="position: relative; width: 200px; height: 200px; text-align: center; margin: auto;">' +
                        '<canvas id="canvas" width="200" height="200" style="position: absolute; top: 0; left: 0;"></canvas>' +
                        '<div class="countdown-item" style="position: absolute; top: 50%; left: 40%; transform: translate(-50%, -50%);"><span id="minutes">05</span></div>' +
                        '<div class="countdown-item" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">:</div>' +
                        '<div class="countdown-item" style="position: absolute; top: 50%; left: 60%; transform: translate(-50%, -50%);"><span id="seconds">00</span></div>' +
                        '</div>',
                    confirmButtonText:
                        'Volver a ingresar',
                    confirmButtonColor: '#d33',
                }).then((result) => {
                    if (result.value) {
                        sessionExpired();
                    }
                });
                startRegresiveCount();
            }, tiempoInactividad);
        }

        startRegresiveCount = function startRegresiveCountFunction() {

             intervalo = setInterval(() => {
                actualizarCuentaRegresiva();
            }, 1000);
            actualizarCuentaRegresiva();
        }

        actualizarCuentaRegresiva = function actualizarCuentaRegresivaFunction() {
            const minutos = Math.floor(tiempoRestante / 60);
            const segundos = tiempoRestante % 60;

            document.getElementById("minutes").textContent = minutos.toString().padStart(2, "0");
            document.getElementById("seconds").textContent = segundos.toString().padStart(2, "0");

            if (tiempoRestante === 0) {
                console.log('tiempo llego a 0', tiempoRestante)
                clearInterval(intervalo);
                sessionExpired();
            } else {
                //console.log('segundos:', segundos)
                drawCircle(tiempoRestante-- / 3 > 0 ? tiempoRestante-- / 3 : 0);                           
                tiempoRestante--;
            }
        }

        verificarInactividad();
    }
})

//funcion para la carga de la animacion del tiempo de espera
function drawCircle(percent) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;

    // Aqui calculo el momento en que finaliza el recorrido
    const endAngle = 1.5 * Math.PI - (2 * Math.PI * (percent / 100));

    // Aqui limpio la animacion
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // AQUI pinto el fondo
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    // aqui pinto el progreso
    ctx.strokeStyle = '#120A8F';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 1.5 * Math.PI, endAngle, true); //aqui le doy el angulo de direccion del progreso
    ctx.stroke();
}




var baseUrl = new URL(window.location.href); //url base para servicios.
if (baseUrl.hostname.includes("localhost")) {
    baseUrl = "http://localhost:7000";
} else if (baseUrl.hostname.includes("desa")) {
    baseUrl = "https://desa.services.medismart.live";
} else if (baseUrl.hostname.includes("t.qa")) {
    baseUrl = "https://test.services.medismart.live";
} else if (baseUrl.hostname.includes("qa")) {
    baseUrl = "https://qa.services.medismart.live";
} else if (baseUrl.hostname.includes("staging")) {
    baseUrl = "https://staging.services.medismart.live";

} else {
    baseUrl = "https://services.medismart.live";
}


var baseUrlWeb = new URL(window.location.href); // url base para mostrar imagenes.


if (baseUrlWeb.hostname.includes("inmv")) {
    if (baseUrlWeb.hostname.includes("qa")) {
        baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://inmv.qa.medical.medismart.live";
    } else {
        baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://inmv.medical.medismart.live";
    }
}
else if (baseUrlWeb.hostname.includes("doctoronline")) {
    if (baseUrlWeb.hostname.includes("qa") && baseUrlWeb.hostname.includes(".website") ) {
        baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://qa.website.doctoronline.cl";
    }
    else if (baseUrlWeb.hostname.includes("qa")) {
        baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://qa.doctoronline.cl";
    }
    else {
        baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://www.doctoronline.cl";
    }
}
else if (baseUrlWeb.hostname.includes("claro.")) {
    if (baseUrlWeb.hostname.includes("qa") && baseUrlWeb.hostname.includes(".website")) {
        baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://qa.website.claro.medismart.live";
    }
    else if (baseUrlWeb.hostname.includes("qa")) {
        baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://qa.claro.medismart.live";
    }
    else {
        baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://claro.medismart.live";
    }
}

else if (baseUrlWeb.hostname.includes("vidacamara.")) {
    if (baseUrlWeb.hostname.includes("qa") && baseUrlWeb.hostname.includes(".website")) {
        baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://qa.website.vidacamara.medismart.live";
    }
    else if (baseUrlWeb.hostname.includes("qa")) {
        baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://qa.vidacamara.medismart.live";
    }
    else {
        baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://vidacamara.medismart.live";
    }
}
else if (baseUrlWeb.hostname.includes("saludproteccion.")) {
    if (baseUrlWeb.hostname.includes("qa") && baseUrlWeb.hostname.includes(".website")) {
        baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://qa.website.saludproteccion.medismart.live";
    }
    else if (baseUrlWeb.hostname.includes("qa")) {
        baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://qa.saludproteccion.cl";
    }
    else {
        baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://www.saludproteccion.cl";
    }
}
else {
    if (baseUrlWeb.hostname.includes(".website")) {
        baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://medical.medismart.website";
    } else if (baseUrlWeb.hostname.includes("qa")) {
        baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://qa.medical.medismart.live";
    } else {
        baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://medical.medismart.live";
    }
}

var baseUrlEniax = new URL(window.location.href); 
if (baseUrlEniax.hostname.includes("qa")) {
    baseUrlEniax = baseUrlEniax.hostname.includes("localhost") ? "https://localhost:44332" : "https://eniax.medismart.live";
} else {
    baseUrlEniax = baseUrlEniax.hostname.includes("localhost") ? "https://localhost:44332" : "https://eniax.medismart.live";
}







