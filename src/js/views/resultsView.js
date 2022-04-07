import View from './view';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';

class resultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = `Sorry no recipe found concerning your search ⛔🚩. Please try again`;

  _generateMarkUp() {
    return this._data.map(result => previewView.render(result, false)).join();
  }
}

export default new resultsView();
