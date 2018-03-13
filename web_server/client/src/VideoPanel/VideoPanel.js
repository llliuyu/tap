import React from 'react';
import axios from 'axios';
import VideoDetail from '../VideoDetail/VideoDetail';
import VideoList from '../VideoList/VideoList';
import SearchBar from '../SearchBar/SearchBar';
import Auth from '../Auth/Auth';
import './VideoPanel.css';


var API_URL = 'https://www.googleapis.com/youtube/v3/search';
const API_KEY = 'AIzaSyAtqw6J-pi0XmBTdqosqy9eo9AX_5Ew4ow';


class VideoPanel extends React.Component {
    constructor() {
        super();
        this.state = { 
            videos : [],
            video : {},
            term: ""
        };  
    }
    
    loadVideoLists = () =>{
        const params = {
            key: API_KEY,
            part: 'snippet',
            q: this.state.term,
            type: 'video',
            maxResults: 10,
        };
        var url = new URL(API_URL);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        
        axios.get(url).then(
            res => {
                this.setState({videos: res.data.items});
            }
        )
    }

    loadPreference = () => {
        let url = 'http://' + window.location.hostname + ':3000' + '/preference/userId/' + Auth.getEmail();
    
        let request = new Request(encodeURI(url), {
          method: 'GET',
          headers: {
            'Authorization': 'bearer ' + Auth.getToken(),
          },
          cache: 'no-cache'
        });
    
        fetch(request)
          .then((res) => res.json())
          .then((term) => {
            console.log(term);
            this.setState({
                term: term
            }, ()=>{
                this.loadVideoLists();
                this.loadVideo();
            });
          });
        }

    loadVideo = () => {
        const params = {
            part: 'snippet',
            key: API_KEY,
            q: this.state.term,
            type: 'video',
            maxResults: 1
        };

        var url = new URL(API_URL);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        axios.get(url).then(
            res => {
                this.setState({video: res.data.items[0]});              
            }
        )
    }

    searchVideo = (term) => {
        const params = {
            key: API_KEY,
            part: 'snippet',
            q: term,
            type: 'video',
            maxResults: 10,
        };

        var url = new URL(API_URL);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        axios.get(url).then(
            res => {
                this.setState({videos: res.data.items});
                this.setState({video: res.data.items[0]});
            }
        )
    }

    selectVideo = (video) => {
        this.setState({video});
    }

    componentDidMount() {
    
        this.loadPreference();

    }

    render() {
        return (
            <div>  
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 offset-s2">
                            <SearchBar searchVideo={this.searchVideo}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col m7">
                            <VideoDetail activeVideo={this.state.video}/>
                        </div>
                        <div className="col m5">
                            <VideoList videos={this.state.videos} selectVideo={this.selectVideo}/>
                        </div>
                    </div>
                </div>
            </div>
        );
        
    }
}

export default VideoPanel;