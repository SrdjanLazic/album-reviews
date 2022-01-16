const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];


function init() {

    fetch('http://localhost:8082/admin/users', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then( res => res.json() )
        .then( data => {

            const tableBody = document.getElementById('users');
            const dropDown = document.getElementById('users-dropdown');

            data.forEach(user => {
                tableBody.innerHTML += 
                `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.role}</td>
                </tr>
                `
            });

            data.forEach(user => {
                dropDown.innerHTML += `<option value="${user.id}">${user.id} --- ${user.role}</option>`
            })
        });

    document.getElementById("delete-user-button").addEventListener("click", e => {

        e.preventDefault();

        const data = {
            id: document.getElementById('users-dropdown').value
        };
        
        fetch('http://localhost:8082/admin/user/' + data.id, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data) 
        })
            .then( res => res.json() )
            .then( data => {
                if(data.msg){
                    alert(data.msg);
                } else {
                    window.location.reload();
                }
            });
    })
    document.getElementById("change-user-password-button").addEventListener("click", e => {

        e.preventDefault();

        const data = {
            password: document.getElementById("user-new-password").value,
            id: document.getElementById('users-dropdown').value
        }

        document.getElementById("user-new-password").value = "";

        fetch('http://localhost:8082/admin/user/' + data.id, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data) 
        })
            .then( res => res.json() )
            .then( data => {
                if(data.msg){
                    alert(data.msg);
                } else {
                    window.location.reload();
                }
            });
    })
}