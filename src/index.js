import PixabayApiService from './components/PixabayApi';
import Notiflix from 'notiflix';
import createMarkup from './components/createCardMarkup';

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
  searchBtn: document.querySelector('.search-form button'),
  gallery: document.querySelector('.js-gallery'),
  loadMore: document.querySelector('.js-load-more'),
  guard: document.querySelector('.guard'),
  textEnd: document.querySelector('.js-end-list'),
};

let totalImg = 0;

refs.form.addEventListener('submit', onSearch);
// refs.loadMore.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  totalImg = 0;

  refs.searchBtn.setAttribute('disabled', 'enabled');
  refs.searchBtn.textContent = 'loading...';
  setTimeout(() => {
    refs.searchBtn.removeAttribute('disabled');
    refs.searchBtn.textContent = 'Search';
  }, 1000);

  if (!refs.textEnd.classList.contains('is-hidden')) {
    refs.textEnd.classList.add('is-hidden');
  }

  observer.unobserve(refs.guard);
  clearCard();
  pixabayApiService.resetPage();

  if (!e.currentTarget.searchQuery.value.trim()) {
    Notiflix.Notify.failure('Please enter a valid value.');
    return;
  }
  pixabayApiService.query = e.currentTarget.searchQuery.value.trim();

  fetchCard();
}

// function onLoadMore() {
//   fetchCard();

//   refs.loadMore.setAttribute('hidden', 'true');
// }

async function fetchCard() {
  try {
    const pictures = await pixabayApiService.fetchPictures();
    // .then(pictures => {
    if (!pictures.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      pixabayApiService.resetPage();

      return;
    }

    if (pixabayApiService.page === 2) {
      Notiflix.Notify.info(`Hooray! We found ${pictures.totalHits} images.`);
    }

    observer.observe(refs.guard);
    const markup = createMarkup(pictures.hits);
    totalImg += pictures.hits.length;
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    // refs.loadMore.removeAttribute('hidden');

    // scroll();

    console.log('totalIMG', totalImg);
    console.log('totalHits', pictures.totalHits);

    if (totalImg >= pictures.totalHits) {
      observer.unobserve(refs.guard);

      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );

      if (refs.textEnd.classList.contains('is-hidden')) {
        refs.textEnd.classList.remove('is-hidden');
      }
    }
  } catch (err) {
    console.log(err.message);
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
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
    }
  });
}
