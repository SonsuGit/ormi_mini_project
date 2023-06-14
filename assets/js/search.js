import { cardClick } from "./cardClick.js";

let $input = document.querySelector('#artistInput');
let $button = document.querySelector('button');
let data = [{
    "role": "system",
    "content": "좋아하는 가수를 입력받고, 그 가수의 특징에 대해 설명해줘"
}];
const url = `https://estsoft-openai-api.jejucodingcamp.workers.dev/`;
$button.addEventListener('click', async e => {
    // 검색 UI 숨기기
    document.getElementById('initial-UI').classList.add('hidden');
    // 로딩 표시 보여주기
    document.getElementById('loadingIndicator').classList.remove('hidden');

    e.preventDefault();
    if ($input.value.length == 0) {
        alert('아티스트명을 입력해주세요.');
        return; // 입력값이 없을 경우 함수 종료
    }

    const userInputData = $input.value; // userInputData 변수 선언

    data.push({
        "role": "user",
        "content": userInputData
    });

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        redirect: "follow",
    });

    const response = await res.json();
    // --- 여기부터 similar.js와 다름

    let ArtistDescription = response.choices[0].message.content;
    console.log(ArtistDescription)
    let receivedArtistName = userInputData
    const cardContainer = document.getElementById('cardContainer');
    const cardTemplate = document.getElementById('cardTemplate');

    cardContainer.innerHTML = '';

    console.log(response)
    // chatGPT가 보낸 아티스트 이름 리스트로 카드템플릿 추가하기
    const albumArtURL = await fetchAlbumArt(receivedArtistName);
    const card = cardTemplate.content.cloneNode(true);
    card.querySelector('img').src = albumArtURL;
    card.querySelector('h2').textContent = receivedArtistName;
    card.querySelector('p').textContent = ArtistDescription;
    card.querySelector('.cardTemplate').addEventListener("click", () => cardClick(receivedArtistName)); // 클릭 이벤트 리스너 추가
    
    cardContainer.appendChild(card);
    // 받은 데이터가 맞는지
    console.log(response.choices[0].message.content)
    // 로딩 표시 숨기기
    document.getElementById('loadingIndicator').classList.add('hidden');
    // 카드 컨테이너
    document.getElementById('cardContainer').classList.remove('hidden');
});