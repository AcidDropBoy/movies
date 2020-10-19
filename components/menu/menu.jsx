import React, { Component } from 'react';
import clsx from 'clsx';
import './menu.css';
import PropTypes from 'prop-types';

export default class Menu extends Component {
	static defaultProps = {
		change: false,
		changeMovies: () => {},
	};

	static propTypes = {
		change: PropTypes.bool,
		changeMovies: PropTypes.func,
	};

	render() {
   	const { change, changeMovies } = this.props;
   	return (
      	<div className="menu">
				<button 
					className={clsx('menu-btn', !change && 'active')}
					type="button" onClick={() => changeMovies(false)}
				>
					Поиск
      		</button>
      		<button
         		className={clsx('menu-btn', change && 'active')}
         		type="button"
         		onClick={() => changeMovies(true)}
      		>
         		Оценки
      		</button>
      	</div>
   	);
	}
}
