import { useState, useEffect } from 'react';

export const useArtistCarousel = (users) => {
	const [activeId, setActiveId] = useState(users[0]?.id);
	const [direction, setDirection] = useState('left');

	useEffect(() => {
		const interval = setInterval(() => {
			const currentIndex = users.findIndex((u) => u.id === activeId);
			const nextIndex = (currentIndex + 1) % users.length;
			setDirection('left'); // Always moving forward in auto-play
			setActiveId(users[nextIndex].id);
		}, 5000);
		return () => clearInterval(interval);
	}, [users, activeId]);

	const handleMouseEnter = (user) => {
		const currentIndex = users.findIndex((u) => u.id === activeId);
		const newIndex = users.findIndex((u) => u.id === user.id);
		if (currentIndex !== newIndex) {
			setDirection(newIndex > currentIndex ? 'left' : 'right');
			setActiveId(user.id);
		}
	};

	return {
		activeId,
		direction,
		handleMouseEnter,
		setActiveId
	};
};
