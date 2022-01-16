const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];

function init() {

    fetch('http://localhost:8082/admin/albums', {
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

    fetch('http://localhost:8082/admin/reviews', {
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
                    <button type="submit" class="edit-review-button">Edit review</button>
                </div>
                `
            });
            addDeleteButtons();
            addEditButtons();
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


        fetch('http://localhost:8082/admin/reviews', {
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
                        <button type="submit" class="edit-review-button">Edit review</button>
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

            fetch('http://localhost:8082/admin/reviews/' + data.id, {
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
                    location.reload();
                }
            });
        })
    }
}

function addEditButtons() {
    let edit = 0
    const buttons = document.getElementsByClassName("edit-review-button");
    for(let i = 0; i < buttons.length; i++){
        buttons[i].addEventListener("click", e => {
            e.preventDefault();

            if(edit == 0){
                buttons[i].parentElement.children[1].innerHTML = `<textarea id="album-edit" name="reviews" rows="4" cols="32" placeholder="Write your review here..."></textarea>`
                buttons[i].parentElement.children[2].innerHTML = `Rating: <input type="number" min="1" max="5" step="1" placeholder="Rate" required id="edit-rating"/>`
                buttons[i].innerHTML = "Save changes"
                edit = 1;
            }
            else {

                const data = {
                    id: buttons[i].parentElement.id,
                    body: document.getElementById("album-edit").value,
                    rating: document.getElementById("edit-rating").value
                }
        
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
        
        
                fetch('http://localhost:8082/admin/review/' + data.id, {
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
                            location.reload();
                        } else {
                            location.reload();
                        }
                    });
            }
        })
    };
}