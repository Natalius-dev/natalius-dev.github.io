function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

const repos = JSON.parse(httpGet("https://api.github.com/users/natalius-dev/repos?sort=created"));
const container = document.getElementById("container");

for(let i = 0; i < repos.length; i++) {
    const repo_name = repos[i.toString()].name;

    var card = document.createElement("div");
    card.classList.add("card","flex-grow-1","m-2");

    const contents = JSON.parse(httpGet("https://api.github.com/repos/natalius-dev/"+repo_name+"/contents/"))
    let image_file = "thumbnail 404.svg";
    const url = repos[i.toString()].html_url;
    for(let i = 0; i < contents.length; i++) {
        if(contents[i.toString()].name === "thumbnail.png") {
            image_file = url + "/raw/main/" + contents[i.toString()].path;
            break;
        }
    }

    let img = document.createElement("img");
    img.src = image_file;
    img.classList.add("card-img-top","thumbnail");
    img.alt = repo_name;
    card.appendChild(img);

    let card_body = document.createElement("div");
    card_body.classList.add("card-body");

    let card_title = document.createElement("h5");
    card_title.classList.add("card-title");
    let card_title_a = document.createElement("a");
    card_title_a.innerHTML = repo_name;
    card_title_a.href = url;
    card_title_a.target = "_blank";
    card_title.appendChild(card_title_a);

    let card_text = document.createElement("p");
    card_text.classList.add("card-text","text-muted");
    card_text.innerHTML = repos[i.toString()].description;

    const deployments = JSON.parse(httpGet("https://api.github.com/repos/natalius-dev/"+repo_name+"/deployments"))
    card_body.appendChild(card_title);
    card_body.appendChild(card_text);
    if(deployments.length > 0) {
        if(JSON.parse(httpGet(deployments["0"].statuses_url))["0"].state === "success"){
            let button = document.createElement("button");
            button.classList.add("py-2","px-3");
            button.onclick = function(){setTimeout(function(){window.open("https://github.natalius.cc/"+repo_name);},250)};
            button.innerHTML = "Visit Live Demo";
            card_body.appendChild(button);
        }
    }

    card.appendChild(card_body);

    container.appendChild(card);
}