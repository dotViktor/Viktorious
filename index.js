//TODO make a github repo, try to make the fetch response set the match id, removing the need for setMatchId
let idInfo = {
    pName: null,
    region: null,
    accId: null,
    sumId: null,
};
let gameId = []; // this is the empty array storing all game ids of the last 10 games(0-9)
let partId = [];
let gameData = [];
let champData = [];
let playerData = [];
//callbacks
function setPlayerInfo(data) { //this sets the accId
    idInfo.accId = data.accountId;
    idInfo.sumId = data.id;
}
function setMatchId(data) { //this sets all the game ids
    gameId.length = 0; // this clears the array every time when you submit, prefents game stacking
    for (let i = 0; i <= 9; i++) {
        gameId.push(data.matches[i].gameId);
    }
}
function setChampionData(data) {
    champData.length = 0;
    for (let i = 0; i <= 2; i++) {
        champData.push(data[i]);
    }
}
//callbacks

//get functions
async function getMatchId() { //this gets the match ids
    await fetch(`http://31.13.206.166:42069/lol/match/v4/matchlists/by-account/${idInfo.accId}?platform=${idInfo.region}&endIndex=10&beginIndex=0`)
        .then(res => res.json())
        .then(data => setMatchId(data))
}
async function getMatchData(id) {
    const response = await fetch(`http://31.13.206.166:42069/lol/match/v4/matches/${id}?platform=${idInfo.region}`)
    return response.json();
}
async function getPlayerData() {
    await fetch(`http://31.13.206.166:42069/lol/summoner/v4/summoners/by-name/${idInfo.pName}?platform=${idInfo.region}`)
        .then(res => res.json())
        .then(data => setPlayerInfo(data))
}
async function getChampionData() {
    await fetch(`http://31.13.206.166:42069/lol/champion-mastery/v4/champion-masteries/by-summoner/${idInfo.sumId}?platform=${idInfo.region}`)
        .then(res => res.json())
        .then(data => setChampionData(data))
}
//get functions
//logix

//logix
async function submitInfo() { //this gets the player accId

    idInfo.pName = document.getElementById("nameInput").value;
    idInfo.region = document.getElementById("region").value;

    await getPlayerData();

    await getMatchId();

    getChampionData();

    gameData.length = 0;
    for (let i = 0; i <= 9; i++) {
        gameData.push(await getMatchData(gameId[i]));
    }

    partId.length = 0;
    for(let i = 0; i <= 9; i++){
    	partId.push(gameData[i].participantIdentities.find(o => o.player.summonerName === idInfo.pName).participantId)
    }

    playerData.length = 0;
    for(let i = 0; i <= 9; i++){
    	playerData.push(gameData[i].participants.find(o => o.participantId === partId[i]))
    }
};