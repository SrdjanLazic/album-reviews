function init() {

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    fetch('http://localhost:8082/admin/albums', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(data => {

            // dohvati sve elemente sa klasom albums-dropdown (ima ih 2 na stranici)
            const albumsDropdowns = document.getElementsByClassName('albums-dropdown');
            const tableBody = document.getElementById('albums');

            // svakom dropdown-u za albume dodaj sve albume
            data.forEach(album => {
                for(let i = 0; i < albumsDropdowns.length; i++){
                    albumsDropdowns[i].innerHTML += `<option value="${album.id}">${album.artist.name} - ${album.title}</option>`
                }

                tableBody.innerHTML += 
                    `
                    <tr data-id="${album.id}">
                        <td>${album.artist.name}</td>
                        <td>${album.title}</td>
                        <td>${album.genre}</td>
                        <td>${album.year}</td>
                    </tr>
                    `;
            })
        });

    fetch('http://localhost:8082/admin/artists', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then( res => res.json() )
        .then( data => {

            const artistsDropDown = document.getElementById('artists-dropdown');
            const yearDropDowns = document.getElementsByClassName('year-dropdown');

            data.forEach(artist => {
                artistsDropDown.innerHTML += `<option value="${artist.id}">${artist.name}</option>`
            })            

        });

    
    document.getElementById("add-new-album-button").addEventListener("click", e => {

        e.preventDefault();

        const tableBody = document.getElementById('albums');

        const data = {
            year: document.getElementById('year-picker-create').value,
            genre: document.getElementById('album-genre').value,
            title: document.getElementById("album-title").value,
            artistId: document.getElementById("artists-dropdown").value,
        }

        let artist = document.getElementById("artists-dropdown");
        let artistName = artist.options[artist.selectedIndex].innerHTML;

        // Provera da li je neko polje prazno:
        let error = false;
        for(el in data){
            if(data[el] == "") {
                error = true;
            }
        }

        if(error){
            alert("In order to create a new album, you have to fill in all the fields first.")
            return;
        }

        fetch('http://localhost:8082/admin/albums', {
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
                    <tr data-id="${data.id}">
                    <td>${artistName}</td>
                    <td>${data.title}</td>
                    <td>${data.genre}</td>
                    <td>${data.year}</td></tr>
                    `;
                }
            });
    });

    document.getElementById("edit-album-button").addEventListener("click", e => {

        e.preventDefault(); 

        const data = {
            id: document.getElementsByClassName('albums-dropdown')[0].value,
            title: document.getElementById("album-new-title").value,
            genre: document.getElementById("album-new-genre").value,
            year: document.getElementById("year-picker-update").value
        }

        document.getElementById("album-new-title").value = "";
        document.getElementById("album-new-genre").value = ""

        //Provera da li je neko polje prazno:
        let error = false;
        for(el in data){
            if(data[el] == "") {
                error = true;
            }
        }

        if(error){
            alert("In order to edit an album, you have to fill in all the fields first.")
            return;
        }


        fetch('http://localhost:8082/admin/album/' + data.id, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data) 
        })
            .then( res => res.json() )
            .then( data => {
                // potrazi kako se koristi data atribut
                if(data.msg){
                    alert(data.msg);
                } else {
                    window.location.reload();
                }
            });
    });

    document.getElementById("delete-album-button").addEventListener("click", e => {

        e.preventDefault(); 

        const data = {
            id: document.getElementsByClassName('albums-dropdown')[1].value,
        }

        fetch('http://localhost:8082/admin/album/' + data.id, {
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
    });

    
}