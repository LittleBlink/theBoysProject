let movieData = {}; // Inicializa como objeto vazio para armazenar os dados da API

async function getAllInfo() {
    try {
        const response = await fetch(`https://api.tvmaze.com/shows/15299?embed=cast`);
        if (!response.ok) {
            throw new Error('Falha ao buscar dados');
        }
        const data = await response.json();
        movieData = data; // Atribui todos os dados do show à movieData
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

// Chama a função para buscar e armazenar os dados
getAllInfo().then(() => {
    let basicData = {
        title: movieData.name,
        genres: movieData.genres.join(', '),
        summary: movieData.summary,
        image: movieData.image.original
    };

    const castDataFormatted = movieData._embedded.cast.map(person => ({
        nameAtor: person.person.name,
        birthday: person.person.birthday,
        character: person.character.name,
        imageUrl: person.character.image.original
    }));

    // Exibir todos os personagens ao carregar a página
    displayCharacters(castDataFormatted);

    // Adiciona um evento de escuta ao botão de busca
    document.getElementById('searchButton').addEventListener('click', () => {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filteredCast = castDataFormatted.filter(person => 
            person.character.toLowerCase().includes(searchTerm)
        );
        displayCharacters(filteredCast);
    });
});

// Função para exibir personagens
function displayCharacters(characters) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = "";

    characters.forEach(person => {
        const characterDiv = document.createElement('div');
        characterDiv.classList.add('character');
        characterDiv.innerHTML = `
            <img src="${person.imageUrl}" alt="${person.character}" class="personImage">
            <div class="infos">
                <h2>${person.character}</h2>
                <p>${person.nameAtor}</p>
                <p>${person.birthday}</p>
            </div>
        `;
        resultsDiv.appendChild(characterDiv);
    });
}
