import './style.css'
import { connectToServer } from './socket-client.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
  <h2>Websocket - Client!</h2>
  <input id="jwt-token" placeholder="Json Web Token" />
  <button id="btn-connect">Connect</button>

  <br/>


  <span id="server-status">offline</span>

  <ul id="clients-ul">
   <li>Client 1</li>
  </ul>

  <form id="message-form">
  <input placeholder="message" id="message-input" />
  </form>  

  <h3>Messages</h3>
  <ul id="message-ul"></ul>

  </div>
`

const jwtToken = document.querySelector<HTMLInputElement>('#jwt-token')!;
const btnConnect = document.querySelector<HTMLButtonElement>('#btn-connect')!;

btnConnect.addEventListener('click', () => {
  if (jwtToken.value.trim().length <= 0) return alert('Enter a valid JWT Token');
  connectToServer(jwtToken.value.trim());
})
//connectToServer();
//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
