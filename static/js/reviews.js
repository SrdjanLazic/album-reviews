const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];

function init() {

    fetch('http://localhost:8080/admin/albums', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then( res => res.json() )
        .then( data => {

            const albumsDropdown = document.getElementsByClassName('albums-dropdown');

            data.forEach(album => {
                albumsDropdown[0].innerHTML += `<option value="${album.id}">${album.artist.name} - ${album.title}</option>`
            })
        });

    fetch('http://localhost:8080/admin/reviews', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(data => {
            const reviewList = document.getElementById("reviews");
            const reviewDropdown = document.getElementById("reviews-dropdown");

            data.forEach(review => {
                reviewList.innerHTML +=
                `
                <div class="container" id="${review.id}">
                    <h3>${review.album.artist.name} - ${review.album.title}</h3>
                    <p>${review.body}</p>
                    <p>Rating: ${review.rating}</p>
                    <button type="submit" class="delete-review-button">Delete review</button>  
                </div>
                `
            });
            addDeleteButtons();
        });


    document.getElementById("add-review").addEventListener("click", e => {

        e.preventDefault();

        let albumRating = 0
        const reviewList = document.getElementById("reviews");

        ratings = document.getElementsByName("rating");
        for(let i = 0; i < ratings.length; i++){
            if(ratings[i].checked){
                albumRating = ratings[i].value;
            }
        }

        const data = {
            body: document.getElementById("album-review").value,
            rating: albumRating,
            albumId: document.getElementsByClassName("albums-dropdown")[0].value,
        }

        let album = document.getElementsByClassName("albums-dropdown")[0];
        let albumArtistTitle = album.options[album.selectedIndex].innerHTML;


        fetch('http://localhost:8080/admin/reviews', {
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
                    reviewList.innerHTML += 
                    `
                    <div class="container">
                        <h3>${albumArtistTitle}</h3>
                        <p>${data.body}</p>
                        <p>Rating: ${data.rating}</p>  
                        <button type="submit" class="delete-review-button">Delete review</button>  
                    </div>
                `
                }
            });

    });
}

function addDeleteButtons() {
    const buttons = document.getElementsByClassName("delete-review-button");
    for(let i = 0; i < buttons.length; i++){
        buttons[i].addEventListener("click", e => {

            const data = {
                id: buttons[i].parentNode.id
            };

            fetch('http://localhost:8080/admin/reviews/' + data.id, {
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
                }
            });
        })
    }
}