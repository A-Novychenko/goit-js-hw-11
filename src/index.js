import PixabayApiService from './js-components/Pixabay-API';
import Notiflix from 'notiflix';
import createMarkup from './js-components/create-card-markup';

import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  alertError: false,
});

const options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

const pixabayApiService = new PixabayApiService();
const observer = new IntersectionObserver(onInfinityLoad, options);

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.js-gallery'),
  loadMore: document.querySelector('.js-load-more'),
  guard: document.querySelector('.guard'),
};

let currentPage = 1;

refs.form.addEventListener('submit', onSearch);
// refs.loadMore.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  clearCard();
  pixabayApiService.resetPage();
  // pixabayApiService.resetCurrentTotalPage();
  pixabayApiService.query = e.currentTarget.searchQuery.value;
  fetchCard();
}

// function onLoadMore() {
//   fetchCard();

//   refs.loadMore.setAttribute('hidden', 'true');
// }

function fetchCard() {
  let totalPage = 0;

  pixabayApiService
    .fetchPictures()
    .then(pictures => {
      console.log(pictures);

      totalPage = Math.ceil(pictures.totalHits / pixabayApiService.perPage);

      if (!pictures.hits.length) {
        Notiflix.Notify.failure(
          '(Таких изображений не найдено!)Sorry, there are no images matching your search query. Please try again.'
        );
        pixabayApiService.resetPage();

        return;
      }

      if (pixabayApiService.page === 2) {
        Notiflix.Notify.info(
          `(Ура! Мы нашли изображения: ) Hooray! We found ${pictures.totalHits} images.`
        );
      }

      observer.observe(refs.guard);
      const markup = createMarkup(pictures.hits);
      refs.gallery.insertAdjacentHTML('beforeend', markup);
      lightbox.refresh();
      refs.loadMore.removeAttribute('hidden');
      // scroll();
      console.log('следущая страница:', pixabayApiService.page);
      console.log('текущая страница:', currentPage);
      console.log('К-во страниц', totalPage);

      if (currentPage >= totalPage) {
        observer.unobserve(refs.guard);

        Notiflix.Notify.warning(
          "(Сожалеем, но вы достигли конца результатов поиска) We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(err => {
      console.log(err.message);
      Notiflix.Notify.failure(
        '(2Таких изображений не найдено!)Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

function clearCard() {
  refs.gallery.innerHTML = '';
}

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function onInfinityLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      fetchCard();
      currentPage += 1;
      // if (pixabayApiService.currentTotalPage === 500) {
      //   observer.unobserve(refs.guard);
      //   return;
      // }
    }
  });
}
