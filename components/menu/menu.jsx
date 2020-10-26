import React, { Component } from 'react';
import clsx from 'clsx';
import './menu.css';
import PropTypes from 'prop-types';

export default class Menu extends Component {
	static defaultProps = {
		currentTab: false,
		changeMovies: () => {},
	};

	static propTypes = {
		currentTab: PropTypes.bool,
		changeMovies: PropTypes.func,
	};

	render() {
   	const { currentTab, changeMovies } = this.props;
   	return (
      	<div className="menu">
				<button 
					className={clsx('menu-btn', !currentTab && 'active')}
					type="button" onClick={() => changeMovies(false)}
				>
					Поиск
      		</button>
      		<button
         		className={clsx('menu-btn', currentTab && 'active')}
         		type="button"
         		onClick={() => changeMovies(true)}
      		>
         		Оценки
      		</button>
      	</div>
   	);
	}
}
