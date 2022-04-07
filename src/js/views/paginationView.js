import View from './view';
import icons from 'url:../../img/icons.svg';

class paginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkUp() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );

    //   page 1 and other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkUpNext(curPage);
    }
    //   last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkUpPrev(curPage);
    }

    //   other page
    if (curPage < numPages) {
      return `<button data-goto ='${
        curPage - 1
      }' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
          <button data-goto ='${
            curPage + 1
          }' class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
    //   page 1 and no other pages
    return ``;
  }

  _generateMarkUpPrev(curPage) {
    return `
        <button data-goto ='${
          curPage - 1
        }' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
      `;
  }
  _generateMarkUpNext(curPage) {
    return `<button data-goto ='${
      curPage + 1
    }' class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
  }
}

export default new paginationView();
