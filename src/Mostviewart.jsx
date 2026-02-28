import React from 'react';
import './App.css';

// Components
import ArtistShowcase from './components/ArtistShowcase';

// Data
import { users } from './data/users';

// Hooks
import { useArtistCarousel } from './hooks/useArtistCarousel';

const Mostviewart = () => {
	// Custom Hooks
	const { activeId, direction, handleMouseEnter, setActiveId } = useArtistCarousel(users);

	return (
		<div className="relative min-h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black">

			<ArtistShowcase
				users={users}
				activeId={activeId}
				direction={direction}
				handleMouseEnter={handleMouseEnter}
				setActiveId={setActiveId}
			/>
		</div>
	);
};

export default Mostviewart;