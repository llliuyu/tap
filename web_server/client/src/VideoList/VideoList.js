import React, { Component } from 'react';
import './VideoList.css';

class VideoList extends Component {
  constructor(props) {
    super(props);

  }
  componentDidMount() {
      if(this.props.videos != 0) {
          this.props.selectVideo(this.props.videos[0]);
      }
  }

  renderListItem() {
    if(this.props.videos) {
        return this.props.videos.map((video) => {   //.map挡掉了[]报错的情况
            return (
                <li
                    className='list-group-item'
                    onClick={() => this.props.selectVideo(video)}
                    key={video.etag}
                >
                    <div className="media-left">
                        <img className="media-object"
                            src={video.snippet.thumbnails.default.url}
                        />
                    </div>
                    <div className="media-right">
                        <div className="media-heading">
                            {video.snippet.title}
                        </div>
                    </div>
                </li>
            );
        });
    }      
    }

  render() {
      return (
        <ul className='list-group'>
            {this.renderListItem()}
        </ul>
      )
  }
}

export default VideoList;