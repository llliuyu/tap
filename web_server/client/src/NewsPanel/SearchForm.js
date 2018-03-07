import React from 'react';
import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class SearchForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      keyword: ""
    }
  }
  render() {
    return(
      <div className="row">
              <div className="col m8">
                <div className="input-group search-bar">
                    <i className="input-group-addon  glyphicon glyphicon-search" aria-hidden="true"></i>
                    <input className="form-control"
                        autoFocus
                        value={this.state.keyword}
                        onChange={
                            (event) => {
                                // event.persist(); //to avoid event be nullified
                                this.setState({ keyword: event.target.value });
                            }
                        }
                        onKeyPress={
                            (event) => {
                                if(event.key === 'Enter') {
                                  this.props.searchNews(this.state.keyword);
                                };
                            }
                        }
                    />
                </div>
              </div>
              <div className="col m2">
                <span className="input-group-btn">
                <MuiThemeProvider>
                      <IconButton tooltip="Search">
                        <ActionSearch color="white" onClick={ () => this.props.searchNews(this.state.keyword) }/>
                      </IconButton>
                </MuiThemeProvider>
                  </span>
              </div>
            </div>
    );
  }
  
}

export default SearchForm;