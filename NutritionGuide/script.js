var myHeaders = new Headers();
myHeaders.append("x-api-key", "c0245e4b-0a6d-49a8-b740-a3205b33aeb7");

var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};

var data = '';
var breeds = [];
var doggy = {
    "normal": {
        "type": 'Sensitive',
        "level": 1.8
    },
    "veryactive": {
        "type": 'Active',
        "level": 3
    },
    "workingdog": {
        "type": 'Active',
        "level": 3
    },
    "inactivesenior": {
        "type": 'Senior',
        "level": 1.2
    },
    "overweight": {
        "type": 'Sensitive',
        "level": 1.8
    }
}

function getBreeds() {
    // get dog breeds from the api or local
    breeds = localStorage.getItem('breeds') ? JSON.parse(localStorage.getItem('breeds')) : [];
    if (!breeds.length) {
        fetch("https://api.thedogapi.com/v1/breeds", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('dog breeds +++', result);
                if (result.length) {
                    localStorage.setItem('breeds', JSON.stringify(result));
                    // generate render data
                    for (let index = 0; index < result.length; index++) {
                        const element = result[index];
                        renderHtml(element);
                    }
                    document.getElementById('breeds').innerHTML = data;
                }
            })
            .catch(error => console.log('error', error));
    } else {
        for (let index = 0; index < breeds.length; index++) {
            const element = breeds[index];
            renderHtml(element);
        }
        document.getElementById('breeds').innerHTML = data;
    }
}

function renderHtml(element) {
    data += "<div class='col-md-3 col-sm-12 d-flex align-items-stretch mt-3 mb-3 justify-content-center'><div class='card' style='width: 18rem;'><img src='"
        + element.image.url + "' class='card-img-top' alt='" + element.bred_for + "'><div class='card-body'><p onclick=dogClick('" +
        `${element.image.id}` + "') class='card-text'>"
        + element.name + "</p></div></div></div>"
}

function search() {
    data = '';
    var name = document.getElementById("name").value;
    
    // get breeds data from the local
    breeds = localStorage.getItem('breeds') ? JSON.parse(localStorage.getItem('breeds')) : [];
    
    if (!breeds.length) {
        document.getElementById('breeds').innerHTML = "<p class='text-center'>no breeds data</p>";
    } else {
        // filter breeds
        var filtered = [];
        for (var i = 0; i < breeds.length; i++) {
            if (breeds[i].name.toLowerCase().includes(name.toLowerCase())) {
                filtered.push(breeds[i]);
            }
        }

        // display filtered data
        if (filtered.length) {
            for (let index = 0; index < filtered.length; index++) {
                const element = filtered[index];
                renderHtml(element);
            }
            document.getElementById('breeds').innerHTML = data;
        } else {
            document.getElementById('breeds').innerHTML = "<p class='text-center'>not found such item</p>";
        }
    }
}

function dogClick(id) {
    // redirect to dog detail page
    console.log('dog image id +++', id);
    localStorage.setItem('id', id);
    window.location.href = './dog.html';
}

function dogDetail() {
    var id = localStorage.getItem('id');
    // get weight and activity info from local storage
    document.getElementById("weight").value = localStorage.getItem('weight');
    document.getElementById("activity").value = localStorage.getItem('activity');

    // get dog details from api using dog image id
    fetch("https://api.thedogapi.com/v1/images/" + id, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log('dog detail +++', result, Object.keys(result).length);
            // display dog detail image
            if (result) {
                localStorage.setItem('dog', JSON.stringify(result));
                document.getElementById('dogImage').innerHTML = "<img src='" + result.url + "' class='col-md-12 float-md-end mb-3 ms-md-3' style='max-width: 100%' alt='' />";
            }
        })
        .catch(error => console.log('error', error));
}

function weightChange() {
    // trigger weight Change and save it to localstorage
    var weight = document.getElementById('weight').value;
    console.log('weight +++', weight);
    if (weight > 0) {
        localStorage.setItem('weight', weight);
        document.getElementById('inputError').innerHTML = "";
    }
}

function activityChange() {
    // trigger activity level value Change and save it to localstorage
    var e = document.getElementById('activity');
    var activity = e.options[e.selectedIndex].value;
    console.log('activity +++', activity);
    if (activity) {
        localStorage.setItem('activity', activity);
        document.getElementById('inputError').innerHTML = "";
    }
}

function dogResult() {
    // input validation for kcal calculation
    if (document.getElementById('weight').value == '') {
        document.getElementById('inputError').innerHTML = "<p class='text-center' style='color: red;'>Skriv inn vekt på din hund</p>";
    } else {
        var e = document.getElementById('activity');
        if (e.options[e.selectedIndex].value == '') {
            document.getElementById('inputError').innerHTML = "<p class='text-center' style='color: red;'>Velg din hunds aktivitetsnivå</p>";
        } else {
            document.getElementById('inputError').innerHTML = "";
            window.location.href = './result.html';
        }
    }
}

function getResult() {
    // get dog weight and activity & calculate kcal
    var weight = localStorage.getItem('weight');
    var activity = localStorage.getItem('activity');
    console.log('weight, activity, doggy +++', weight, activity, doggy[activity]);
    
    // (70	*	WEIGHT IN KILOGRAM	^	0.75)	* ACTIVITY	LEVEL
    var kcal = (70 * (Math.pow(parseInt(weight, 10), 0.75))) * parseInt(doggy[activity]['level']);
    console.log('kcal +++', kcal);
    
    // display calculation result
    document.getElementById('kcal').innerHTML = "<h3>Ditt resultat! Hunden din trenger " + parseInt(kcal, 10) + " kcal om dagen.</h3>"
    document.getElementById('productType').innerHTML = "<p>Din hund vil nyte godt av <strong>DoggyNutro "
        + doggy[activity]['type'] + "!</strong> Næringsinnholdet i dette fôret vil gi hunden din nøyaktig det den trenger.</p>";
    document.getElementById('levelImage').innerHTML = "<img src='./assets/products/" + (doggy[activity]['type']).toLowerCase() +".jpg' class='col-md-12 float-md-end mb-3 ms-md-3' style='max-width: 100%' alt='' />";
}