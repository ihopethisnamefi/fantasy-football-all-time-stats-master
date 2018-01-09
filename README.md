# ESPN Fantasy Football All Time Stats
Hosted on Heroku. 

https://espn-ff-all-time-stats.herokuapp.com/

##### Note: League must be viewable to public, see league setting below
![alt text](https://i.imgur.com/ZConf4E.png)

## To Do:
1. [x] add all historical teams to returned array
2. [x] Sort headers for all columns 
3. [x] filters for teams showed (all teams vs only 2017) DONE
4. [x] Fix pictures
5. [ ] Update UI
6. [ ] Add export table HTML functionality
7. [ ] Add user login to save leagues
8. [ ] Maybe an email league mates feature?

## Development
Built with [create-react-app](https://github.com/facebookincubator/create-react-app)

Run with: `yarn start` 

## Test League IDs
### Good to go
1. http://games.espn.com/ffl/leagueoffice?leagueId=164548&seasonId=2017
2. http://games.espn.com/ffl/leagueoffice?leagueId=164834&seasonId=2017
3. http://games.espn.com/ffl/leagueoffice?leagueId=680365&seasonId=2017
4. http://games.espn.com/ffl/leagueoffice?leagueId=164569&seasonId=2017

### Debug Issues
1. http://games.espn.com/ffl/leagueoffice?leagueId=164598&seasonId=2017 (???)
2. http://games.espn.com/ffl/leagueoffice?leagueId=164613&seasonId=2017 (no owners, think it's ok)

