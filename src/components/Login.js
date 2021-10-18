import React, {Component, Fragment} from 'react';
import Alert from './ui-components/Alert';
import Input from './form-component/Input';
export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            error: null,
            errors: [],
            alert: {
                alertType: "d-none",
                alertMessage: ""
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
   
    handleChange = (evt) => {
        let value = evt.target.value;
        let name = evt.target.name;
        this.setState((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }
    handleSubmit = (evt) => {
        evt.preventDefault();
        let errors = [];
        if (this.state.email === "") {
            errors.push("email")
        }
        if (this.state.password === "") {
            errors.push("password");
        }
        this.setState({errors: errors});
        if (errors.length > 0) {
            return false;
        }
        const data = new FormData(evt.target);
        const payload = Object.fromEntries(data.entries());
        const requestOptions = {
            method: "POST",
            body: JSON.stringify(payload)
        }
        fetch("http://localhost:4000/v1/signin", requestOptions)
            .then(response => response.json())
            .then((data) => {
                if (data.error) {
                    this.setState({
                        alert: {
                            alertType: "alert-danger",
                            alertMessage: data.error.message
                        } 
                    })
                } else {
                    this.handleJWTChange(Object.values(data)[0])
                    window.localStorage.setItem("jwt", JSON.stringify(Object.values(data)[0]));
                    this.props.history.push({
                        pathname:"/admin"
                    })
                }
            })

    }
    handleJWTChange(jwt) {
        this.props.handleJWTChange(jwt)
    }
    hasError(key) {
        return this.state.errors.indexOf(key) !== -1
    }

    render() {
        return (
           <Fragment>
               <h2>Login</h2>
               <hr/>
               <Alert
                alertType={this.state.alert.alertType}
                alertMessage={this.state.alert.alertMessage}
               />
               <form className="pt-3" onSubmit={this.handleSubmit}>
                    <Input
                        title={"Email"}
                        type={"email"}
                        name={"email"}
                        handleChange={this.handleChange}
                        className={this.hasError("email") ? "is-invalid" : ""}
                        errorDiv={this.hasError("email") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a valid email address"}
                    />
                    <Input
                        title={"Password"}
                        type={"password"}
                        name={"password"}
                        handleChange={this.handleChange}
                        className={this.hasError("password") ? "is-invalid" : ""}
                        errorDiv={this.hasError("password") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a password"}
                    />
                    <hr/>
                    <button className="btn btn-primary">Login</button>
               </form>
           </Fragment>
        )
    }
}