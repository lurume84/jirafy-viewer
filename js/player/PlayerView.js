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
                this.commit = false;

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
                    
                    $(".player-controls .commit-switch").click(function()
                    {
                        self.presenter.setSetting("commit", $(this).hasClass("disabled"));
                    });
                    
                    $(".player-controls .volume-container i").click(function()
                    {
                        self.presenter.setSetting("sound", $(this).hasClass("icon-volume-off-1"));
                    });
                    
                    self.presenter.getSettings();
                });
                
                $(document).on("play", function (evt, data)
                {     
                    self.assigneeElement = data.assignee;
                    self.presenter.playInfo(data.key);
                });
                
                $(document).on("login", function (evt, data)
                {
                    self.myself = data;
                });
                
                $(document).on("toastify", function (evt, code)
                {
                    switch(code)
                    {
                        case "917504":
                            if(self.playing) self.pause(); else self.play();    
                            break;
                        case "851968":
                            self.stop();
                            break;
                    }
                });
            },
            enumerable: false
        },
        onPlayInfo : {
            value: function(data)
            {
                if(this.task != undefined && this.playing)
                {
                    this.pause();
                }
                
                this.task = data;
                
                if(data.fields.status.statusCategory.key == "new" && data.transitions.length > 0)
                {
                    this.presenter.transit(data.key, data.transitions[0].id);
                }
                
                if(data.fields.assignee == undefined)
                {
                    this.presenter.assign(data.key, myself.accountId);
                }
                else
                {
                    if(this.assigneeElement != undefined && this.assigneeElement.html() == "")
                    {
                        this.assigneeElement.html(data.fields.assignee.displayName);
                    }
                    
                    this.presenter.getUncommitted();
                }
            },
            enumerable: false
        },
        onAssign : {
            value: function(key, data)
            {
                this.presenter.playInfo(key);
            },
            enumerable: false
        },
        onTransit : {
            value: function(data)
            {
                
            },
            enumerable: false
        },
        onLoadUncommitted : {
            value: function(data)
            {
                this.uncommitted = data[this.task.key];
                
                if(this.uncommitted == undefined)
                {
                    this.uncommitted = {seconds: 0, started: moment().local().format('YYYY-MM-DDTHH:mm:ss.SSSZZ')};
                }
                
                $(".current-track").removeClass("hidden");
                $(".new-playlist").addClass("hidden");
                
                $(".current-track .track-name").html(this.task.fields.summary);
                $(".current-track .artist-name .artists").html(this.task.key);
                
                if(this.task.fields.assignee != undefined)
                {
                    $(".current-track img").show();
                    $(".current-track img").attr("src", this.task.fields.assignee.avatarUrls["32x32"]);
                }
                else
                {
                    $(".current-track img").hide();
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
                    var time = secondsToHHMMSS(seconds);
                    $(".player-controls .track-length").html(time.hours + ":" + time.minutes + ":" + time.seconds);
                }
                
                this.updateTime(this);
                
                this.timer = setInterval(this.updateTime, 1000, this);
                
                document.title = this.task.fields.summary + " - " + this.task.key;
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
                
                this.uncommitted.seconds += diff / 1000;
                
                document.title = this.task.fields.summary + " - Paused";
            },
            enumerable: false
        },
        stop : {
            value: function()
            {
                if(this.startDate != undefined)
                {
                    this.pause();
                }
                
                if(this.commit)
                {
                    var data = {};
                    data[this.task.key] = this.uncommitted;
                    $(document).trigger("commit", data);
                }
                
                this.task = undefined;
                this.uncommitted = undefined;
                
                $(".current-track").addClass("hidden");
                $(".new-playlist").removeClass("hidden");
                
                $(".player-controls .progress-container .elapsed-time").html("00:00:00");
                $(".player-controls .track-length").html("00:00:00");
                $(".player-controls .progress-bar .elapsed").css("width", "0%");
                
                document.title = "Jirafy";
            },
            enumerable: false
        },
        updateTime : {
            value: function(self)
            {
                if(self.playing)
                {
                    var diff = ((Date.now() - self.startDate));
                    
                    diff += (self.uncommitted.seconds * 1000);
                    
                    var time = secondsToHHMMSS(diff / 1000);
                    
                    $(".player-controls .progress-container .elapsed-time").html(time.hours + ":" + time.minutes + ":" + time.seconds);
                    
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
                var uncommitted = $(".left-panel-inner .content .main-menu .menu-item:first-child");
                
                if(uncommitted.hasClass("active"))
                {
                    uncommitted.trigger("click");
                }
            },
            enumerable: false
        },
        onLoadSettings : {
            value: function(data)
            {
                if(data["commit"] == undefined || !data["commit"])
                {
                    $(".player-controls .commit-switch").addClass("disabled");
                    this.commit = false;
                }
                else
                {
                    $(".player-controls .commit-switch").removeClass("disabled");
                    this.commit = true;
                }
                
                if(data["sound"] == undefined || !data["sound"])
                {
                    $(".player-controls .volume-container i").removeClass("icon-volume-up-1").addClass("icon-volume-off-1");
                }
                else
                {
                    $(".player-controls .volume-container i").removeClass("icon-volume-off-1").addClass("icon-volume-up-1");
                }
            },
            enumerable: false
        },
        onSaveSetting : {
            value: function(data)
            {
                this.onLoadSettings(data);
            },
            enumerable: false
        },
        showError : {
            value: function(data)
            {
                showError(data);
            },
            enumerable: false
        }
    });

    views.PlayerView = PlayerView;
})(viewer.views);