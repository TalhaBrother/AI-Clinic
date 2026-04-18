import * as yup from 'yup'
import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'

const loginSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().min(6).required()
})

const Login = () => {
    const navigate = useNavigate()
    const [isPending, setIsPending] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState(null)

    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema),
        mode: 'onChange',
    })

    const submitLogin = async (data) => {
        try {
            setIsPending(true)
            setIsError(false)
            const response = await axios.post('http://localhost:3000/auth/login', data)
            console.log(response.data)
            localStorage.setItem('token', response.data.token);

        // 2. Save the user object (we must use JSON.stringify because localStorage only stores strings)
        localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard')
        } catch (err) {
            setIsError(true)
            setError(err)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>

                <form onSubmit={handleSubmit(submitLogin)} className="flex flex-col gap-4">

                    {/* Username */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 self-start">Username</label>
                        <input
                            {...register("username")}
                            placeholder="Enter your username"
                            className={`border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition
                            ${errors.username ? 'border-red-500 focus:ring-red-400' : 'border-gray-300'}`}
                        />
                        {errors.username && (
                            <p className="text-red-500 text-xs mt-1">⚠ {errors.username.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 self-start">Password</label>
                        <input
                            type="password"
                            {...register("password")}
                            placeholder="Enter your password"
                            className={`border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition
                            ${errors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-300'}`}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">⚠ {errors.password.message}</p>
                        )}
                    </div>

                    {/* API Error */}
                    {isError && (
                        <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-4 py-2 rounded-lg">
                            ⚠ {error?.response?.data || 'Login failed. Try again.'}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 rounded-lg transition mt-2"
                    >
                        {isPending ? 'Logging in...' : 'Login'}
                    </button>

                    <p className="text-sm text-center text-gray-500">
                        Don't have an account?{' '}
                        <a href="/register" className="text-blue-600 hover:underline font-medium">Register</a>
                    </p>

                </form>
            </div>
        </div>
    )
}

export default Login