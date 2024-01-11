import axios from "axios";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Icon from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [creatingUser, setCreatingUser] = useState(false);
    const [userCreated, setUserCreated] = useState(false);
    const [error, setError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [icon, setIcon] = useState(eyeOff);
    async function handleFormSubmit(ev) {
        ev.preventDefault();
        setCreatingUser(true);
        setError(false);
        setUserCreated(false);
        const response = await axios.post('/api/register', { email, password });
        const res = await axios.post('/api/profile', { email, password });
        if (response.data === 'ok' && res.data === 'ok') {
            setUserCreated(true);
        }
        else {
            setError(true);
        }
        setCreatingUser(false);
    }
    function handleToggle() {
        setShowPassword(!showPassword);
        if (showPassword) {
            setIcon(eyeOff);
        }
        else {
            setIcon(eye);
        }
    }
    return (
        <div className="flex justify-center items-center mt-12">
            <div className="w-1/2 md:w-1/3">
                <div className="bg-white rounded-lg shadow-lg my-4 p-5">
                    <Link href={'/'}>
                        <img src={'/logo-red.svg'} alt={''} className="w-1/2 mx-auto" />
                    </Link>
                    <section className="mt-6">
                        <h1 className="text-center text-primary text-4xl mb-4">
                            Đăng ký
                        </h1>
                        {userCreated && (
                            <div className="my-4 text-center">
                                User created.<br />
                                Now you can{' '}
                                <Link className="underline" href={'/login'}>Login &raquo;</Link>
                            </div>
                        )}
                        {error && (
                            <div className="my-4 text-center">
                                An error has occurred.<br />
                                Please try again later
                            </div>
                        )}
                        <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>
                            <label>Email</label>
                            <input type="email" placeholder="email" value={email}
                                disabled={creatingUser}
                                onChange={ev => setEmail(ev.target.value)} required />
                            <label>Password</label>
                            <div className="flex">
                                <input type={showPassword ? 'text' : 'password'} placeholder="mật khẩu" value={password} required
                                    disabled={creatingUser} minLength={8}
                                    onChange={ev => setPassword(ev.target.value)} pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$" title="Minimum eight characters, at least one letter, one number and one special character" />
                                <span class="flex justify-around items-center mb-2" onClick={handleToggle}>
                                    <Icon class="absolute mr-10" icon={icon} size={20} />
                                </span>
                            </div>

                            <button type="submit" disabled={creatingUser} className="border border-gray-300 rounded-md px-6 py-2 w-full">
                                Đăng ký
                            </button>
                            <div className="my-4 text-center text-gray-500">
                                Hoặc tiếp tục bằng
                            </div>
                            <button
                                onClick={() => signIn('google', { callbackUrl: '/' })}
                                className="flex gap-4 justify-center border border-gray-300 rounded-md px-6 py-2 w-full">
                                <Image src={'/google.png'} alt={''} width={24} height={24} />
                                Login with Google
                            </button>
                            <div className="text-center my-4 text-gray-500 border-t pt-4">
                                Đã có tài khoản?{' '}
                                <Link className="underline" href={'/login'}>Đăng nhập &raquo;</Link>
                            </div>
                        </form>
                    </section>
                </div>
            </div >
        </div>
    );
}

