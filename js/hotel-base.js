'use strict';

(function() {
  /**
  * @constructor
  */
  var HotelBase = function() {};
  
  /**
  * @type {?Object}
  */
  HotelBase.prototype._data = null;
  
  HotelBase.prototype.render = function() {};
  
  HotelBase.prototype.remove = function() {};
  
  
  /**
  * @param {Object} data
  */
  HotelBase.prototype.setData = function(data) {
    this._data = data;
  };
  
   /**
  * @return {Object}
  */
  HotelBase.prototype.getData = function(data) {
    return this._data;
  };
  
  window.HotelBase = HotelBase;
})();