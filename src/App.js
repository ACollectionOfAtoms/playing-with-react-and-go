import React, { Component } from 'react';
import MD5 from "crypto-js/md5";
import emojione from 'emojione';
import * as $ from "jquery"; // 🤢
import Materialize from "materialize-css";
import ChatContent from './ChatContent';
import Login from './Login';
import ChatInput from './ChatInput';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.ws = null;
    this.state = {
      newMsg: '', // Holds new messages to be sent to the server
      chatContent: '', // A running list of chat messages displayed on the screen
      email: '', // Email address used for grabbing avatar
      username: '', // Our username
      joined: false, // True if email and username have been filled in
    }
  }

  componentWillMount() {
    this.ws = new WebSocket('ws://localhost:8000/ws');
    this.ws.addEventListener('message', e => {
      let msg = JSON.parse(e.data);
      this.setState(prevState => {
        return {
          chatContent: prevState.chatContent + `
            <div class="chip">
              <img src="${this.gravatarURL(msg.email)}">
              ${msg.username}
            </div>
            ${emojione.toImage(msg.message)} <br/>
          `,
        }
      });
      const el = document.getElementById('chat-message')
      el.scrollTop = el.scrollHeight; // auto scroll to bottom
    })
  }

  send() {
    if (this.state.newMsg !== '') {
      this.ws.send(
        JSON.stringify({
          email: this.state.email,
          username: this.state.username,
          message: $('<p>').html(this.state.newMsg).text(), // strip out html
        })
      );
      // reset newMsg
      this.setState({
        newMsg: '',
      });
    }
  }

  join() {
    if (!this.state.email) {
      Materialize.toast('You must enter an email', 2000);
      return;
    }
    if (!this.state.username) {
      Materialize.toast('You must choose a username', 2000);
      return;
    }
    this.setState(prevState => {
      return {
        email: $('<p>').html(prevState.email).text(),
        username: $('<p>').html(prevState.username).text(),
        joined: true,
      }
    });
  }

  gravatarURL(email) {
    return `http://www.gravatar.com/avatar/${MD5(email)}`
  }

  updateEmail(e) {
    this.setState({
      email: e.target.value,
    })
  }

  updateUsername(e) {
    this.setState({
      username: e.target.value,
    })
  }

  updateMsg(e) {
    this.setState({
      newMsg: e.target.value,
    })
  }

  render() {
    let userInput;
    if (this.state.joined) {
      userInput = <ChatInput 
                    sendMessage={() => this.send()}
                    updateMsg={e => this.updateMsg(e)}/>
    } else {
      userInput = <Login
                    updateEmail={e => this.updateEmail(e)}
                    updateUsername={e => this.updateUsername(e)}
                    handleLogin={() => this.join()}
                    username={this.state.username} 
                    email={this.state.email}/>
    }
    return (
      <div>
        <header>
          <nav className="nav-wrapper">
            <a href="/" className="brand-logo right">
              Super Rad Chat App
            </a>
          </nav>
        </header>
        <main id="app">
          <ChatContent 
            html={this.state.chatContent}
          />
          {userInput}
        </main>
        <footer className="page-footer">
        </footer>
      </div>
    );
  }
}

export default App;
