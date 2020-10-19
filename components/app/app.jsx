import React, { Component } from 'react';
import './app.css';
import { Spin, Alert, Input, Pagination } from 'antd';
import * as _ from 'lodash';
import MoviesList from '../movies-list/movies-list';
import ApiMovies from '../../api/api';
import Menu from '../menu/menu';

export default class App extends Component {
	state = {
		movies: [],
		moviesRating: [],
		moviesGenres: [],
		userInternet: true,
		userSession: '',
		loading: true,
		error: false,
		newSearch: '',
		currentSearch: '',
		change: false,
   	maxPage: null,
		currentPage: 1,
	};

	debounceSearchMovies = _.debounce(this.searchMovies.bind(this), 700);

	componentDidMount() {
		const newState = new ApiMovies();
		
		this.checkInternetEvent();
		newState
			.getGuestSession()
			.then((res) => {
			this.setState({ userSession: res.guest_session_id });
		})
			.catch(this.findError.bind(this));

		newState
			.getGenre()
			.then((res) => {
				this.setState({ moviesGenres: res.genres });
			})
			.catch(this.findError.bind(this));
	};

	componentDidUpdate(prevProps, prevState) {
		const { currentSearch, currentPage } = this.state;
		if (
			(currentSearch !== prevState.currentSearch && currentSearch !== '') ||
			(currentPage !== prevState.currentPage && currentPage !== 1)
		) {
			const newState = new ApiMovies();

			newState
				.getMovies(currentPage, currentSearch)
				.then((res) => {
					this.setState(() => {
						return {
							movies: res.results,
							loading: false,
							error: false,
							maxPage: res.total_pages,
						};
					});
				})
				.catch(this.findError.bind(this));
		}
	}

	getMoviesRating = () => {
		const getMoviesRating = new ApiMovies();
		const { userSession } = this.state;
		getMoviesRating
			.getMoviesRating(userSession)
			.then((res) => {
				this.setState({ loading: false, error: false, moviesRating: res.results });
			})
			.catch(this.findError.bind(this));
	};

	onPushRating = (id, rating) => {
		const newRating = new ApiMovies();
		const { userSession } = this.state;
		const newRatingValue = { value: rating };
		newRating
			.postResource(
				`https://api.themoviedb.org/3/movie/${id}/rating?api_key=8392664136aacdf32c9fa4806fe458ec&guest_session_id=${userSession}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json;charset=utf-8',
					},
					body: JSON.stringify(newRatingValue),
				}
			)
			.catch(this.findError.bind(this));
	};

	pagination = page => {
		this.setState({
			currentPage: page,
		});
	};
	
	searchMoviesInput = (newSearch) => {
		this.setState({ newSearch });
		this.debounceSearchMovies(newSearch);
	};

	changeMovies = (bool) => {
		this.setState({ change: bool });
		this.getMoviesRating();
	};

	searchMovies(newSearchMovies) {
		const { currentSearch } = this.state;
		if (newSearchMovies === currentSearch) this.setState({ currentSearch: newSearchMovies, newSearch: '' });
		else this.setState({ loading: true, currentSearch: newSearchMovies, newSearch: '' });
	}

	findError() {
		this.setState({ currentSearch: '', loading: false, error: true });
	}

	checkInternetEvent() {
		window.addEventListener('online', this.changeInternet.bind(this));
		window.addEventListener('offline', this.changeInternet.bind(this));
	}

	changeInternet() {
		const { userInternet } = this.state;
		this.setState({ userInternet: !userInternet });
	}

	render() {
		const { 
			movies,
			moviesRating,
			moviesGenres,
			userInternet,
			loading,
			error,
			newSearch,
			currentSearch,
			change,
			maxPage,
			currentPage,
		} = this.state;
		
		const finalMovies = !change ? movies : moviesRating;

		if (!userInternet) {
			return (
				<Alert message="У вас отсутсвует подключение к интернету" description="Проверьте свое интернет соединение и попробуйте повторить позже" type="error" />
			);
		};

		if (currentSearch === '' && !change) {
			return (
				<div className="container">
					<Menu change={change} changeMovies={this.changeMovies} />
					<Input
						autoFocus
						placeholder="Введите название фильма"
						size="large"
						value={newSearch}
						onChange={(event) => {
							this.searchMoviesInput(event.target.value);
						}}
					/>
					<Alert
						message="Фильм сам себя не найдет"
						description="Введите название фильма в поиске"
						type="info"
					/>
				</div>
			);
		}

		if (error) {
			return (
				<Alert message="Упс..." description="Что-то пошло не так, попробуйте повторить позже" type="error" />
			)
		};

		if (loading) {
			return (
				<div className="loader">
					<Spin size="large" />
				</div>
			);
		};

		return (
			<div className="container">
				<Menu change={change} changeMovies={this.changeMovies} />
				{ !change ? <Input
      			autoFocus
      			placeholder="Введите название фильма"
      			size="large"
      			value={newSearch}
      			onChange={(event) => this.searchMoviesInput(event.target.value)}
      			onPressEnter={(event) => this.searchMovies(event.target.value)}
      		/> : null }
				<MoviesList 
					movies={finalMovies}
					moviesGenres={moviesGenres}
					onPushRating={this.onPushRating}
					change={change}
				/>
				<Pagination
      			pageSize={20}
      			current={currentPage}
      			onChange={this.pagination}
        			total={finalMovies.length * maxPage}
					showSizeChanger={false}
					hideOnSinglePage
      		/>
			</div>
		);
	};
};