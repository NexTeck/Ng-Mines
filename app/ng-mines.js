angular.module('app').constant('ngMines', {
    cronometro: function(vm, $scope, $interval) { 
        return function () {
            $scope.pausado = false;

            var pararCrono = $interval(function () {
                function doisDigitos(numero) {
                    if (numero < 10) return "0" + numero.toString();
                    return numero.toString();
                }

                if ($scope.pausado || $scope.gameover) return;

                vm.decorrido++;
                
                var segundos = vm.decorrido % 60;
                if (vm.decorrido / 60 < 1) {
                    vm.tempo = "0:" + doisDigitos(segundos);
                    return;
                }
                
                var minutos = Math.floor(vm.decorrido / 60) % 60;
                vm.tempo = doisDigitos(minutos) + ":" + doisDigitos(segundos);
                
                var horas = vm.decorrido / 3600;
                if (horas >= 1)
                    vm.tempo = Math.floor(horas).toString() + ":" + vm.tempo;

            }, 1000);
            
            $scope.$on('$destroy', function () {
                $interval(pararCrono);
            });
        };
    },
    revelar: function (vm) {
        return function (x, y) {
            if (vm.gameover) return;

            var terreno = vm.terrenos[x][y];

            if (terreno.estado === 'A')
                return;

            if (terreno.estado === 'F') {
                if (vm.bandeira === true) {
                    terreno.estado = 'M';
                    vm.bandeira = false;
                    return;
                }

                if (vm.primeiroClique && terreno.value === 9)
                    terreno.value = 0;

                terreno.estado = 'A';
            }

            if (terreno.estado === 'A' && terreno.value === 0) {
                var linhas = vm.terrenos.length;
                var colunas = vm.terrenos[0].length;
                function percorrer(diff1, diff2) {
                    var atual1 = { x: x, y: y };
                    while (vm.terrenos[atual1.x][atual1.y].value === 0) {
                        vm.terrenos[atual1.x][atual1.y].estado = 'A';

                        atual1.x += diff1.x;
                        atual1.y += diff1.y;

                        if (atual1.x < 0 || atual1.x === linhas ||
                            atual1.y < 0 || atual1.y === colunas) return;

                        var atual2 = { x: atual1.x, y: atual1.y };

                        while (vm.terrenos[atual2.x][atual2.y].value === 0) {
                            vm.terrenos[atual2.x][atual2.y].estado = 'A';

                            atual2.x += diff2.x;
                            atual2.y += diff2.y;

                            if (atual2.x < 0 || atual2.x === linhas ||
                                atual2.y < 0 || atual2.y === colunas) break;
                        }
                    }
                }

                percorrer({ x: 0, y: -1 }, { x: -1, y: 0 });
                percorrer({ x: -1, y: 0 }, { x: 0, y: 1 });
                percorrer({ x: 0, y: 1 }, { x: 1, y: 0 });
                percorrer({ x: 1, y: 0 }, { x: 0, y: -1 });

                percorrer({ x: 0, y: -1 }, { x: 1, y: 0 });
                percorrer({ x: -1, y: 0 }, { x: 0, y: -1 });
                percorrer({ x: 0, y: 1 }, { x: -1, y: 0 });
                percorrer({ x: 1, y: 0 }, { x: 0, y: 1 });
            }

            if (terreno.estado === 'M') {
                terreno.estado = 'F';
                return;
            }

            if (terreno.value === 9) {
                vm.gameover = true;
                terreno.value = 8;
                
                for (var i = 0; i < vm.terrenos.length; i++)
                    for (var j = 0; j < vm.terrenos[0].length; j++)
                        if (vm.terrenos[i][j].value === 9)
                            vm.terrenos[i][j].estado = 'A';
            }

            if (vm.primeiroClique) vm.primeiroClique = false;
        };
    },
    formatar: function (terreno, fator) {
        var diff = 0;
        if (fator % 12 === 0) diff = 1;
        var fontSize = Math.floor(48 / fator) - diff;
        fontSize = fontSize.toString() + (document.body.offsetHeight > document.body.offsetWidth ? 'vw' : 'vh');

        if (terreno.estado === 'F')
            return {
                'color': 'transparent',
                'background-color': 'gray',
                'background-image': 'none',
                'opacity': '0.6',
                'background-size': 'auto 80%',
                'font-size': fontSize
            }
        
        if (terreno.estado === 'M')
            return {
                'color': 'transparent',
                'background-color': '#ABA893',
                'background-image': "url('views/imgs/blackflag.png')",
                'font-size': fontSize
            }
        
        var bgSize = terreno.value === 9 || terreno.value === 8 ? 'auto 80%' : '0'
        
        var bgColor;
        if (terreno.value === 8)
            bgColor = 'red';
        else if (terreno.value === 9)
            bgColor = 'orange';
        else
            bgColor = 'transparent';
        
        var color;
        if (terreno.value === 0 || terreno.value === 9 || terreno.value === 8)
            color = 'transparent';
        else if (terreno.value === 1)
            color = 'black';
        else if (terreno.value === 2)
            color = 'blue';
        else if (terreno.value === 3)
            color = 'orangered';
        else if (terreno.value === 4)
            color = 'darkred';
        
        return {
            'background-size': bgSize,
            'background-image': "url('views/imgs/skull.png')",
            'background-color': bgColor,
            'color': color,
            'font-size': fontSize
        };
    },
    criar: function (linhas, colunas, probabilidade) {

        var campo = [];
        
        for (var i = 0; i < linhas; i++) {
            campo.push(new Array());
            for (var j = 0; j < colunas; j++) {
                var terreno = {estado: 'F', value: 0}

                if (podeInserir(i, j)) {
                    if (Math.random() <= probabilidade)
                        terreno.value = 9;
                }
                campo[i].push(terreno);
            }
        }
        rastrearPerigos();
        rastrearPerigos();

        function podeInserir(linha, coluna) {
            var posicoes = [[linha, coluna - 1], [linha - 1, coluna - 1],
                            [linha - 1, coluna], [linha - 1, coluna + 1]];
            var qt = 0;
            for (var i = 0; i < 4; i++) {
                if (posicoes[i][0] < 0 || posicoes[i][1] < 0
                        || posicoes[i][1] === colunas) continue;
                if (campo[posicoes[i][0]][posicoes[i][1]].value === 9) qt++;
            }

            if (qt > 4) return false;
            return true;
        }

        function rastrearPerigos() {
            var posicoes = [ [-1, -1], [-1, 0], [-1, 1],
                                [ 0, -1],          [ 0, 1],
                                [ 1, -1], [ 1, 0], [ 1, 1], ];

            for (var i = 0; i < linhas; i++)
                for (var j = 0; j < colunas; j++) {
                    if (campo[i][j].value === 9) continue;

                    var qt = 0;

                    for (var k = 0; k < 8; k++) {
                        var linha = i + posicoes[k][0];
                        if (linha < 0 || linha === linhas) continue;
                        var coluna = j + posicoes[k][1];
                        if (coluna < 0 || coluna === colunas) continue;

                        if (campo[linha][coluna].value === 9) qt++;
                        if (qt > 4) {
                            campo[linha][coluna].value = 0;
                            qt = 4;
                        }
                    }

                    campo[i][j].value = qt;
                }
        }

        return campo;
    }
})