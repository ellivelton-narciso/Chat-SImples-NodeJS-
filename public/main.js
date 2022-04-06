const socket = io();
let username = '';
let userList = [];

//"Facilitadores"
let loginPage = document.querySelector('#loginPage');
let chatPage = document.querySelector('#chatPage');

let loginInput = document.querySelector('#loginNameInput');
let textInput = document.querySelector('#chatTextInput');

//Estabelecendo estilos padrões
loginPage.style.display = 'flex';
chatPage.style.display = 'none';

//Funções
function renderUserList() {
    let ul = document.querySelector('.userList');
    ul.innerHTML = '';
    userList.forEach(i => {
        ul.innerHTML += '<li>'+i+'</li>'
    });
}


//Entrando no Chat
loginInput.addEventListener('keyup', (e) =>{
    if(e.keyCode === 13) {
        let name = loginInput.value.trim();
        if(name != '') {
            username = name;
            document.title = 'Chat ('+username+')';

            socket.emit('join-request', username);
        }
    }
});

socket.on('user-ok', (list)=> {
    loginPage.style.display = 'none';
    chatPage.style.display = 'flex';
    textInput.focus();

    userList = list;
    renderUserList();
});