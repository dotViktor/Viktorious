//TODO make a github repo, try to make the fetch response set the match id, removing the need for setMatchId
let idInfo = {
	pName:   null,
	region:  null,
	accId:   null,
};
let gameId = []; // this is the empty array storing all game ids of the last 10 games(0-9)
let gameData = [];

//callbacks
function setPlayerInfo(data){ //this sets the accId
	idInfo.accId = data.accountId;
}
function setMatchId(data){ //this sets all the game ids
	gameId.length = 0; // this clears the array every time when you submit, prefents game stacking
	for(let i = 0; i <= 9; i++){
		gameId.push(data.matches[i].gameId);
	}
}
//callbacks

//get functions
async function getMatchId(){ //this gets the match ids
	await fetch(`http://31.13.206.166:42069/lol/match/v4/matchlists/by-account/${idInfo.accId}?platform=${idInfo.region}&endIndex=10&beginIndex=0`)
	.then(res => res.json())
	.then(data => setMatchId(data))
}
async function getMatchData(id){
	const response = await fetch(`http://31.13.206.166:42069/lol/match/v4/matches/${id}?platform=${idInfo.region}`)
	return response.json();
}
//get functions
async function submitInfo(){ //this gets the player accId

	idInfo.pName = document.getElementById("nameInput").value;
	idInfo.region = document.getElementById("region").value;
	
	await fetch(`http://31.13.206.166:42069/lol/summoner/v4/summoners/by-name/${idInfo.pName}?platform=${idInfo.region}`)
	.then(res => res.json())
	.then(data => setPlayerInfo(data))

	await getMatchId()

	for(let i = 0; i <= 9; i++){
		gameData.push(await getMatchData(gameId[i]));
	}
};