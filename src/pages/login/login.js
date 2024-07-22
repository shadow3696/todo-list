import React from 'react'
import Login from '../../components/login/Login'

const login = ({logout, login}) => {
  return (
    <div>
      <Login login={ login } logout={logout } />
    </div>
  )
}

export default login
