(function() {
    'use strict';

    angular
        .module('app')
        .directive('campo', campo);

    campo.$inject = [];
    function campo() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: campoController,
            controllerAs: 'campo',
            restrict: 'E',
            templateUrl: 'views/campo.html',
            scope: {
                terrenos: '=campo',
                bandeira: '=bandeira',
                gameover: '=gameover'
            }
        };
        return directive;
    }

    campoController.$inject = ['ngMines'];

    function campoController (ngMines) {
        var vm = this;
        vm.primeiroClique = true;
        
        vm.revelar = ngMines.revelar(vm);
        
        vm.formatar = ngMines.formatar;
    }
})();