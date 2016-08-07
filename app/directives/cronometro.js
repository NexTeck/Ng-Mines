(function() {
    'use strict';

    angular
        .module('app')
        .directive('cronometro', cronometro);

    function cronometro() {
        return {
            bindToController: true,
            controller: cronometroController,
            controllerAs: 'cronometro',
            restrict: 'EA',
            template: '{{cronometro.tempo}}'
        };
    }
    
    cronometroController.$inject = ['$scope', '$interval', 'ngMines'];

    function cronometroController ($scope, $interval, ngMines) {
        var vm = this;
        vm.tempo = "0:00";
        vm.decorrido = 0;

        (vm.iniciar = ngMines.cronometro(vm, $scope, $interval))();

        vm.pausar = function () { $scope.pausado = true; };
        vm.retomar = function () { $scope.pausado = false; };
    }

})();
