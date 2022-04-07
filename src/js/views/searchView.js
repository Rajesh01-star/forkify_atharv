class searchView {
  #parentEl = document.querySelector('.search');

  #cleanField() {
    this.#parentEl.querySelector('.search__field').value = '';
  }
  getQuery() {
    const query = this.#parentEl.querySelector('.search__field').value;
    this.#cleanField();
    return query;
  }

  addHandlerSearch(handler) {
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new searchView();
