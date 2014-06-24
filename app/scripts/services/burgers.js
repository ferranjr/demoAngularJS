'use strict';

/**
 * Our main model to deal with burgers API
 *
 **/

const API_URL = 'https://space-burgers.herokuapp.com/';

spacePortDemoApp
    .factory('burgersFactory', function( $http ) {

        $http.defaults.cache = true;

        function getBurgers() {
            return $http.get(API_URL+'burgers/');
        }

        function orderBurger( burgerId, bitcoin ) {
            var myOrder = {
                'id'        : burgerId,
                'bitcoin'   : bitcoin
            };

            return $http.post(API_URL+'burgers/', myOrder);

        }

        // Public methods API
        return {
            getBurgers   : getBurgers,
            orderBurger  : orderBurger
        };

    });