(function()
{
    var app = angular.module('MetaQTV', []);  

    app.config(['$compileProvider', function( $compileProvider )
    {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|qw):/);
    }]);

    app.controller('MainController', function ($scope, $http, $timeout)
    {
        $scope.levelshots = ['1on1', '1on1r', '2fort5', '2fort5l', '2fort5r', '2tech4', '32seq', '32smooth', 'a2', 'aerowalk', 'amphi', 'bam4', 'bases', 'battle', 'blitzkrieg2', 'border1', 'castle', 'cmt1b', 'cmt2', 'cmt3', 'cmt4', 'cmt5b', 'death32c', 'dm1', 'dm2', 'dm3', 'dm4', 'dm5', 'dm6', 'e1m1', 'e1m2', 'e1m3', 'e1m4', 'e1m5', 'e1m6', 'e1m7', 'e1m8', 'e2m1', 'e2m2', 'e2m3', 'e2m4', 'e2m5', 'e2m6', 'e2m7', 'e3m1', 'e3m2', 'e3m3', 'e3m4', 'e3m5', 'e3m6', 'e3m7', 'e4m1', 'e4m2', 'e4m3', 'e4m4', 'e4m5', 'e4m6', 'e4m7', 'e4m8', 'endif', 'end', 'engbat', 'genders2', 'hammer', 'hammerv2', 'hammerv3', 'hippos', 'hohoho', 'hunted', 'mbases', 'pkeg1', 'povdmm4', 'qffldm2', 'qffldm5', 'rock1', 'rs_zz1', 'schloss', 'skull', 'sniprwar', 'spinev2', 'start', 'ukcldm2', 'vote40', 'well6', 'xmastree', 'xpress3', 'ztndm1', 'ztndm2', 'ztndm3', 'ztndm4', 'ztndm5', 'ztndm6'];

        $scope.mvdservers = [];

        $scope.update = function()
        {
            $http.get('/qtvservers').then(
                function success(response)
                {
                    $scope.mvdservers = [];
                    var qtvservers = response.data;
                    for (var qtvserver of qtvservers)
                    {
                        var mvdservers = qtvserver['mvdservers'];
                        for (var i in mvdservers)
                        {
                            var mvdserver = mvdservers[i];
                            if (mvdserver['players'].length)
                            {
                                if ($scope.levelshots.indexOf(mvdserver['map']) > -1)
                                {
                                    mvdserver['levelshot'] = mvdserver['map'];
                                }
                                else
                                {
                                    mvdserver['levelshot'] = '_notfound';
                                }
                                $scope.mvdservers.push(mvdserver);
                            }
                        }
                    }
                },
                function error(response)
                {
                    console.log(response);
                });
            $timeout($scope.update, 30000);
        }

        $scope.update();
    });
})();

