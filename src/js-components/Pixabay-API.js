import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '32549780-8d52bdcb46ac07f381f032420';

export default class PixabayApiService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.perPage = 200;
    this.currentTotalPage = 0;
  }

  async fetchPictures() {
    this.currentTotalPage = this.page * this.perPage;
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: this.perPage,
      },
    });

    this.page += 1;
    return response.data;
  }

  get query() {
    return this.query;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  resetPage() {
    this.page = 1;
  }
  resetCurrentTotalPage() {
    this.currentTotalPage = 0;
  }
}
