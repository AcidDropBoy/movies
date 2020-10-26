import React, { Component } from 'react';
import './movies-list.css';
import { Col, Alert } from 'antd';
import PropTypes from 'prop-types';
import Movie from '../movie/movie';

export default class MoviesList extends Component {

	static defaultProps = {
		movies: [],
		currentTab: false,
		moviesGenres: [],
		onPushRating: () => {},
	};

	static propTypes = {
		movies: PropTypes.arrayOf(PropTypes.object),
		currentTab: PropTypes.bool,
		moviesGenres: PropTypes.arrayOf(PropTypes.object),
		onPushRating: PropTypes.func,
	};

	render() {
		const { movies, currentTab, moviesGenres, onPushRating } = this.props;
		const message = !currentTab ? 'Результатов нет' : 'У вас нет оцененных фильмов';
		const description = !currentTab
      ? 'К сожалению, по данному запросу не удалось ничего найти. Попробуйте поискать что-нибудь другое.'
		: 'Поставьте оценку фильму и он отобразится на данной странице';
		
		const moviesList = movies.map((movie) => {
			const {
				id,
				title,
				rating,
				overview,
				poster_path: posterParh,
				release_date: releaseDate,
      		vote_average: voteAverage,
      		genre_ids: genreIds,
			} = movie;
			
			return (
				<Col sm={{ span: 18 }} lg={{ span: 10 }} style={{ marginTop: 16 }} key={id} >
					<Movie 
						id={id}
						title={title}
						rating={rating}
						overview={overview}
						posterParh={posterParh}
						releaseDate={releaseDate}
						voteAverage={voteAverage}
						genreIds={genreIds}
						moviesGenres={moviesGenres}
						onPushRating={onPushRating}
					/>
				</Col>
			);
		});
		return (
			<div className="movies-list">
      		{movies.length > 0 ? (
      			moviesList
      		) : (
					<Alert message={message} description={description} type="info"/>
				)}
      </div>
		);
	};
};