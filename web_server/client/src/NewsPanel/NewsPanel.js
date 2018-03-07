import './NewsPanel.css';
import Auth from '../Auth/Auth';
import React from 'react';
import NewsCard from '../NewsCard/NewsCard';
import _ from 'lodash';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Search from 'material-ui/svg-icons/action/search';
import GoTop from 'material-ui/svg-icons/editor/publish';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SearchForm from './SearchForm';

class NewsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { news:null, 
                    pageNum:1, 
                    searchPageNum:1,
                    loadedAll:false,
                    loading: false,
                    open: false, 
                    keyword:""};
    this.handleScroll = this.handleScroll.bind(this);
    console.log('1');
  }
  componentWillMount(){
    console.log('2');
  }
  componentDidMount() {
    console.log('5');
    this.loadMoreNews();
    this.loadMoreNews = _.debounce(this.loadMoreNews, 500);
    this.searchNews = _.debounce(this.searchNews, 500);
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps(nextProps) {
    console.log('4');
  }

  handleScroll() {
    let scrollY = window.scrollY ||
                  window.pageYOffset ||
                  document.documentElement.scrollTop;
    if ((window.innerHeight + scrollY) >= (document.body.offsetHeight - 500)) {
      console.log('Loading more news');
      this.setState({
        loading:true
      })
      if(this.state.keyword) {
        console.log(this.state.keyword);
        this.searchNews(this.state.keyword);
      } else {
        this.loadMoreNews();
      }  
    }
  }

  loadMoreNews() {
    console.log('6');
    if (this.state.loadedAll === true) {
      return;
    }

    let url = 'http://' + window.location.hostname + ':3000' + '/news/userId/' + Auth.getEmail()
    + '/pageNum/' + this.state.pageNum;

    let request = new Request(encodeURI(url), {
      method: 'GET',
      headers: {
        'Authorization': 'bearer ' + Auth.getToken(),
      },
      cache: 'no-cache'
    });

    fetch(request)
      .then((res) => res.json())
      .then((news) => {
        if (!news || news.length === 0) {
          this.setState({loadedAll: true});
        }

        this.setState({
          news:this.state.news ? this.state.news.concat(news) : news,
          pageNum: this.state.pageNum + 1,
          loading: false
        });
      });
  }

  searchNews = (keyword) => {
    let url = "";
    if(keyword === this.state.keyword){
      url = 'http://' + window.location.hostname + ':3000' + '/searchNews/userId/' + Auth.getEmail()
            + '/pageNum/' + this.state.searchPageNum + '/key/' + this.state.keyword;
    } else {
      const searchPageNum = 1;
      this.setState({ keyword: keyword,
        searchPageNum: 1
      });
      url = 'http://' + window.location.hostname + ':3000' + '/searchNews/userId/' + Auth.getEmail()
          + '/pageNum/' + searchPageNum + '/key/' + keyword;
      this.goTop();
    }
    

    let request = new Request(encodeURI(url), {
      method: 'GET',
      headers: {
        'Authorization': 'bearer ' + Auth.getToken(),
      },
      cache: 'no-cache'
    });

    fetch(request)
      .then((res) => res.json())
      .then((news) => {
        if (!news || news.length === 0) {
          this.setState({loadedAll: true});
        }
        console.log(news);
        this.setState({
          news: this.state.searchPageNum === 1 ? news : (this.state.news ? this.state.news.concat(news) : news),
          searchPageNum: this.state.searchPageNum + 1,
          loading: false
        });
      });
      
      this.handleClose();
  }

  goTop = () => {
    window.scrollTo(0,0);
  }

  renderNews() {
    const news_list = this.state.news.map((news, i) => {
      return(
        <a className='list-group-item' href="#" key = {i} >
          <NewsCard news={news} />
        </a>
      );
    });

    if(this.state.loading && !this.state.loadedAll) {
      return(
        <div className="container-fluid">
          <div className='list-group'>
            {news_list}
            <div className="progress">
                <div className="indeterminate"></div>
            </div>
          </div>
        </div>
      );
    }else{
      return(
        <div className="container-fluid">
          <div className='list-group'>
            {news_list}
          </div>
        </div>
      );
    }
  }

  openDialog = () => {
		this.setState({open: true});
	}

  handleClose = () => {
		this.setState({open: false});
	};

  render() {
    console.log('3');
    if (this.state.news) {
      return(
        
        <div>
          <div>
            <MuiThemeProvider>
              <div>
                <FloatingActionButton className="gotop" mini={true}>
                  <GoTop onClick = {this.goTop}/>
                </FloatingActionButton>
                <FloatingActionButton className="search" mini={true}>
                  <Search onClick={this.openDialog}/>
                </FloatingActionButton>
                <Dialog
									modal={false}
									open={this.state.open}
                  onRequestClose={this.handleClose}
                  bodyStyle ={modalStyle.overlay}
                  contentStyle = {modalStyle.content}
									>
									<SearchForm searchNews={this.searchNews}/>
								</Dialog>
              </div>
            </MuiThemeProvider>
          </div>
          {this.renderNews()}
        </div>
      );
    } else {
      return(
        <div>
          <div id='msg-app-loading'>
          {console.log('4')}
            Loading...
          </div>
        </div>
      );
    }
  }
}

const modalStyle = {
  overlay : {
    position: 'fixed', /* Stay in place */
    left: '0',
    top: '30%',
    right: 'auto',
    bottom: 'auto',
    width: '80%', /* Full width */
    height: '100%', /* Full height */
    overflow: 'auto', /* Enable scroll if needed */
    backgroundColor: 'rgba(0,0,0,0.5)', /* Black w/ opacity */
    color: 'rgba(255,255,255,0.9)',
  },
  content : {
    width: '60%',
    top: '50%',
    left: '40%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)'
  }
}

export default NewsPanel;