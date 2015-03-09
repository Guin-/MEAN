var app = angular.module('flapperNews', []);

app.controller('MainCtrl', ['$scope', function($scope){
    $scope.test = 'Hello World';
    $scope.posts = [
        {title: 'post 1', upvotes: 5},
        {title: 'post 2', upvotes: 1},
        {title: 'post 3', upvotes: 4},
        {title: 'post 4', upvotes: 6},
        {title: 'post 5', upvotes: 2}
    ];
    $scope.addPost = function(){
        if(!$scope.title || $scope.title ===''){
            return;}
        $scope.posts.push({title: $scope.title , upvotes: 0});
        $scope.title=''; // resets title
    };
}]);
