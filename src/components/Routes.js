import React, { Component } from 'react'
import { BrowserRouter, Match, Miss } from 'react-router'
import classNames from 'classnames'
import api from 'wordpress-rest-api-oauth-1'
const SITE_URL = 'http://halvorson-react:8888/'

import App from './home/App'
import BlogIndex from './blog/BlogIndex'
import BlogSingle from './blog/BlogSingle'
import NotFound from './error/NotFound'
import About from './about/About'
import Navigation from './navigation/Navigation'
import Footer from './footer/Footer'
//styles
import css from '../css/index.css'
import styles from '../css/App.css'

export default class Routes extends Component {
  constructor() {
		super()
		this.state = {
			posts: [],
      work: [],
      pages: [],
      options: [],
      loadingPosts: true,
      loadingPages: true,
      loadingWork: true,
      loadingOptions: true
		}
		window.api = new api({
			url: SITE_URL
		})
	}
  componentWillMount() {
      this.loadPosts()
      this.loadPages()
      this.loadWork()
      // this.loadOptions()
  }

  loadPosts() {
		let args = {
			_embed: true,
			per_page: 10
		}
	  window.api.get('/wp/v2/posts', args)
		.then(posts => {
			this.setState({
        posts,
        loadingPosts: false
       })
		})
	}

  loadPages() {
    let args = {
      _embed: true
    }
    window.api.get('/wp/v2/pages', args)
    .then(pages => {
      this.setState({
        pages,
        loadingPages: false
      })
    })
  }

  loadWork() {
		let args = {
			_embed: true,
			per_page: 10
		}
	  window.api.get('/wp/v2/work', args)
		.then(work => {
			this.setState({
        work,
        loadingWork: false
       })
		})
	}

  // loadOptions() {
  //   window.api.get('/wp/v2/options')
	// 	.then(options => {
	// 		this.setState({
  //       options,
  //       loadingOptions: false
  //      })
	// 	})
  // }

  render() {
    const pageClasses = classNames(
      'page'
    )
    return (
      <BrowserRouter>
        <main className={pageClasses}>
          <Navigation />
          <Match  exactly pattern="/"
                  render={(props) => <App {...props}
                                      pages={this.state.pages}
                                      work={this.state.work}
                                      loadingPages={this.state.loadingPages}
                                      loadingWork={this.state.loadingWork}
                                      />} />
                                    <Match  exactly pattern="/blog/"
                  render={(props) => <BlogIndex {...props}
                                      posts={this.state.posts}
                                      loadingPosts={this.state.loadingPosts}/>} />
          <Match  pattern="/blog/:slug/"
                  render={(props) => <BlogSingle {...props}
                                      posts={this.state.posts}
                                      loadingPosts={this.state.loadingPosts}/>} />
          <Match  pattern="/about/" location={{ pathname: '/about/' }}
                  render={(props) => <About {...props}
                                      pages={this.state.pages}
                                      loadingPages={this.state.loadingPages}/>} />
          <Miss component={NotFound} />
          <Footer pattern="/blog/"/>
        </main>
      </BrowserRouter>
    )
  }
}
