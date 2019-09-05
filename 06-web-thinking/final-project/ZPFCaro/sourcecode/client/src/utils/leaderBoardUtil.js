export function initState() {
    let initStateValue = {
      leaderBoard:[],
    };
    return initStateValue;
  }
  
export function coverResponseToSate(leaderBoard,maxRank){
  let res = [];
  if (!leaderBoard) return res;
  
  for (let rank = 0; rank < leaderBoard.length; rank++) {
    if(rank === maxRank) break;
    let userRank = leaderBoard[rank];
    res[rank] =  {
      rank:rank+1,
      displayedname:userRank['display_name'],
      points:userRank['points'],
      username:userRank['username'],
    }
  }

  if (res.length<maxRank){
    for (let i = res.length; i < maxRank; i++) {
      res[i]={
        rank:i+1,
        displayedname:'---',
        points:'0',
        username:'-',
      }
    }
  }

  return {leaderBoard:res};
}