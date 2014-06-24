'use strict';

/**
 * @ngdoc function
 * @name spacePortDemoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the spacePortDemoApp
 */
spacePortDemoApp
    .controller('MainCtrl', function( $scope, burgersFactory, $modal ) {

        $scope.burgers = [];

        $scope.lookUp = function( burgerId ) {

            $scope.selected = _.find( $scope.burgers, function( item ){ return item.id === burgerId; });

            $modal.open({
                template:   '<div class="modal-header">' +
                            '   <h3 class="modal-title">{{selected.name}}</h3>' +
                            '</div>' +
                            '<div class="modal-body">' +
                            '   <img ng-src="{{selected.image}}" class="img-responsive"/>' +
                            '   <p>{{selected.notes}}</p>' +
                            '</div>',
                size:       'm',
                scope:      $scope
            });

        };

        $scope.$watch('online', function(newStatus) {

            var isOffline = function(item) { return item.id === 'offline'; };

            if ( !newStatus && !_.some($scope.alerts, isOffline )){
                $scope.alerts.push({ type: 'info' , msg: 'You are offline' , id: 'offline' });
            }
            else if ( newStatus ) {
                var idOfflineMsg = -1;
                for ( var i in $scope.alerts ){
                    if($scope.alerts[i].id === 'offline' ) {
                        idOfflineMsg = i;
                    }
                    i++;
                }
                if (idOfflineMsg > -1 ) {
                    $scope.closeAlert(idOfflineMsg);
                }
            }
        });

        $scope.alerts = [];
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.orderBurger = function( burgerId, bitcoin ) {
            burgersFactory.orderBurger( burgerId, bitcoin)
                .success( function(response) {
                    if( response.hasOwnProperty('message') ) {
                        $scope.alerts.push({ msg: response.message, type: 'success' });
                    }
                    else if ( response.hasOwnProperty('bitcoin') ){
                        $scope.alerts.push({ msg: response.bitcoin[0] , type: 'error' , id: 'purchase' });
                    }
                });
        };

        function init() {

            burgersFactory.getBurgers()
                .success( function(data) {
                    data.burgers.forEach( function( burger ){
                        burger.image = (API_URL + burger.image).replace('//','/');
                        $scope.burgers.push(burger);
                    });
                    $scope.alerts.push({ type: 'success', msg: 'Your burger\'s catalog totally available' , id: 'catDownloaded'});
                });

        }

        init();

    })
    .directive('product', function(){
        return {
            template :  '<div class="col-sm-6 col-md-4">' +
                        '   <div class="thumbnail">' +
                        '       <div class="inner"><img ng-src="{{burger.image}}" class="img-responsive"></div>' +
                        '       <div class="caption">' +
                        '           <h4>{{burger.name}}</h4>' +
                        '           <p><a class="btn btn-primary btn-small" ng-click="lookUp( burger.id )" role="button"><span class="glyphicon glyphicon-search"></span> Notes</a> <a class="btn btn-success" role="button" data-ng-disabled="!online" ng-click="orderBurger( burger.id, burger.bitcoin )"> Order it!</a></p>' +
                        '       </div>' +
                        '       <div class="vegetarianTag" data-ng-show={{burger.vegetarian}}></div>' +
                        '       <div class="priceTag">{{burger.bitcoin}}</div>' +
                        '    </div>' +
                        '</div>'
        };
    })
    .directive('highlights', function(){
        return {
            template :  '<div style="height: 460px">' +
                        '   <carousel> ' +
                        '       <slide style="height: 460px; overflow: hidden;" ng-repeat="burger in burgers | filter:{promoted:true}" active="burger.active">' +
                        '           <img ng-src="{{burger.image}}" style="margin:auto;">' +
                        '           <div class="carousel-caption">' +
                        '              <h4>{{burger.name}}</h4>' +
                        '           </div>' +
                        '       </slide>' +
                        '   </carousel>' +
                        '</div>'
        };
    });
