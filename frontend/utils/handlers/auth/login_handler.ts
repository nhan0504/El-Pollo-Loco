
export default function login_handler(username: string, password: string) {
    let status;

    fetch(`${process.env.BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({
            username: username,
            password: password,
        })
    })
    .then((res) => {
        status = res.status;
    })
    .catch((err) => {
        throw err
    });

    return status;
}