import React, {PropTypes} from 'react';

import Auth from '../Auth/Auth';
import LoginForm from './LoginForm';

class LoginPage extends React.Component {
    constructor(props, context) {
        super(props);
        // set the initial component state
        this.state = {
            errors: {},
            user: {
                email: '',
                password: ''
            }
        };
    }
    // pre submission
    processForm(event) {
        event.preventDefault();

        const email = this.state.user.email;
        const password = this.state.user.password;
        const url = "http://" + window.location.hostname + ":3000" + "/auth/login";
        fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(response => {
            if (response.status === 200){
                this.setState({
                    errors: {}
                });

                response.json().then(function(json){
                    Auth.authenticateUser(json.token, email);
                    this.context.router.replace('/');
                }.bind(this));
            }else{
                console.log('Login failed');
                response.json().then( function (json) {
                    const errors = json.errors ? json.errors : {};
                    errors.summary = json.message;
                    this.setState({errors});
                }.bind(this));
            }
        })
    }

    changeUser(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;

        this.setState({ user });
    }

    render() {
        return (
            <LoginForm 
                onSubmit={this.processForm.bind(this)}
                onChange={this.changeUser.bind(this)}
                errors={this.state.errors}
                user={this.state.user}
            />
        );
    }
}

//make router works
LoginPage.contextTypes = {
    router: PropTypes.object.isRequired
}

export default LoginPage;