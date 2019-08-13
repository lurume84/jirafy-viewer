(function(views)
{
    var self;

    function PlayerView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(PlayerView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;
                
                this.playing = false;

                $(".player-controls").load("js/player/template.html", function()
                {
                    $(".player-controls .icon-play").click(function()
                    {
                        if(self.task != undefined)
                        {
                            self.play();
                        }
                    });
                
                    $(".player-controls .icon-pause").click(function()
                    {
                        self.pause();
                    });
                    
                    $(".player-controls .stop").click(function()
                    {
                        self.stop();
                    });
                });
                
                $(document).on("play", function (evt, key)
                {     
                    self.presenter.playInfo(key);
                });
            },
            enumerable: false
        },
        onPlayInfo : {
            value: function(data)
            {
                if(this.task != undefined)
                {
                    this.pause();
                }
                
                this.task = data;
                this.presenter.getUncommitted();
            },
            enumerable: false
        },
        onLoadUncommitted : {
            value: function(data)
            {
                this.uncommitted = data[this.task.key];
                
                if(this.uncommitted == undefined)
                {
                    this.uncommitted = 0;
                }
                
                $(".current-track").removeClass("hidden");
                
                $(".current-track .track-name").html(this.task.fields.summary);
                $(".current-track .artist-name .artists").html(this.task.key);
                
                if(this.task.fields.assignee != undefined)
                {
                    $(".current-track img").attr("src", this.task.fields.assignee.avatarUrls["48x48"]);
                }
                
                this.play();
            },
            enumerable: false
        },
        play : {
            value: function()
            {
                this.playing = true;
                this.startDate = Date.now();
                
                $(".player-controls .icon-play").addClass("hidden");
                $(".player-controls .icon-pause").removeClass("hidden");
                
                var seconds = this.task.fields.timetracking.remainingEstimateSeconds;
                
                if(seconds != undefined)
                {
                    $(".player-controls .track-length").html(moment.utc(seconds*1000).format('HH:mm:ss'));
                }
                
                this.updateTime(this);
                
                this.timer = setInterval(this.updateTime, 1000, this);
                
            },
            enumerable: false
        },
        pause : {
            value: function()
            {
                clearInterval(this.timer);
                
                var diff = ((Date.now() - this.startDate));
                
                this.playing = false;
                this.startDate = undefined;
                
                $(".player-controls .icon-pause").addClass("hidden");
                $(".player-controls .icon-play").removeClass("hidden");
                
                var seconds = diff / 1000;
                
                if(isNaN(seconds))
                {
                    seconds = 0;
                }
                
                this.presenter.setUncommitted(this.task.key, seconds);
                
                this.uncommitted += diff / 1000;
            },
            enumerable: false
        },
        stop : {
            value: function()
            {
                this.pause();
            },
            enumerable: false
        },
        updateTime : {
            value: function(self)
            {
                if(self.playing)
                {
                    var diff = ((Date.now() - self.startDate));
                    
                    diff += (self.uncommitted * 1000);
                    
                    $(".player-controls .progress-container .elapsed-time").html(moment.utc(diff).format('HH:mm:ss'));
                    
                    var percent = diff / (self.task.fields.timetracking.remainingEstimateSeconds*1000) * 100;
                    if(percent > 100)
                    {
                        percent = 100;
                    }
                    
                    $(".player-controls .progress-bar .elapsed").css("width", percent + "%");
                }
            },
            enumerable: false
        },
        onSaveUncommitted : {
            value: function()
            {
                
            },
            enumerable: false
        },
        showError : {
            value: function(data)
            {
                document.querySelector('#toast').MaterialSnackbar.showSnackbar({message: data.message});
            },
            enumerable: false
        }
    });

    views.PlayerView = PlayerView;
})(viewer.views);