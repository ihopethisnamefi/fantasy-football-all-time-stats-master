import axios from 'axios';
import cheerio from 'cheerio';
import axiosCookieJarSupport from '@3846masa/axios-cookiejar-support';
import tough from 'tough-cookie';
import { values } from 'lodash';
import { getTeamId, getOwner, getPerc, removeDuplicates } from '../util/utils';

export class EspnFantasyFootballApi {
    constructor() {
        axiosCookieJarSupport(axios);
        const cookieJar = new tough.CookieJar();
        this.proxyurl = "https://mighty-fjord-78377.herokuapp.com/";

        axios.defaults.jar = cookieJar;
        axios.defaults.withCredentials = false;
    }

    getCurrentUserData = async (leagueId, seasonId) => {
        //var response = await axios.get(`https://games.espn.com/ffl/api/v2/leagueSettings?leagueId=${leagueId}&seasonId=${seasonId}`);
        var response = await axios.get(`${this.proxyurl}http://games.espn.com/ffl/standings?leagueId=${leagueId}&seasonId=${seasonId}`);
        //let base_url_currentyear = 'http://games.espn.com/ffl/standings?leagueId=' + leagueId + '&seasonId=' + seasonId;
        let $ = cheerio.load(response.data);
        //console.log(response.data);
        let users = [];
        let pointsArray = [];
        $('.evenRow, .oddRow').each( (i, elm) => {
            pointsArray.push({
            pointsFor : Number($(elm).children().eq(1).attr('class','sortablePF').text()),
            pointsAgainst : Number($(elm).children().eq(2).attr('class','sortablePA').text()),
            });
        });
          
        $('.tableBody [bgcolor=#f2f2e8], .tableBody [bgcolor=#f8f8f2]').each( (i, elm) => {
            users.push( {
                team : $(elm).children().first().children().attr('title'),
                teampage : $(elm).children().first().children().attr('href'),
                finalrank : "",
                wins : Number($(elm).children().eq(1).first().text()),
                losses : Number($(elm).children().eq(2).first().text()),
                year : Number(seasonId),
            });
        });
        //console.log(pointsArray);
        for(let i=0; i<users.length; i++) {
            for(let j=0; j<pointsArray.length;j++){
            if (i === j){
                users[i].pf = pointsArray[j].pointsFor;
                users[i].pa = pointsArray[j].pointsAgainst;
            }
            }
        }
        //grab team name from team, owner from team name, win percentage, team Id, and image URL
        for (let t in users){
            let splitTeam = [];
            splitTeam = users[t].team.split(' (');
            users[t].teamname = splitTeam[0];
            users[t].teamId = getTeamId(users[t].teampage);
            users[t].owner = getOwner(users[t].team);
            users[t].winperc = getPerc(users[t].wins,users[t].losses);
            users[t].imgUrl = await this.getimgUrl(users[t].teampage);
        }

        //console.log(users);
        return(users);
        /*return values(users).map(team => (
            {
                id: team.teamId,
                imgUrl: team.imgUrl ? team.imgUrl: "https://openclipart.org/image/2400px/svg_to_png/202776/pawn.png",
                owner: team.owner,
                name: team.teamname,
                wins: team.wins,
                losses: team.losses,
                pf: team.pf,
                pa: team.pa,
                winperc: team.winperc
            }
        ))*/
    }
    
    getYearsHistory = async (leagueId, seasonId) => {
        var response = await axios.get(`${this.proxyurl}http://games.espn.com/ffl/leagueoffice?leagueId=${leagueId}&seasonId=${seasonId}`);
        let $ = cheerio.load(response.data);  
        let yearsHistoryArray = [];
        $('[id=seasonHistoryMenu]').children().each( (i, elm) => {
            yearsHistoryArray.push($(elm).text());
        });
        return(yearsHistoryArray);
    }

