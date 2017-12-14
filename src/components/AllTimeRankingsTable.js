import React, { Component } from 'react';
import { Grid, Segment, Header, Table, Image, Loader, Button, Dropdown, Tab } from 'semantic-ui-react';
import { EspnFantasyFootballApi } from '../api/EspnFantasyFootballApi';
import { withRouter, Link } from 'react-router-dom';

class AllTimeRankingsTable extends Component {
    static propTypes = {};
    static defaultProps = {};

    constructor() {
        super();
        this.api = new EspnFantasyFootballApi();
        this.state = {
            userTotalHistoricalData: [],
            userTotalHistoricalDataBak: [],
            sortPercAsc: "ASC",
            sortLossAsc: "ASC",
            sortWinAsc: "ASC"
        }
    }

    async componentWillMount() {
        this.setState({loading: true})
        try {
            //let rankings = await this.api.getPowerRankings(this.props.match.params.leagueId, this.props.match.params.seasonId);
            //let userData = await this.api.getCurrentUserData(this.props.match.params.leagueId, this.props.match.params.seasonId);
            //await this.api.getHistorySummationData(this.props.match.params.leagueId, this.props.match.params.seasonId);
            //console.log(userData);
            //const years = await this.api.getYearsHistory(this.props.match.params.leagueId, this.props.match.params.seasonId);
            //const userHistoricalData = await this.api.getHistoricalUserData(this.props.match.params.leagueId, this.props.match.params.seasonId);
            let userTotalHistoricalData = await this.api.getTotalUserData(this.props.match.params.leagueId, this.props.match.params.seasonId);
            //console.log(userTotalHistoricalData);
            let userTotalHistoricalDataBak = userTotalHistoricalData;
            userTotalHistoricalData.sort(function(a,b){
                return parseFloat(b.winperc) - parseFloat(a.winperc);
            });
            //let userTotalHistoricalData = await this.api.getCurrentUserData(this.props.match.params.leagueId, this.props.match.params.seasonId);
            this.setState({userTotalHistoricalData, userTotalHistoricalDataBak, loading:false})
        } catch(e) {
            console.log(e);
            this.props.history.push("/error");
        }
    }

    switchLeague() {
        this.props.history.push("/");
    }


    filterTeams = (e, { value }) => {
        //console.log(value);             
        if (value === "Current"){
            let newArray = this.state.userTotalHistoricalData;
            newArray = newArray.filter((team) => { 
                return team.year === Number(this.props.match.params.seasonId); 
            });
            var state = {
                userTotalHistoricalData: newArray,
            };
        }
        else{
            let newArray = this.state.userTotalHistoricalDataBak;
            var state = {
                userTotalHistoricalData: newArray,
            };
        }

        this.setState(state);
    }

    sortPerc(){
        let newArray = this.state.userTotalHistoricalData;
            if (this.state.sortPercAsc === "DESC"){
                newArray.sort(function(a,b){
                    return parseFloat(b.winperc) - parseFloat(a.winperc);
                });
                var state = {
                    userTotalHistoricalData: newArray,
                    sortPercAsc: "ASC"
                };
            }
            else{
                newArray.sort(function(a,b){
                    return parseFloat(a.winperc) - parseFloat(b.winperc);
                });
                var state = {
                    userTotalHistoricalData: newArray,
                    sortPercAsc: "DESC"
                };
            }
       
        this.setState(state);
    }

    sortLoss(){
        let newArray = this.state.userTotalHistoricalData;     
        if (this.state.sortLossAsc === "DESC"){
            newArray.sort(function(a,b){
                return parseFloat(b.losses) - parseFloat(a.losses);
            });
            var state = {
                userTotalHistoricalData: newArray,
                sortLossAsc: "ASC"
            };
        }
        else{
            newArray.sort(function(a,b){
                return parseFloat(a.losses) - parseFloat(b.losses);
            });
            var state = {
                userTotalHistoricalData: newArray,
                sortLossAsc: "DESC"
            };
        }
      
       
        this.setState(state);
    }

    sortWin(){
        let newArray = this.state.userTotalHistoricalData;
       
        if (this.state.sortWinAsc === "DESC"){
            newArray.sort(function(a,b){
                return parseFloat(b.wins) - parseFloat(a.wins);
            });
            var state = {
                userTotalHistoricalData: newArray,
                sortWinAsc: "ASC"
            };
        }
        else{
            newArray.sort(function(a,b){
                return parseFloat(a.wins) - parseFloat(b.wins);
            });
            var state = {
                userTotalHistoricalData: newArray,
                sortWinAsc: "DESC"
            };
        }
      
       
        this.setState(state);
    }

