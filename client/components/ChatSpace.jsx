import React from 'react';
import Message from './Message.jsx';
import io from 'socket.io-client';

class ChatSpace extends React.Component {
  constructor(props) {
    super(props);
    const socket = io();

    this.state = {
      message: "",
      messages: [
        { className: "other", text: "Oh my god I love this part!" },
        { className: "me", text: "HAHAHA" },
      ],
      socket,
    };

    socket.on('chat message', (msg) => {
      console.log('Recieved message from server: ', msg);
      this.setState({
        messages: this.state.messages.concat({ className: "other", text: msg }),
      });
    });

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    console.log(event.target.value);
    this.setState({
      message: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    console.log(this.state.message);
    this.state.socket.emit('chat message', this.state.message);
    this.setState({
      messages: this.state.messages.concat({ className: 'me', text: this.state.message }),
      message: '',
    });
  }

  render() {
    return (
      <div className="chat-space">
        <div className="chat-container">
          <ul>
            {this.state.messages.map((message) => <Message message={message} />)}
          </ul>
        </div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" id="m" value={this.state.message} autoComplete="off" onChange={this.handleChange} placeholder="Send a message..." />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default ChatSpace;
