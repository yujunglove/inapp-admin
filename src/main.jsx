import { render } from './app.jsx';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './styles/swiper-custom.css';

window.QdxInapp = { render };

export { render };

render('root');