    render() {
        const {userTotalHistoricalData} = this.state;
        /*const panes = [
            {menuItem: 'Tab 1', pane:{key: 'tab1', content: 'This is tab 1'}},
            {menuItem: 'Tab 2', 
                pane:(
                        <Tab.Pane key='tab2'>
                            <p>This tab has complex content</p>

                        </Tab.Pane>
                )},
        ]*/
        return (
        <div>
            <Loader active={this.state.loading}/>
            {/*}<Tab panes={panes} renderActiveOnly={false} />{*/}
            <Grid centered>
                <Grid.Row>
                </Grid.Row>
                {userTotalHistoricalData.length > 0 && <Grid.Row>
                <Grid.Column computer={15} tablet={15} mobile={16}>
                    <Link to="/">Switch to a different League</Link>
                    <Segment>
                    <Header>All Time Stats {this.props.match.params.seasonId}</Header>
                    <Table basic='very' celled unstackable>
                        <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>
                                <Dropdown placeholder="Teams" fluid selection onChange={this.filterTeams} options={[
                                    {
                                        text: "All Teams",
                                        value: "All",
                                    }, 
                                    {
                                        text: this.props.match.params.seasonId + " Teams Only",
                                        value: "Current"}
                                    ]} />
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <div class="ui animated fade button" onClick={() => this.sortWin()}>
                                    <div class="visible content">Wins</div>
                                    <div class="hidden content">Sort {this.state.sortWinAsc}</div>
                                </div>
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <div class="ui animated fade button" onClick={() => this.sortLoss()}>
                                    <div class="visible content">Losses</div>
                                    <div class="hidden content">Sort {this.state.sortLossAsc}</div>
                                </div>
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <div class="ui animated fade button" onClick={() => this.sortPerc()}>
                                    <div class="visible content">Win %</div>
                                    <div class="hidden content">Sort {this.state.sortPercAsc}</div>
                                </div>
                            </Table.HeaderCell>
                            <Table.HeaderCell>Titles</Table.HeaderCell>
                            <Table.HeaderCell>Sackos</Table.HeaderCell>
                            <Table.HeaderCell>PF Through {this.props.match.params.seasonId} </Table.HeaderCell>
                            <Table.HeaderCell>PA Through {this.props.match.params.seasonId}</Table.HeaderCell>
                            <Table.HeaderCell>Years Completed</Table.HeaderCell>
                            <Table.HeaderCell>PF Years Completed</Table.HeaderCell>
                            <Table.HeaderCell>PA Years Completed</Table.HeaderCell>
                            <Table.HeaderCell>PF/Years Completed</Table.HeaderCell>
                            <Table.HeaderCell>PA/Years Completed</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>

                        <Table.Body>
                        { userTotalHistoricalData.map((team, index) =>
                        <Table.Row>
                            <Table.Cell>
                            <Header as='h4' image>

                                <Header.Content>
                                <a href={"http://games.espn.com" + team.teampage}>
                                <Image src={team.imgUrl} shape='rounded' size='mini' avatar='true'/></a>
                                {index+1}. <a href={"http://games.espn.com" + team.teampage}>{team.teamname}</a>
                                <Header.Subheader>{team.owner}</Header.Subheader>
                                </Header.Content>
                            </Header>
                            </Table.Cell>
                            <Table.Cell>
                                {team.wins}
                            </Table.Cell>
                            <Table.Cell>
                                {team.losses}
                            </Table.Cell>
                            <Table.Cell>
                                {team.winperc}%
                            </Table.Cell>
                            <Table.Cell>
                                {team.championships.map(function(champ,i){
                                        return <div>{champ}</div>
                                    })}
                            </Table.Cell>
                            <Table.Cell>
                                { team.sackos.map(function(sacko,i){
                                        return <div>{sacko}</div>
                                    })}
                            </Table.Cell>
                            <Table.Cell>
                                {team.pfcurrent}
                            </Table.Cell>
                            <Table.Cell>
                                {team.pacurrent}
                            </Table.Cell>
                            <Table.Cell>
                                {team.yearsActive}
                            </Table.Cell>
                            <Table.Cell>
                                {team.pf}
                            </Table.Cell>
                            <Table.Cell>
                                {team.pa}
                            </Table.Cell>
                            <Table.Cell>
                                {(team.pf/team.yearsActive).toFixed(1)}
                            </Table.Cell>
                            <Table.Cell>
                                {(team.pa/team.yearsActive).toFixed(1)}
                            </Table.Cell>
                        </Table.Row>
                        )}
                        </Table.Body>
                    </Table>
                    </Segment>
                </Grid.Column>
                </Grid.Row>}
            </Grid>
        </div>
        )
    }
}
export default withRouter(AllTimeRankingsTable)