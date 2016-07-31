var app = angular.module('YoutubeDJ', []);

// Run

app.run(function() {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});


// Config

app.config(function($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

// Service

app.service('VideosService', ['$window', '$rootScope', '$log', function($window, $rootScope, $log) {

    var service = this;

    var youtube = {
        ready: false,
        player: null,
        playerId: null,
        videoId: null,
        videoTitle: null,
        playerHeight: '640',
        playerWidth: '640',
        state: 'stopped'
    };
    var results = [];
    var upcoming = [{
        id: 'q9xNhcvZ6UI',
        title: 'Phil Collins -Sussudio-'
    }, {
        id: 'xvhhbnMaxBI',
        title: 'Genesis - In Too Deep'
    }, {
        id: '82GhAzjSLSw',
        title: "Baba O'Riley"
    }, {
        id: 'XTsAqVK4FWQ',
        title: 'Everything She Wants (Remastered)'
    }, {
        id: 'HTJkB_hV3Zw',
        title: 'Me & U'
    }, {
        id: 'WZL_i8x48Hw',
        title: 'Midnight City M83 Lyrics'
    }, {
        id: 'ctRjcaAKKtI',
        title: 'Glamorous'
    }];
    var history = [{
        id: 'IYG8TSUa4jM',
        title: 'Hip To Be Square'
    }];

    $window.onYouTubeIframeAPIReady = function() {
        $log.info('Youtube API is ready');
        youtube.ready = true;
        service.bindPlayer('placeholder');
        service.loadPlayer();
        $rootScope.$apply();
    };

    function onYoutubeReady(event) {
        $log.info('YouTube Player is ready');
        youtube.player.cueVideoById(history[0].id);
        youtube.videoId = history[0].id;
        youtube.videoTitle = history[0].title;
    }

    function onYoutubeStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING) {
            youtube.state = 'playing';
        } else if (event.data == YT.PlayerState.PAUSED) {
            youtube.state = 'paused';
        } else if (event.data == YT.PlayerState.ENDED) {
            youtube.state = 'ended';
            service.launchPlayer(upcoming[0].id, upcoming[0].title);
            service.archiveVideo(upcoming[0].id, upcoming[0].title);
            service.deleteVideo(upcoming, upcoming[0].id);
        }
        $rootScope.$apply();
    }

    this.bindPlayer = function(elementId) {
        $log.info('Binding to ' + elementId);
        youtube.playerId = elementId;
    };

    this.createPlayer = function() {
        $log.info('Creating a new Youtube player for DOM id ' + youtube.playerId + ' and video ' + youtube.videoId);
        return new YT.Player(youtube.playerId, {
            height: youtube.playerHeight,
            width: youtube.playerWidth,
            playerVars: {
                rel: 0,
                showinfo: 0
            },
            events: {
                'onReady': onYoutubeReady,
                'onStateChange': onYoutubeStateChange
            }
        });
    };

    this.loadPlayer = function() {
        if (youtube.ready && youtube.playerId) {
            if (youtube.player) {
                youtube.player.destroy();
            }
            youtube.player = service.createPlayer();
        }
    };

    this.launchPlayer = function(id, title) {
        youtube.player.loadVideoById(id);
        youtube.videoId = id;
        youtube.videoTitle = title;
        return youtube;
    }

    this.listResults = function(data) {
        results.length = 0;
        for (var i = data.items.length - 1; i >= 0; i--) {
            results.push({
                id: data.items[i].id.videoId,
                title: data.items[i].snippet.title,
                description: data.items[i].snippet.description,
                thumbnail: data.items[i].snippet.thumbnails.default.url,
                author: data.items[i].snippet.channelTitle
            });
        }
        return results;
    }

    this.queueVideo = function(id, title) {
        upcoming.push({
            id: id,
            title: title
        });
        return upcoming;
    };

    this.archiveVideo = function(id, title) {
        history.unshift({
            id: id,
            title: title
        });
        return history;
    };

    this.deleteVideo = function(list, id) {
        for (var i = list.length - 1; i >= 0; i--) {
            if (list[i].id === id) {
                list.splice(i, 1);
                break;
            }
        }
    };

    this.getYoutube = function() {
        return youtube;
    };

    this.getResults = function() {
        return results;
    };

    this.getUpcoming = function() {
        return upcoming;
    };

    this.getHistory = function() {
        return history;
    };

}]);


// jQuery initial search

$(function() {
    function init() {
        var search = $('#submit');
        search.click();
    }
    init();
});

// Controller

app.controller('VideosController', function($scope, $http, $log, VideosService) {

    init();
    $scope.query = 'Bieber';


    function init() {
        $scope.youtube = VideosService.getYoutube();
        $scope.results = VideosService.getResults();
        $scope.upcoming = VideosService.getUpcoming();
        $scope.history = VideosService.getHistory();
        $scope.playlist = true;
    }

    $scope.launch = function(id, title) {
        VideosService.launchPlayer(id, title);
        VideosService.archiveVideo(id, title);
        VideosService.deleteVideo($scope.upcoming, id);
        $log.info('Launched id:' + id + ' and title:' + title);
    };

    $scope.queue = function(id, title) {
        VideosService.queueVideo(id, title);
        VideosService.deleteVideo($scope.history, id);
        $log.info('Queued id:' + id + ' and title:' + title);
    };

    $scope.delete = function(list, id) {
        VideosService.deleteVideo(list, id);
    };

    $scope.search = function() {
        $http.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    key: 'AIzaSyCHmNn9FLLfEso8SNLYUJ2oXbVQvClW2BE',
                    type: 'video',
                    maxResults: '8',
                    part: 'id,snippet',
                    fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
                    q: this.query
                }
            })
            .success(function(data) {
                VideosService.listResults(data);
                $log.info(data);
            })
            .error(function() {
                $log.info('Search error');
            });
    }

    $scope.tabulate = function(state) {
        $scope.playlist = state;
    }

});