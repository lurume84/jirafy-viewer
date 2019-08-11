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
                this.playing = true;
                this.task = data;
                this.startDate = Date.now();
                
                $(".player-controls .icon-play").addClass("hidden");
                $(".player-controls .icon-pause").removeClass("hidden").click(function()
                {
                    $(this).addClass("hidden");
                    $(".player-controls .icon-play").removeClass("hidden");
                });
                
                if(data.fields.timetracking.remainingEstimateSeconds != undefined)
                {
                    $(".player-controls .track-length").html(moment.utc(data.fields.timetracking.remainingEstimateSeconds*1000).format('HH:mm:ss'));
                }
                
                this.timer = setInterval(this.updateTime, 1000, this);
            },
            enumerable: false
        },
        updateTime : {
            value: function(self)
            {
                var diff = ((Date.now() - self.startDate));
                $(".player-controls .progress-container .elapsed-time").html(moment.utc(diff).format('HH:mm:ss'));
                
                var percent = diff / (self.task.fields.timetracking.remainingEstimateSeconds*1000) * 100;
                if(percent > 100)
                {
                    percent = 100;
                }
                
                $(".player-controls .progress-bar .elapsed").css("width", percent + "%");
                
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