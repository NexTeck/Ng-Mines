(function() {
'use strict';

    angular
        .module('app')
        .controller('jogoController', jogoController);

    jogoController.$inject = ['$scope', 'campoService', '$stateParams'];

    function jogoController($scope, campoService, $stateParams) {
        var linhas = parseInt($stateParams.linhas);
        var colunas = parseInt($stateParams.colunas);
        var prob = parseFloat($stateParams.prob);
        
        $scope.pausado = false;
        $scope.gameover = false;

        $scope.terrenos = campoService.criar(linhas, colunas, prob);

        $scope.bandeira = false;
    }
})();
