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
function addMessage (type, user, msg) {
    let ul = document.querySelector('.chatList');

    switch(type) {
        case 'status':
            ul.innerHTML += '<li class="m-status">'+msg+'</li>'
        break;
        case 'msg':
            if(username == user) {
                ul.innerHTML += '<li class="m-txt"><span class="me">'+user+': </span>'+msg+'</li>'
            } else { 
                ul.innerHTML += '<li class="m-txt"><span>'+user+': </span>'+msg+'</li>'
            }
            
        break;
    }
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

textInput.addEventListener('keyup', (e) => {
   if(e.keyCode ===13) {
       let txt = textInput.value.trim();
       textInput.value = '';
       if(txt != '') {
           socket.emit('send-msg', txt);
       }
   } 
});

//Listando Usuários
socket.on('user-ok', (list)=> {
    loginPage.style.display = 'none';
    chatPage.style.display = 'flex';
    textInput.focus();

    addMessage('status', null, 'Conectado!');

    userList = list;
    renderUserList();
});

socket.on('list-update', (data) => {
    if(data.joined) {
        addMessage('status', null, data.joined+' joined the chat.')
    }
    if(data.left) {
        addMessage('status', null, data.left+' left the chat.')
    }

    userList = data.list;
    renderUserList();
});

socket.on('show-msg', (data) => {
    addMessage('msg', data.username, data.message);
});

socket.on('disconnect', () => {
    addMessage('status', null, 'Você foi desconectado!');
    userList = [];
    renderUserList();
});
socket.on('connect_error', () => {  
    setTimeout(() => {
        addMessage('status', null, 'Tentando reconectar...');
    }, 2000)  
    
});

socket.on('reconnect', () => {
    addMessage('status', null, 'Reconectado')
    if(username != ''){
      socket.emit('join-request', username)
    }
  })

