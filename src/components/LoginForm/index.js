// Write your JS code here
import {Component} from 'react'
import Cookies from 'js-cookie'

import './index.css'
import {Redirect} from 'react-router-dom'

class LoginForm extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  OnSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const UserDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(UserDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.OnSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div>
        <form onSubmit={this.submitForm}>
          <label htmlFor="username">username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={this.onChangeUsername}
          />

          <label htmlFor="password">password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={this.onChangePassword}
          />
          <button type="submit">Login</button>
        </form>
        {showSubmitError && <p>{errorMsg}</p>}
      </div>
    )
  }
}

export default LoginForm
