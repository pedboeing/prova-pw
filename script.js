document.addEventListener("DOMContentLoaded", function() {
	iniciar()
})


function iniciar(){
	const filtros = {
        "busca": document.getElementById("busca").value,
        "tipo": document.getElementById("tipo").value,
        "qtd": document.getElementById("qtd").value,
        "de": document.getElementById("de").value,
        "ate": document.getElementById("ate").value
    };
	carregarFiltro()
	buscaDados(filtros)
}


function carregarFiltro(){
    const filterDialog = document.getElementById("filter-dialog");
	const filterIcon = document.getElementById("filter-icon");
    const closeDialog = document.getElementById("close-filters");

	filterIcon.addEventListener("click", function() {
        filterDialog.showModal()
    });

    closeDialog.addEventListener("click", function() {
        filterDialog.close()
    });

	document.getElementById("apply-filters").addEventListener("click", function(event) {
		event.preventDefault();
		aplicaFiltro();
		filterDialog.close();
	});
}


function aplicaFiltro() {
    const filtros = {
        "busca": document.getElementById("busca").value,
        "tipo": document.getElementById("tipo").value,
        "qtd": document.getElementById("qtd").value,
        "de": document.getElementById("de").value,
        "ate": document.getElementById("ate").value
    };

    const queryString = Object.keys(filtros)
        .filter(key => filtros[key])
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filtros[key])}`)
        .join("&");
    const newUrl = `${window.location.pathname}?${queryString}`;
    window.history.pushState({}, "", newUrl);

    buscaDados(filtros);
    atualizaContador(filtros);
}


function buscaDados(filtros) {
    const apiUrl = "https://servicodados.ibge.gov.br/api/v3/noticias/";
    const url = new URL(apiUrl);
    const params = new URLSearchParams();
	const newsContainer = document.querySelector(".news-container");

    params.set("qtd", filtros.qtd);

    url.search = params.toString();
	console.log(url)

    console.log("Fetching data from:", url);

    fetch(url).then(response => {

        if (!response.ok) {
            throw new Error("Erro ao buscar as notícias. Status: " + response.status);
        }
        return response.json();

    })
	.then(data => {
        console.log("Data received:", data);

        newsContainer.innerHTML = "";

        data.items.forEach(news => {

            const images = JSON.parse(news.imagens);
            const imageIntro = images.image_intro;

            const newsItem = document.createElement("div");
            newsItem.classList.add("news-item");
            newsItem.innerHTML = `
                <h3>${news.titulo}</h3>
                <p>${news.introducao}</p>
                <img src= https://agenciadenoticias.ibge.gov.br/${imageIntro} alt="Imagem da notícia">
                <a href="${news.link}" target="_blank">Leia mais</a>
            `;
            newsContainer.appendChild(newsItem);
        });
    })
	.catch(error => {
        console.error("Erro ao buscar as notícias:", error);
    });
}

function atualizaContador(queryParams) {
	const filterCount = document.getElementById("filter-count");
    const activeFilters = Object.keys(queryParams).filter(key => queryParams[key] && key !== "page" && key !== "busca").length;
    if (activeFilters > 0) {
        filterCount.textContent = activeFilters;
        filterCount.style.display = "inline-block";
    } else {
        filterCount.style.display = "none";
    }
}