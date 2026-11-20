import '@fontsource/mona-sans/latin-600.css';
import '@fontsource/mona-sans/latin-700.css';
import './app.css';
import { mount } from 'svelte';
import App from './App.svelte';

mount(App, { target: document.getElementById('app') as HTMLElement });
