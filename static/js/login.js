function init() {

    document.getElementById('login-button').addEventListener('click', e => {
        e.preventDefault();

        const data = {
            email: document.getElementById('email-input').value,
            password: document.getElementById('password-input').value
        };

        fetch('http://127.0.0.1:8081/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then( res => res.json() )
            .then( el => {
                if (el.msg) {
                    alert(el.msg);
                } else {
                    document.cookie = `token=${el.token};SameSite=Lax`;
                    window.location.href = 'index.html';
                }
            })
    });
}