const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '32549780-8d52bdcb46ac07f381f032420';

export default class PixabayApiService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }

  async fetchPictures() {
    console.log('ЗНАЧЕНИЕ ЗАПРОСА', this.searchQuery);
    const response = await fetch(
      `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=3`
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const pictures = await response.json();
    this.page += 1;
    return pictures;
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
}
