import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '../lib/index.js';
import './app.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<div className="flex flex-wrap items-center gap-2 p-8">
			<Button variant="filled">Filled</Button>
			<Button variant="tonal">Tonal</Button>
			<Button variant="outlined" disabled>
				Disabled
			</Button>
		</div>
	</StrictMode>
);
