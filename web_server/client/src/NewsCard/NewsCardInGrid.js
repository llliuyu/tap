import Auth from '../Auth/Auth';
import React from 'react';
import './NewsCardInGrid.css';

class NewsCardInGrid extends React.Component{
    redirectToUrl(url) {
        this.sendClickLog();
        window.open(url, '_blank');
    }

    sendClickLog() {
        let url = 'http://localhost:3000/news/userId/' + Auth.getEmail()
                    + '/newsId/' + this.props.news.digest;

        let request = new Request(encodeURI(url), {
            method: 'POST',
            headers: {
                'Authorization': 'bearer ' + Auth.getToken(),
            },
            cache: false});
        
            fetch(request);
}

    render(){
        return(
            <div>
                <div className="card horizontal hoverable small row hide-on-small-only" 
                    onClick={(event) => { event.preventDefault(); this.redirectToUrl(this.props.news.url); }}>
                <div className="fill col l6 m6">
                  <img src={this.props.news.urlToImage}/>
                </div>
                <div className="card-stacked col l6 m6">
                  <div className="card-content textfill col l12 m12">
                      <h6 className="black-text block-with-text">{this.props.news.title}</h6>
                      <p className="grey-text text-darken-3 block-with-text">{this.props.news.description}</p>
                  </div>
                  <div className="card-action col l12 m12 cards">
                      {this.props.news.source != null && <div className='chip light-blue news-chip'>{this.props.news.source}</div>}
                      {this.props.news.time != null && <div className='chip amber news-chip'>{this.props.news.time}</div>}
                  </div>
                </div>
            </div>
        
            <div className="row hide-on-med-and-up hoverable small" 
                    onClick={(event) => { event.preventDefault(); this.redirectToUrl(this.props.news.url); }}>
                <div className="col s12">
                    <div className="card">
                    <div className="card-image">
                        <img src={this.props.news.urlToImage}/>
                    </div>
                    <div className="card-content">
                    <span className="card-title black-text">{this.props.news.title}</span>
                        <p className="grey-text text-darken-3">{this.props.news.description}</p>
                    </div>
                    <div className="card-action">
                    {this.props.news.source != null && <div className='chip light-blue news-chip mini'>{this.props.news.source}</div>}
                    {this.props.news.time != null && <div className='chip amber news-chip mini'>{this.props.news.time}</div>}
                    </div>
                    </div>
                </div>
                </div>
            </div>
      );
    }
}

export default NewsCardInGrid;