    getHistoricalUserData = async (leagueId, seasonId) => {
        const yearsArray = await this.getYearsHistory(leagueId, seasonId);
        let historicalTeamsArray = [];
        for (let y=1; y<yearsArray.length; y++){
            var response = await axios.get(`${this.proxyurl}http://games.espn.com/ffl/tools/finalstandings?leagueId=${leagueId}&seasonId=${yearsArray[y]}`);
                let $ = cheerio.load(response.data);  
                let historyTeams = [];
                //let historyArray = [];
                $('[id=finalRankingsTable]').children().children().next().next().attr('class','sortableRow').each( (i, elm) => {
                    historyTeams.push({
                      team : $(elm).children().eq(1).children().attr('title'),
                      teampage : $(elm).children().eq(1).children().attr('href'),
                      finalrank : $(elm).children().eq(0).text(),
                      record: $(elm).children().eq(4).text(),
                      pf : Number($(elm).children().eq(5).text()),
                      pa : Number($(elm).children().eq(6).text()),
                      year : Number(yearsArray[y]),
                  });
                });
        
                //split record into 2 different fields wins and losses, grab team name from team, grab owner from team name
                for (let t in historyTeams){
                    let splitRecord = []
                    let splitTeam = []
                    splitRecord = historyTeams[t].record.split('-');
                    historyTeams[t].wins = Number(splitRecord[0]);
                    historyTeams[t].losses = Number(splitRecord[1]);

                    splitTeam = historyTeams[t].team.split(' (');
                    historyTeams[t].teamname = splitTeam[0];
                    historyTeams[t].owner = historyTeams[t].team.match(/\(([^)]+)\)/)[1]; 
                  }
                //organize list of teams object by year
               /* historyArray.push({
                  year : yearsArray[y],
                  teams : historyTeams
              });*/
              historicalTeamsArray.push(historyTeams);
     
            }
            //console.log(historicalTeamsArray);
            return(historicalTeamsArray);
        //return this.calculateSeasonWinTotal(weeklyWinsForSeason);
    }

    getHistorySummationData = async (leagueId, seasonId) => {
        const historyTeamsArray = await this.getHistoricalUserData(leagueId, seasonId);
        let historySummationArray = [];
        let userCount = 0;
        //console.log(historyTeamsArray);
        for (let year in historyTeamsArray){
            userCount = 0;
            for (let team in historyTeamsArray[year]){
                //console.log("TEAM #",team, " ",historyTeamsArray[year][team])
                historySummationArray.push(historyTeamsArray[year][team]);
                userCount++;
            }
        }
        //console.log(userCount);
        let newArray = removeDuplicates(historySummationArray,"owner");
        //console.log(newArray);
        for (let team in newArray){
            let champArray = [];
            let sackoArray = [];
            newArray[team].yearsActive = 1;
            for (let h in historySummationArray){
                if ((newArray[team].owner === historySummationArray[h].owner) && (newArray[team].year !== historySummationArray[h].year)){
                    newArray[team].wins = newArray[team].wins + historySummationArray[h].wins;
                    newArray[team].losses = newArray[team].losses + historySummationArray[h].losses;
                    newArray[team].pf = (Number(newArray[team].pf) + Number(historySummationArray[h].pf)).toFixed(1);
                    newArray[team].pa = (Number(newArray[team].pa) + Number(historySummationArray[h].pa)).toFixed(1);
                    newArray[team].yearsActive = newArray[team].yearsActive + 1;

                    if (Number(historySummationArray[h].finalrank) === 1){
                        champArray.push(historySummationArray[h].year);
                    }
                    if (Number(historySummationArray[h].finalrank) === userCount){
                        sackoArray.push(historySummationArray[h].year);
                    }
                }
            }
            if (Number(newArray[team].finalrank) === 1){
                champArray.push(newArray[team].year);
            }
            if (Number(newArray[team].finalrank) === userCount){
                sackoArray.push(newArray[team].year);
            }
            newArray[team].championships = champArray;
            newArray[team].sackos = sackoArray;
            newArray[team].pfcurrent = newArray[team].pf;
            newArray[team].pacurrent = newArray[team].pa;
            newArray[team].imgUrl = "https://openclipart.org/image/2400px/svg_to_png/202776/pawn.png";
        }
        //console.log(newArray);
        return(newArray);
    }

    getTotalUserData = async (leagueId, seasonId) => {
        const historyData = await this.getHistorySummationData(leagueId, seasonId);
        const currentData = await this.getCurrentUserData(leagueId, seasonId);
        //console.log(currentData);
        //console.log(historyData);
        let totalUserDataArray = historyData;
        let userCount = 0;

        for (let user in totalUserDataArray){
            totalUserDataArray[user].pfhistory = 0;
            totalUserDataArray[user].pahistory = 0;
            userCount++;
        }
        //console.log(totalUserDataArray);
        for (let user in totalUserDataArray){
                for (let team in currentData){
                    if (currentData[team].owner === totalUserDataArray[user].owner){
                        totalUserDataArray[user].teamname = currentData[team].teamname;
                        totalUserDataArray[user].team = currentData[team].team;
                        totalUserDataArray[user].teampage = currentData[team].teampage;
                        totalUserDataArray[user].year = currentData[team].year;
                        totalUserDataArray[user].wins = totalUserDataArray[user].wins + currentData[team].wins;
                        totalUserDataArray[user].losses = totalUserDataArray[user].losses  + currentData[team].losses ;
                        totalUserDataArray[user].pfcurrent = (Number(totalUserDataArray[user].pf) + Number(currentData[team].pf)).toFixed(1);
                        totalUserDataArray[user].pacurrent = (Number(totalUserDataArray[user].pa) + Number(currentData[team].pa)).toFixed(1);
                        totalUserDataArray[user].imgUrl = currentData[team].imgUrl;
                }
            }
            totalUserDataArray[user].winperc = getPerc(totalUserDataArray[user].wins,totalUserDataArray[user].losses);
    }
    //console.log(totalUserDataArray);
    return(totalUserDataArray);
    }

    getimgUrl = async (teampage) => {
        var response = await axios.get(`${this.proxyurl}http://games.espn.com${teampage}`);
        let $ = cheerio.load(response.data); 
        let imgUrl = $('img').eq(1).attr('width','151').attr('src');
        return imgUrl;

    }

}

