"use client"

import React, { useState } from 'react'
import './login.scss'
import { registerUser, loginUser } from '@/lib/actions/admin'

import AdminLogin from './adminLogin/AdminLogin'
import EmployeeLogin from './employeeLogin/EmployeeLogin'

const Login = () => {

	return (
		<div className="signin-signup">
			<div className='wrapper'>
				<AdminLogin />
				<EmployeeLogin />
			</div>
		</div>
	)
}

export default Login