import React, { Component } from 'react'
import {Container, Card, Row, Col, Form, Navbar, Button} from 'react-bootstrap';
import { ServerDomain } from "./globalInfo";
import Paginate from "./paginate";

class YoutubeNavbar extends Component{

	render()
	{
		return(
			<Navbar bg="danger" className="justify-content-center mb-3" expand="lg">
				<Navbar.Brand className="text-white">
					YouTube Search Application
				</Navbar.Brand>
			</Navbar>
		)
	}

}

class Search extends Component{
	
	changeQuery = e=>{
		e.preventDefault();
		let query = document.getElementById("query")
		this.props.changeQuery(query.value)
	}

	render()
	{
		return(
			<Container className="mb-3">
				<Row className="justify-content-end">
					<Col xs={12} md ={6} lg={3}>
						<Form className="d-flex" onSubmit={this.changeQuery}>
							<Form.Control type="text" placeholder="Search" id="query" value={this.props.query}>
							</Form.Control>
							<Button className="inline" type="submit">Search</Button>
						</Form>
					</Col>
				</Row>
			</Container>
			
			
		)
	}
}

class SearchResults extends Component{
	constructor()
	{
		super();
		this.state = {
			pageNo:0,
			data: [],
			count:0, // Stores the total no of objects 
		}
	}

	changePageNo = value=>{
		this.setState({
			pageNo:value-1
		}, ()=>this.searchQuery());
	}

	searchQuery = ()=>{
		let url = `${ServerDomain}/search/list_videos/?q=${this.props.query}&offset=${this.state.pageNo*10}`
		fetch(url)
		.then(res=>res.json())
		.then(data=>{
			console.log(data)
			this.setState({
				data: data.results,
				count: data.count,
			})
		}).catch(err=>console.log(err))
	}
	
	componentDidMount()
	{
		this.searchQuery()
	}

	componentDidUpdate(prev)
	{
		if(this.props.query !== prev.query)
		{
			this.searchQuery();
		}
	}
	render()
	{
		const renderList = result=>{
			return(
				<Col xs={12} md={6} lg={3}>
					<Card>
						<Card.Img variant="top" src={result.thumbnail_url} />
						<Card.Body>
							<Card.Title>{result.title}</Card.Title>
							<Card.Text>
								{result.description}
							</Card.Text>
							<Card.Subtitle>Published At : {result.published_at}</Card.Subtitle>
						</Card.Body>
					</Card>		
				</Col>
			)
		}
		return(
			<Container>
				<Container>
					<Row>
						{this.state.data.map(result=>renderList(result))}
					</Row>
				</Container>
				<Paginate 
					changePage={this.changePageNo} 
					itemNo={this.state.count}  
					currentPageNo={this.state.pageNo+1} />
			</Container>
		)
	}
}


class App extends Component{
	constructor()
	{
		super();
		this.state = {
			query:""
		}
		this.changeQuery = this.changeQuery.bind(this);
	}


	changeQuery(value)
	{
		this.setState({
			query:value
		})
	}
	render()
	{
		return(
			<Container>
				<YoutubeNavbar />
				<Search  changeQuery={this.changeQuery}/>
				<SearchResults query={this.state.query} />
			</Container>
		)
	}

}

export default App;