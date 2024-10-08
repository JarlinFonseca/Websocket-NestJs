import { Manager, Socket } from "socket.io-client"

let socket: Socket;

export const connectToServer = (token: string) => {

    const manager = new Manager("localhost:3000/socket.io/socket.io.js", {
        extraHeaders: {
           hola: 'mundo',
           authentication: token,
        }
    });

    socket?.removeAllListeners();
    socket = manager.socket('/');
  

    console.log({ socket})
    addListeners();
}

const addListeners = () => {
    const clientsUl = document.querySelector<HTMLUListElement>('#clients-ul')!;
    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
    const messageUl = document.querySelector<HTMLUListElement>('#message-ul')!;
    const serverStatusLabel = document.querySelector<HTMLSpanElement>('#server-status')!;

    socket.on('connect', () => {
        console.log('connected');
        serverStatusLabel.innerText = 'connected';
        serverStatusLabel.style.color = 'green';
    });

    socket.on('disconnect', () => {
        console.log('disconnected');
        serverStatusLabel.innerText = 'disconnected';
        serverStatusLabel.style.color = 'red';
    });

    socket.on('clients_updated', (clients: string[]) => {
       let clientsHtml = '';
         clients.forEach(clientId => {
              clientsHtml += `<li>${clientId}</li>`;
         });
        clientsUl.innerHTML = clientsHtml;

    });

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (messageInput.value.trim().length <= 0) return;

        socket.emit('message-from-client', { 
            id: 'YO!!', 
            message: messageInput.value 
        });

        messageInput.value = '';
    });

    socket.on('message-from-server', (payload: { fullName: string, message: string}) => {
        console.log({ payload });
        console.log(payload);
        const newMessage = `
        <li>
            <strong>${payload.fullName}</strong>
            <span>${payload.message}</span>
        </li>`;

        const li = document.createElement('li');
        li.innerHTML = newMessage;
        messageUl.appendChild(li);
    });

}