import './css/styles.css';
import PixabayApiService from './js-components/Pixabay-API';
import Notiflix from 'notiflix';

const pixabayApiService = new PixabayApiService();

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.js-gallery'),
  loadMore: document.querySelector('.js-load-more'),
};

refs.form.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  clearCard();
  pixabayApiService.resetPage();
  pixabayApiService.query = e.currentTarget.searchQuery.value;
  fetchCard();
}

function onLoadMore() {
  fetchCard();
  refs.loadMore.setAttribute('hidden', 'true');
}

function fetchCard() {
  pixabayApiService
    .fetchPictures()
    .then(pictures => {
      console.log(pictures);
      if (!pictures.hits.length) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      createMarkup(pictures.hits);
      refs.loadMore.removeAttribute('hidden');
    })
    .catch(err => {
      console.log(err.message);
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

function clearCard() {
  refs.gallery.innerHTML = '';
}

function createMarkup(arr) {
  const markup = arr.reduce(
    (
      acc,
      { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
    ) => {
      return (
        acc +
        `<div class="photo-card">
           <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
            <p class="info-item">
            <b>Likes: ${likes}</b>
            </p>
            <p class="info-item">
            <b>Views: ${views}</b>
            </p>
            <p class="info-item">
            <b>Comments: ${comments}</b>
            </p>
            <p class="info-item">
            <b>Downloads: ${downloads}</b>
            </p>
        </div>
     </div>`
      );
    },
    ''
  );

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
