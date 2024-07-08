// 함수: 포켓몬 이름으로 API 요청하여 정보 가져오기
async function fetchPokemonInfo(name) {
    try {
        // 영어 이름으로 포켓몬 정보 요청
        const responseEnglish = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        if (responseEnglish.ok) {
            const data = await responseEnglish.json();
            return data;
        }

        // 한국 이름으로 포켓몬 정보 요청
        const responseKorean = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name.toLowerCase()}`);
        if (responseKorean.ok) {
            const speciesData = await responseKorean.json();
            const pokemonName = speciesData.name;
            const response = await fetch(speciesData.varieties[0].pokemon.url);
            const data = await response.json();
            return data;
        }

        throw new Error('포켓몬을 찾을 수 없습니다.');
    } catch (error) {
        console.error('API 요청 중 오류:', error);
        return null;
    }
}

// 검색 버튼 클릭 이벤트 핸들러
document.getElementById('search-btn').addEventListener('click', async function() {
    const pokemonName = document.getElementById('pokemon-name').value.trim();
    if (pokemonName === '') {
        alert('포켓몬 이름을 입력하세요.');
        return;
    }

    const pokemonInfoDiv = document.getElementById('pokemon-info');
    pokemonInfoDiv.innerHTML = '<p>로딩 중...</p>';

    const pokemonData = await fetchPokemonInfo(pokemonName);
    if (pokemonData) {
        const englishName = pokemonData.name;
        const height = pokemonData.height * 10; // decimeters to centimeters
        const weight = pokemonData.weight / 10; // hectograms to kilograms
        const types = pokemonData.types.map(type => type.type.name).join(', ');
        const pokemonImage = pokemonData.sprites.front_default;

        pokemonInfoDiv.innerHTML = `
            <p><strong>영어 이름:</strong> ${englishName}</p>
            <p><strong>키:</strong> ${height} cm</p>
            <p><strong>몸무게:</strong> ${weight} kg</p>
            <p><strong>타입:</strong> ${types}</p>
            <img id="pokemon-img" src="${pokemonImage}" alt="${englishName} 이미지">
        `;
    } else {
        pokemonInfoDiv.innerHTML = '<p>포켓몬을 찾을 수 없습니다.</p>';
    }
});
