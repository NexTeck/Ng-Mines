(function() {
    'use strict';

    angular.module('app', [
        'ui.router'
    ]).config(rotas);

    rotas.$inject = ['$stateProvider', '$urlRouterProvider'];

    function rotas($stateProvider, $urlRouterProvider) {
        
        $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'views/menu.html'
        })
        .state('preJogo', {
            url: '/preJogo',
            templateUrl: 'views/preJogo.html',
            controller: function () { }
        })
        .state('jogo', {
            url: '/jogo?linhas&colunas&prob',
            templateUrl: 'views/jogo.html',
            controller: 'jogoController'
        })
        .state('sobre', {
            url: '/sobre',
            templateUrl: 'views/sobre.html'
        });

        $urlRouterProvider.otherwise('/home');

    }
})();
