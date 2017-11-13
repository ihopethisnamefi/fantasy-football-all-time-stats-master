import React, { Component } from 'react';
import AllTimeRankingsTable from './components/AllTimeRankingsTable';
import UrlEntryModal from './components/UrlEntryModal';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import './App.css';
import '../node_modules/semantic-ui-css/semantic.min.css';

class App extends Component {


  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path="/" component={UrlEntryModal}/>
            <Route exact path="/:error" component={UrlEntryModal}/>
            <Route exact path="/espn/:leagueId/:seasonId" component={AllTimeRankingsTable}/>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
