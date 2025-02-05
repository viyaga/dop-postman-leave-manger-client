"use client"

import './register.scss'
import AdminRegister from './adminRegister/AdminRegister'
import EmployeeRegister from './employeeRegister/EmployeeRegister'

const Register = () => {

	return (
		<div className="signin-signup">
			<div className='wrapper'>
				<AdminRegister />
				<EmployeeRegister />
			</div>
		</div>
	)
}

export default Register