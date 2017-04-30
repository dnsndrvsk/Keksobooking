/* global Hotel: true, Gallery: true */

'use strict';

(function() {
  

  var container = document.querySelector('.hotels-list');
  var activeFilter = localStorage.getItem('activeFilter') || 'filter-all';
  var hotels = [];
  var filteredHotels = [];
  var renderedElements = [];
  var currentPage = 0;
  var PAGE_SIZE = 9;
  var gallery = new Gallery();

  // Чтобы добавить обработчики на клики, приходится пройти по всем
  // элементам и каждому из них добавить обработчик. Это трудоемкая
  // операция. Можно ли сделать так, чтобы добавлялся только один
  // обработчик сразу на все фильтры? Можно через делегирование.
  // Делегирование — прием основанный на всплытии событий.
  var filters = document.querySelector('.hotels-filters');

  // При делегировании обработчик события добавленный на один элемент
  // слушает события призошедшие на одном из дочерних элементов
  // этого элемента. На каком элементов произошло событие можно
  // проверить, обратившись к свойству target объекта Event.
  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('hotel-filter')) {
      setActiveFilter(clickedElement.id);
    }
  });

  var scrollTimeout;

  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      // Как определить что скролл внизу страницы и пора показать
      // следующую порцию отелей?
      // Проверить — виден ли футер страницы.
      // Как проверить виден ли футер страницы?
      // 1. определить положение футера относительно экрана (вьюпорта)
      var footerCoordinates = document.querySelector('footer').getBoundingClientRect();

      // 2. определить высоту экрана
      var viewportSize = window.innerHeight;

      // 3. если смещение футера минус высота экрана меньше высоты футера,
      //    футер виден хотя бы частично
      if (footerCoordinates.bottom - viewportSize <= footerCoordinates.height) {
        if (currentPage < Math.ceil(filteredHotels.length / PAGE_SIZE)) {
          renderHotels(filteredHotels, ++currentPage);
        }
      }
    }, 100);
  });

  getHotels();

  /**
   * Отрисовка списка отелей.
   * @param {Array.<Object>} hotels
   * @param {number} pageNumber
   * @param {boolean=} replace
   */
  function renderHotels(hotelsToRender, pageNumber, replace) {
    if (replace) {
      // Поскольку мы больше не работаем только с DOM-элементом
      // компоненты, нужно переписать удаление. Для начала нужно
      // сохранить все отрисованные компоненты в еще один массив.
      var el;
      while ((el = renderedElements.shift())) {
        container.removeChild(el.element);
        el.onClick = null;
        el.remove();
      }
    }

    var fragment = document.createDocumentFragment();

    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pageHotels = hotelsToRender.slice(from, to);
    
    renderedElements = renderedElements.concat(pageHotels.map(function(hotel) {
      var hotelElement = new Hotel();
      hotelElement.setData(hotel);
      hotelElement.render();
      // Для каждого из 50 элементов вызывается отрисовка в DOM.
      // Потенциально, это замедляет производительность в старых браузерах,
      // потому что пересчет параметров страницы будет производиться после
      // каждой вставки элемента на страницу. Чтобы этого избежать, пользуются
      // фрагментами, нодами вида DocumentFragment, которые представляют
      // собой контейн еры для других элементов.
      fragment.appendChild(hotelElement.element);
    
    
      // Показ галереи должен происходить по клику на фон отеля
      // Галерея показывает фотографии отеля. Это значит, что при нажатии на отель,
      // в галерею должны передаваться данные об отеле. Фактически, галерея является
      // еще одним способом показать отель на странице.
      //
      // Идеальным вариантом была бы обработка события на компоненте отеля,
      // которая владеет информацией об отеле, вместо обработки события
      // на DOM-элементе. Существует несколько подходов к реализации событий
      // на компонентах, а не на DOM-узлах.
      //
      // 1. Использовать единый для всего приложения объект для работы
      // c событиями. Например window. События разных компонент отличаются
      // по названию (префиксы, неймспейсы). (шаблон проектирования
      // Издатель-Подписчик, Publisher-Subscriber, Pub/Sub).
      //
      // 2. Реализовать свою обработку событий. Использовать два подхода:
      // собственная реализация событий (Google Closure Library, node.js)
      // или спользование невидимого DOM-элемента (или другого EventTarget'a).
      //
      // 3. Самый простой способ. Использование заранее определенных в объекте функций
      // обратного вызова. Аналог DOM Events Level 0 только для компонент.
      hotelElement.onClick = function() {
        gallery.setData(hotelElement._data);
        gallery.render();
      };
      
      return hotelElement;
    }));

    container.appendChild(fragment);
  }

  /**
   * Установка выбранного фильтра
   * @param {string} id
   * @param {boolean=} force Флаг, при котором игнорируется проверка
   *     на повторное присвоение фильтра.
   */
  function setActiveFilter(id, force) {
    // Предотвращение повторной установки одного и того же фильтра.
    if (activeFilter === id && !force) {
      return;
    }

    // Алгоритм
    // Подсветить выбранный фильтр
    var selectedElement = document.querySelector('#' + activeFilter);
    if (selectedElement) {
      selectedElement.classList.remove('hotel-filter-selected');
    }

    document.querySelector('#' + id).classList.add('hotel-filter-selected');

    // Отсортировать и отфильтровать отели по выбранному параметру и вывести на страницу
    // hotels будет хранить _изначальный_ список отелей, чтобы можно было отменить
    // фильтр и вернуться к изначальному состоянию списка. Array.sort изменяет
    // исходный массив, поэтому сортировку и фильтрацию будем производить на копии.
    filteredHotels = hotels.slice(0); // Копирование массива

    switch (id) {
      case 'filter-expensive':
        // Для показа сначала дорогих отелей, список нужно отсортировать
        // по убыванию цены.
        filteredHotels = filteredHotels.sort(function(a, b) {
          return b.price - a.price;
        });
        break;

      case 'filter-cheap':
        filteredHotels = filteredHotels.sort(function(a, b) {
          return a.price - b.price;
        });
        break;

      case 'filter-2stars':
        // Формирование списка отелей минимум с двумя звездами производится
        // в два этапа: отсеивание отелей меньше чем с двумя звездами
        // и сортировка по возрастанию количества звезд.
        filteredHotels = filteredHotels.sort(function(a, b) {
          return a.stars - b.stars;
        }).filter(function(item) {
          return item.stars >= 2;
        });

        break;

      case 'filter-6rating':
        filteredHotels = filteredHotels.sort(function(a, b) {
          return a.rating - b.rating;
        }).filter(function(item) {
          return item.rating >= 6;
        });
        break;
    }

    currentPage = 0;
    renderHotels(filteredHotels, currentPage, true);

    activeFilter = id;
    localStorage.setItem('activeFilter', id);
  }

  /**
   * Загрузка списка отелей
   */
  function getHotels() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/hotels.json');
    xhr.onload = function(evt) {
      var rawData = evt.target.response;
      var loadedHotels = JSON.parse(rawData);
      updateLoadedHotels(loadedHotels);
    };

    xhr.send();
  }

  /**
   * Сохранение списка отелей в переменную hotels, обновление счетчика отелей
   * и вызов фильтрации и отрисовки.
   * @param {Array.<Object>} loadedHotels
   */
  function updateLoadedHotels(loadedHotels) {
    hotels = loadedHotels;
    document.querySelector('.hotels-title-count-number').innerText = hotels.length;

    // Обработка загруженных данных (например отрисовка)
    // NB! Важный момент не освещенный в лекции — после загрузки отрисовка
    // дожна производиться не вызовом renderHotels а setActiveFilter,
    // потому что теперь механизм отрисовки работает через фильтрацию.
    setActiveFilter(activeFilter, true);
  }
  
})();
