const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];

function init() {

    

    fetch('http://localhost:8082/admin/artists', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then( res => res.json() )
        .then( data => {

            const tableBody = document.getElementById('artists');
            const dropDown = document.getElementById('artists-dropdown');

            data.forEach(artist => {
                tableBody.innerHTML += 
                `
                <tr>
                    <td>${artist.name}</td>
                </tr>
                `
            });

            data.forEach(artist => {
                dropDown.innerHTML += `<option value="${artist.id}">${artist.name}</option>`
            })
        });

    document.getElementById("new-artist-button").addEventListener("click", e => {

        e.preventDefault();

        const tableBody = document.getElementById('artists');

        const data = {
            name: document.getElementById("artist-name").value
        };

        document.getElementById("artist-name").value = "";

        fetch('http://localhost:8082/admin/artists', {
            method: 'POST',
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
                }
                else {
                    tableBody.innerHTML += 
                    `
                    <tr>
                        <td>${data.name}</td>
                    </tr>
                    `;
                }
                
            });
    })

    document.getElementById("delete-artist-button").addEventListener("click", e => {

        e.preventDefault();

        const data = {
            id: document.getElementById('artists-dropdown').value
        };
        
        fetch('http://localhost:8082/admin/artist/' + data.id, {
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



    document.getElementById("rename-artist-button").addEventListener("click", e => {

        e.preventDefault();

        const data = {
            id: document.getElementById('artists-dropdown').value,
            name: document.getElementById("artist-new-name").value
        }

        document.getElementById("artist-new-name").value = "";

        fetch('http://localhost:8082/admin/artist/' + data.id, {
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