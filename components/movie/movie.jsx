import React, { Component } from 'react';
import './movie.css';
import 'antd/dist/antd.css';
import { Card, Image, Typography, Rate } from 'antd';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import noimg from './noimg.jpg'

const { Title, Text } = Typography;

export default class Movie extends Component {
	state = {
		ratingValue: 0,
	};

	static defaultProps = {
		id: 0,
		title: '',
		rating: 0,
		overview: '',
		posterParh: '',
		releaseDate: new Date(),
		voteAverage: 0,
		genreIds: [],
		moviesGenres: [],
		onPushRating: () => {},
	};

	static propTypes = {
		id: PropTypes.number,
		title: PropTypes.string,
		rating: PropTypes.number,
		overview: PropTypes.string,
		posterParh: PropTypes.string,
		releaseDate: PropTypes.instanceOf(),
		voteAverage: PropTypes.number,
		genreIds: PropTypes.arrayOf(PropTypes.object),
		moviesGenres: PropTypes.arrayOf(PropTypes.object),
		onPushRating: PropTypes.func,
	};

	componentDidMount() {
		const { rating } = this.props;
		this.setState({ ratingValue: rating });
	}

	getColorRating(rating) {
		if (rating <= 3) return { color: '#E90000' };
		if (rating > 3 && rating <= 5) return { color: '#E97E00' };
		if (rating > 5 && rating <= 7) return { color: '#E9D100' };
		return { color: '#E97E00' };
	};

	changeRating = (ratingValue) => {
		const { onPushRating, id } = this.props;
		this.setState({ ratingValue });
		onPushRating(id, ratingValue);
	};

	customDescription(description) {
		if (description.length <= 170) return description
		const newDescription = description.slice(0,169).split(' ');
		newDescription.pop();
		newDescription.push(' ...');
		return newDescription.join(' ');
	}

	render() {
		const {
      	title,
      	overview,
      	posterParh,
      	releaseDate,
      	voteAverage,
			genreIds,
			moviesGenres,
		} = this.props;

		const { ratingValue } = this.state;
		const description = this.customDescription(overview);
		const colorRating = this.getColorRating(voteAverage);
   	const genres = moviesGenres.filter((item) => genreIds.includes(item.id));
   	const genresName = genres.map((item) => {
      	return (
      		<Text code key={item.id}>
         		{item.name}
      		</Text>
      	);
		});
		
		return (
			<div className="movie">
      		<Card size="small" hoverable>
					<Image height={270} src={posterParh ? `http://image.tmdb.org/t/p/w440_and_h660_face/${posterParh}` : noimg} />
         		<div className="text-content">
						<Title level={4}>{title}</Title>
         			<div>
         				<Text type="secondary">
								{releaseDate ? format(new Date(releaseDate), 'MM/dd/yyyy') : 'Дата неизвестна'}
							</Text>
         			</div>
         			<div className="movie-genres">{genresName}</div>
         			<div>{description}</div>
						<Rate count={10} onChange={this.changeRating} value={ratingValue} allowHalf />
         		</div>
					<div className="rate" style={colorRating}>
            		{voteAverage}
         		</div>
         	</Card>
      	</div>
		);
	};
};