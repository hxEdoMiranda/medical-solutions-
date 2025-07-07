const uriConci = baseUrl + '/agendamientos/Concierge'

var botChat = document.getElementById('bot-chat');
var botToggle = document.getElementById('bot-toggle');
var userInput = document.getElementById('user-input');
var botMessages = document.getElementById('bot-messages');
var contenedor = document.getElementById("conversacion");
var scrollPrevious = contenedor.scrollHeight - contenedor.scrollTop;
var writingIndicator = document.getElementById("writing-indicator");

userInput.addEventListener("keydown", function(event){
    if(event.key == "Enter"){
        sendMessage();
    }
})





async function toggleBot() {
    if (botChat.style.display === 'none') {
        botChat.style.display = 'block';
        botToggle.innerHTML = 'Cerrar Chat';
    } else {
        botChat.style.display = 'none';
        botToggle.innerHTML = 'Asistente de Salud en Medismart.live';
    }
}

window.addEventListener('load', function () {
    botChat.style.display = 'block';
    botToggle.innerHTML = 'Cerrar Chat';
    document.getElementById('toggle-button').innerHTML = 'X<span></span>';
});

document.getElementById('toggle-button').addEventListener('click', function () {
    if (botChat.style.display === 'none') {
        botChat.style.display = 'block';
        botToggle.innerHTML = 'Cerrar Chat';
        this.innerHTML = '<span></span>';
    } else {
        botChat.style.display = 'none';
        botToggle.innerHTML = 'Asistente de Salud en Medismart.live';
        this.innerHTML = '<span>X</span>';
    }
});
async function sendMessage() {
       
    var userMessage = userInput.value;
    if (userMessage !== '') {
        botMessages.innerHTML += '<div class="cont-globo" style="justify-content: end;"><p class="globo globo-paciente">' + userMessage + '</p></div>';
        scrollToBottom(); 
        userInput.value = '';

      
        scrollToBottom();

        writingIndicator.style.display = 'block';

        var messageResponse = await getResponseChatBot(userMessage);
        var validacionMessage = messageResponse.hasOwnProperty("suggestAppointment") ? messageResponse.suggestAppointment : false;
        showMenuOptions();

        writingIndicator.style.display = 'none';
        await typeWriterEffect(messageResponse.response);

        scrollToBottom(); 

        await new Promise(resolve => setTimeout(resolve, 3500));
    }
}



async function responseMessage(message, validationChat){
    scrollPrevious = contenedor.scrollHeight - contenedor.scrollTop;
    botMessages.innerHTML += '<div class="cont-globo"><div class="avatar"><img src="/img/chatgpt/asistente.png" alt="Asistente Salud"></div><p class="globo globo-asistente">'+ message +'</p></div>';
    if (validationChat){
        showMenuOptions()
    }
    scrollFunct();
}


async function showMenuOptions() {
    scrollPrevious = contenedor.scrollHeight - contenedor.scrollTop;
    var options = ['Agendar'];
    var optionsHtml = '<div class="cont-globo"><div class="avatar"><img src="/img/chatgpt/asistente.png" alt="Asistente Salud"></div><p class="globo globo-asistente">Esta informacion te puede servir. Haz clic en alguna de ellas:</p></div><ul class="list-options">';
    options.forEach(function(option) {
      optionsHtml += '<li class="option-list"><a onclick="sendMenuOption(\'' + option + '\')">' + option + '</a></li>';
    });
    optionsHtml +='</ul>';
    botMessages.innerHTML += optionsHtml;
    userInput.value = '';
    scrollFunct();
  }
  
async function sendMenuOption(option) {
    scrollPrevious = contenedor.scrollHeight - contenedor.scrollTop;
    botMessages.innerHTML += '<div class="cont-globo" style="justify-content: end;"><p class="globo globo-paciente">'+ option +'</p></div>';
    //var messageResponse = await getResponseChatBot(userMessage);
    //responseMessage(messageResponse.Response)
    // Aquí puedes agregar la lógica para manejar la opción seleccionada del menú
    if (option === 'Agendar') {
        location.href = location.origin + "/Paciente/Agendar"
    }
    scrollFunct();
    
}
  
async function getResponseChatBot(message) {
    try {
        let response = await fetch(`${uriConci}/getMessageGPT?id=${window.chatGptId}&message=${message}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

async function scrollFunct(){
    contenedor.scrollTop = contenedor.scrollHeight - scrollPrevious;
}

function scrollToBottom() {
    contenedor.scrollTop = contenedor.scrollHeight;
}

async function responseMessage(message, validationChat) {
    if (validationChat) {
        showMenuOptions();
    }
    await typeWriterEffect(message);
    scrollToBottom()
}

async function typeWriterEffect(message) {
    const delay = 50;
    const responseElement = document.createElement('div');
    responseElement.className = 'cont-globo';
    responseElement.innerHTML = '<div class="avatar"><img src="/img/chatgpt/asistente.png" alt="Asistente Salud"></div><p class="globo globo-asistente"></p>';
    botMessages.appendChild(responseElement);

    const textElement = responseElement.querySelector('.globo-asistente');
    const parser = new DOMParser();
    const decodedMessage = parser.parseFromString(`<!doctype html><body>${message}`, 'text/html').body.textContent;

    for (let i = 0; i < decodedMessage.length; i++) {
        await new Promise(resolve => setTimeout(resolve, delay));
        textElement.innerHTML += decodedMessage[i];
        scrollToBottom(); 
    }

    scrollToBottom();
}


