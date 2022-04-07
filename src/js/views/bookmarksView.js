import View from './view';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';

class bookmarkView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = `Sorry no bookmark yet. Please find a nice recipe of your liking ;)`;

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkUp() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join();
  }
}

export default new bookmarkView();
