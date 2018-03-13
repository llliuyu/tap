import React, {Component} from 'react';
import _ from 'lodash';
import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class SearchBar extends Component {
    constructor(props) {
        super(props);

        this.state = {term: ""};
    }

    render() {
        const throttlingUpdateVideos = _.debounce(() => {
            this.props.fetchVideos(this.state.term);
            this.props.fetchOneVideo(this.state.term);
        }, 300);

        const terms = ['nba', 'nfl', 'mlb', 'machine learning', 'donald trump', 'mtv', 'michael jackson', 'vr', 'technology',
                      'oscars','blocking chain', 'Colleges & Schools','Environmental','World','Entertainment','Media','Politics & Government',
                      'Regional News','Religion','Sports','Technology','Traffic','Weather','Economic & Corp',
                      'Advertisements','Crime', 'Other', 'Magazine', 'Autos & Vehicles','Film & Animation', 
                      'Music', 'Pets & Animals', 'Sports', 'Short Movies','Travel & Events','Gaming','Videoblogging', 'People & Blogs', 'Comedy', 'Entertainment','News & Politics', 'Howto & Style', 'Education', 'Science & Technology', 'Nonprofits & Activism', 'Movies', 'Anime/Animation','Action/Adventure', 'Classics', 'Comedy','Documentary','Drama','Family','Foreign','Horror','Sci-Fi/Fantasy','Thriller','Shorts','Shows',
                      'Trailers'];

        return (
          <div className="row">
            <div className="col m8">
              <div className="input-group search-bar">
                  <i className="input-group-addon  glyphicon glyphicon-search" aria-hidden="true"></i>
                  <input className="form-control"
                      value={this.state.term}
                      onChange={
                          (event) => {
                              // event.persist(); //to avoid event be nullified
                              this.setState({ term: event.target.value });
                          }
                      }
                      onKeyPress={
                          (event) => {
                              if(event.key === 'Enter') {
                                this.props.searchVideo(this.state.term);
                              };
                          }
                      }
                  />
              </div>
            </div>
            <div className="col m2">
              <span className="input-group-btn">
              <MuiThemeProvider>
                <div>
                    <IconButton tooltip="Search">
                                    <ActionSearch color="indigo" onClick={ () => this.props.searchVideo(this.state.term) }/>
                    </IconButton>
                    <IconButton tooltip="Surprise">
                        <NavigationRefresh color="indigo" onClick={ () => {this.props.searchVideo(terms[Math.floor(Math.random() * terms.length)])
                            this.setState({term: ""});
                        } }/>
                    </IconButton>
                </div>
              </MuiThemeProvider>
                </span>
            </div>
          </div>
            
        )
    }
}
export default SearchBar;