import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginInProgress, setLoginInProgress] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [icon, setIcon] = useState(eyeOff);
    async function handleFormSubmit(ev) {
        ev.preventDefault();
        setLoginInProgress(true);
        await signIn('credentials', { email, password, callbackUrl: '/', });
        setLoginInProgress(false);
    }
    function handleToggle() {
        setShowPassword((prev) => !prev)
        if (icon === eyeOff) {
            setIcon(eye);
        } else {
            setIcon(eyeOff);
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
                            Đăng nhập
                        </h1>
                        <form className="max-w-xs mx-auto" onSubmit={handleFormSubmit}>
                            <label>Email</label>
                            <input type="email" name="email" placeholder="email" value={email}
                                disabled={loginInProgress} required
                                onChange={ev => setEmail(ev.target.value)} />
                            <label>Password</label>
                            <div className="flex">
                                <input type={showPassword ? 'text' : 'password'} name="password" placeholder="mật khẩu" value={password}
                                    disabled={loginInProgress} required
                                    onChange={ev => setPassword(ev.target.value)} />
                                <span class="flex justify-around items-center mb-2" onClick={handleToggle}>
                                    <Icon class="absolute mr-10" icon={icon} size={20} />
                                </span>
                            </div>

                            <button disabled={loginInProgress} type="submit" className="border border-gray-300 rounded-md px-6 py-2 w-full">Đăng nhập</button>


                            <div className="my-4 text-center text-gray-500">
                                Hoặc tiếp tục bằng
                            </div>
                            <button type="button" onClick={() => signIn('google', { callbackUrl: '/' })}
                                className="flex gap-4 justify-center border border-gray-300 rounded-md px-6 py-2 w-full">
                                <Image src={'/google.png'} alt={''} width={24} height={24} />
                                Login with Google
                            </button>
                            <div className="text-center my-4 text-gray-500 border-t pt-4">
                                Tạo tài khoản mới?{' '}
                                <Link className="underline" href={'/register'}>Đăng ký &raquo;</Link>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>

    );
}