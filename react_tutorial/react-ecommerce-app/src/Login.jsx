import React, { Component } from "react";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "", message: "" };
  }
  render() {
    return (
      <div className="col-lg-9">
        <h4 className="m-1 p-2 border-bottom">Login</h4>

        {/* email starts */}
        <div className="form-group form-row">
          <label className="col-lg-4">Email:</label>
          <input
            type="text"
            className="form-control"
            value={this.state.email}
            onChange={(event) => {
              this.setState({ email: event.target.value });
            }}
          />
        </div>
        {/* email ends */}

        {/* password starts */}
        <div className="form-group form-row">
          <label className="col-lg-4">Password :</label>
          <input
            type="text"
            className="form-control"
            value={this.state.password}
            onChange={(event) => {
              this.setState({ password: event.target.value });
            }}
          />
        </div>
        {/* password ends */}

        <div className="text-end">
          {this.state.message}
          <button className="btn btn-primary" onClick={this.onLoginClick}>
            Login
          </button>
        </div>
      </div>
    );
  }

  //   Executes when user login
  onLoginClick = async () => {
    var response = await fetch(
      `http://localhost:5000/users?email=${this.state.email}&password=${this.state.password}`,
      { method: "GET" }
    );
    console.log(response);
    var body = await response.json();

    if (body.length > 0) {
      this.setState({
        message: <span className="text-success">Successfully Logged-in</span>,
      });
    } else {
      this.setState({
        message: (
          <span className="text-danger">Inalid login, please try again.</span>
        ),
      });
    }
  };
}
