import React, { Component } from 'react';

class Login extends Component {
  render() {
    return (
      <div className="row">
        <div className="input-field col s8">
          <input onChange={e => this.props.updateEmail(e)} value={this.props.email} type="email" placeholder="Email"/>
        </div>
        <div className="input-field col s8">
          <input onChange={e => this.props.updateUsername(e)} value={this.props.username} type="text" placeholder="Username"/>
        </div>
        <div className="input-field col s4">
          <button 
            onClick={this.props.handleLogin}
            className="waves-effect waves-light btn">
            <i className="material-icons right">done</i>
            Join
          </button>
        </div>
      </div>
    );
  }
}

export default Login; 

