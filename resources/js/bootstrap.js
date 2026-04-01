import axios from 'axios';
import { attachApiInterceptors } from '@/utils/toast-system';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['Accept'] = 'application/json';

attachApiInterceptors(window.axios);
