(function() {
'use strict';

    angular
        .module('app')
        .service('campoService', campoService);

    campoService.$inject = ['ngMines'];
    function campoService(ngMines) {
        this.criar = ngMines.criar;
        
        ////////////////

    }
})();