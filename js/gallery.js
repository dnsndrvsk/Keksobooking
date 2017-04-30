'use strict';

(function() {
  // Инкапсуляция в JavaScript реализуется несколькими способами.
  // Первый нам уже знаком - объявление переменных в ограниченной
  // области видимости.
  
  // Чтобы использовать эту функцию как правильный обработчик,
  // который можно удалить, все-равно придется сохранить функцию
  // с зафиксированным контекстом в каком-то свойстве класса.
  function _onCloseClick(evt) {
    this.remove();
  }
  
  function _onMoveLeft() {
    this.moveLeft();
  }
  
  function _onMoveRight() {
    this.moveRight();
  }
  
  /**
  * @constructor
  * @extends {HotelBase}
  */
  var Gallery = function() {
    this.element = document.querySelector('.gallery-overlay');
    this._closeButton = this.element.querySelector('.gallery-overlay-close');
    this._moveLeftBtn = this.element.querySelector('.gallery-overlay-control-left');
    this._moveRightBtn = this.element.querySelector('.gallery-overlay-control-right');
    
    // Выходит, что совершенной приватности добиться невозможно.
    // Поэтому существует соглашение, гласящее, что если метод
    // или свойство начинается или заканчивается сподчеркиванием,
    // то это не предназначено для внешнего использования.
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onMoveLeft = this._onMoveLeft.bind(this);
    this._onMoveRight = this._onMoveRight.bind(this);
  };
  
  Gallery.prototype = new HotelBase();
  
  Gallery.prototype.moveLeft = function() {
    var current = this.element.querySelector('img.selected');
    if (current.previousElementSibling) {
      current.classList.remove('selected');
      current.previousElementSibling.classList.add('selected');
      var previewContainer = this.element.querySelector('.gallery-overlay-preview');
      var image = new Image();
      image.src = current.previousElementSibling.src;
      previewContainer.removeChild(previewContainer.firstChild);
      previewContainer.appendChild(image);
    }
    return;
  }

  Gallery.prototype.moveRight = function () {
    var current = this.element.querySelector('img.selected');
    if (current.nextElementSibling) {
      current.classList.remove('selected');
      current.nextElementSibling.classList.add('selected');
      var previewContainer = this.element.querySelector('.gallery-overlay-preview');
      var image = new Image();
      image.src = current.nextElementSibling.src;
      previewContainer.removeChild(previewContainer.firstChild);
      previewContainer.appendChild(image);
    }
    return;
  }
  
  /**
  * Показ галереи
  * @override
  */
  Gallery.prototype.render = function() {
    this.element.classList.remove('hidden');
    
    this._moveLeftBtn.addEventListener('click', this._onMoveLeft);
    this._moveRightBtn.addEventListener('click', this._onMoveRight);
    
    var thumbnailsContainer = this.element.querySelector('.gallery-thumbnails');
    
    this.getData().pictures.forEach(function(pic, i) {
      var picture = new Image();
      picture.height = 40;
      picture.src = pic;
      thumbnailsContainer.appendChild(picture);
    }, this);
    
    this.setCurrentImage(0);
    
    // Добавим обработчик клика по крестику для закрытия галереи
    this._closeButton.addEventListener('click', this._onCloseClick);
  };
  
  /**
  *Убирание галереи
  */
  Gallery.prototype.remove = function() {
    this.element.classList.add('hidden');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    var thumbnailsContainer = this.element.querySelector('.gallery-thumbnails');
    thumbnailsContainer.innerHTML = '';
    this._moveLeftBtn.removeEventListener('click', this._onMoveLeft);
    this._moveRightBtn.removeEventListener('click', this._onMoveRight);
  };
  
  /**
  * Обработчкик клика по крестику
  * @private
  */
  Gallery.prototype._onCloseClick = function() {
    this.remove();
  };
  
  Gallery.prototype._onMoveLeft = function() {
    this.moveLeft();
  }
  
  Gallery.prototype._onMoveRight = function() {
    this.moveRight();
  }
  
  /**
  * @param {number} i
  */
  Gallery.prototype.setCurrentImage = function(i) {
    
    this._currentImage = i;
    if (this.element.querySelector('img.selected')) {
      this.element.querySelector('img.selected').classList.remove('selected');
    }
    this.element.querySelectorAll('.gallery-thumbnails img')[i].classList.add('selected');
    
    var image = new Image();
    image.src = this._data.pictures[i];
    
    var previewContainer = this.element.querySelector('.gallery-overlay-preview');
    while (previewContainer.firstChild) {
      previewContainer.removeChild(previewContainer.firstChild);
    }
    
    previewContainer.appendChild(image);
  };
  
  window.Gallery = Gallery;
})();