import { randomBytes } from "crypto"

export default function signup_handler(email: string, username: string, password: string) {
    let status;
    
    fetch(`${process.env.BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json'},
        credentials: "include",
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            salt: randomBytes(8).toString('hex')
        }),
    })
    .then((res) => {
        status = res.status;
    })
    .catch((err) => {
        throw err;
    });

    return status;
}