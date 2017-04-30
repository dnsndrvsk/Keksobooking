'use strict';

(function() {
  /**
  * @param {Object} data
  * @constructor
  */
  var HotelData = function(data) {
    this.params = data;
  }
  
  // У таких объектов удобно использовать методы
  // для доступа к данным, потому что становится
  // не важно, где они находятся. Если их переименуют
  // где-то, то достаточно будет переименовать их тут
  // а не в N-ом колличестве мест.
  
  /**
  * @return {Array.<string>}
  */
  HotelData.prototype.getPictures = function() {
    return this.params.pictures;
  };
  
  /**
  * @return {number}
  */
  HotelData.prototype.getAmenities = function() {
    return this.params.amenities;
  };
  
  /**
  * @return {number}
  */
  HotelData.prototype.getDistance = function() {
    return this.params.distance;
  };
  
  /**
  * @return {Object.<string><number>}
  */
  HotelData.prototype.getLocation = function() {
    return this.params.location;
  };
  
  /**
  * @return {number}
  */
  HotelData.prototype.getPrice = function() {
    return this.params.price;
  };
  
  /**
  * @return {string}
  */
  HotelData.prototype.getName = function() {
    return this.params.name;
  };
  
  /**
  * @return {number}
  */
  HotelData.prototype.getRating = function() {
    return this.params.rating;
  };
  
  /**
  * @return {number}
  */
  HotelData.prototype.getStars = function() {
    return this.params.stars;
  };
  
  /**
  * @return {string}
  */
  HotelData.prototype.getPreview = function() {
    return this.params.preview;
  };
  
  window.HotelData = HotelData;
})();