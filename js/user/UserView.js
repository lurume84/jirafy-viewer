(function(views)
{
    var self;

    function UserView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(UserView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;

                this.issues = [];
                
                $(".playlists-list").on("loaded", function (evt, data)
                {             
                    self.issues = data.issues;
                });
                
                $(document).on("login", function (evt, data)
                {
                    self.presenter.getUser(data.name);
                });
                
                $(document).on("user_profile", function (evt, key)
                {
                    $.xhrPool.abortAll();
                    self.presenter.getSettings(key);
                });
            },
            enumerable: false
        },
        load : {
            value: function(data)
            {
                var self = this;
                
                $("<img/>", {src: data.avatarUrls["48x48"]}).appendTo($(".current-user-widget"));
                $("<a/>", {class: "user-email", href: "#", html: data.displayName}).click(function()
                {
                    $(".menu-item").removeClass("active");
                    $(".current-user-widget").addClass("active");
                    
                    self.presenter.getSettings(data.key);
                }).appendTo($(".current-user-widget"));
                
                var container = $("<div/>", {class: "dropdown-container", dropdown: ""});
            
                $("<i/>", {class: "icon icon-cog edit-profile dropdown-trigger"}).click(function()
                {
                    $(document).trigger("setup");
                }).appendTo(container);
                $("<div/>", {class: "dropdown-menu hidden"}).appendTo(container);
            
                container.appendTo($(".current-user-widget"));
                
                $("<div/>", {class: "menu-item", html: "<i class=\"icon icon-calendar-1\"></i>This week"}).appendTo($(".your-music-list")).click(function()
                {
                    $.xhrPool.abortAll();
                    
                    $(".menu-item").removeClass("active");
                    $(this).addClass("active");
                    
                    self.presenter.getSettings(data.key);
                });
                
                $("<div/>", {class: "menu-item", html: "<i class=\"icon icon-users\"></i>Assigned to me"}).appendTo($(".your-music-list")).click(function()
                {
                    $.xhrPool.abortAll();
                    
                    $(".menu-item").removeClass("active");
                    $(this).addClass("active");
                    
                    self.presenter.getSettings(data.key, 1);
                });
            },
            enumerable: false
        },
        onProfile : {
            value: function(data, tab)
            {
                var self = this;
                
                $(".main-view").load("js/user/template.html", function()
                {
                    self.template = $(this);
                    
                    self.progress = self.template.find(".worklog-progress");
                    componentHandler.upgradeElement(self.progress[0]);
                    
                    self.row = self.template.find(".album-table .rows .flex-table-row").detach();
                    
                    self.template.find(".inner-header .avatar img").attr("src", data.avatarUrls["48x48"]);
                    self.template.find(".info .username").html(data.displayName);
                    
                    self.template.find(".navigation .nav-item").click(function()
                    {
                        $.xhrPool.abortAll();
                        
                        self.progress.show();
                        
                        $(this).addClass("active").siblings().removeClass("active");
                        self.template.find(".tabs > div").eq($(this).index()).removeClass("hidden").siblings().addClass("hidden");
                        
                        switch($(this).index())
                        {
                            case 0:
                                var monday = moment().startOf('isoweek');
                    
                                self.template.find(".weekday").eq(0).find(".title span").html(monday.format('D'));
                                self.template.find(".weekday").eq(1).find(".title span").html(monday.add(1, "days").format('D'));
                                self.template.find(".weekday").eq(2).find(".title span").html(monday.add(1, "days").format('D'));
                                self.template.find(".weekday").eq(3).find(".title span").html(monday.add(1, "days").format('D'));
                                self.template.find(".weekday").eq(4).find(".title span").html(monday.add(1, "days").format('D'));
                                
                                self.days = [];
                                self.total = 0;
                                
                                self.presenter.getWorklog(moment().startOf('isoweek').valueOf(), moment().endOf('isoweek').valueOf(), data.key);
                                break;
                            case 1:
                                self.template.find(".tasks .rows").html("");
                                
                                var issues = [];
                                $.each(self.issues, function()
                                {
                                    issues.push(this.key);
                                });
                                
                                self.progress.show();
                                self.presenter.getIssues(data.key, issues);
                            break;
                        }
                    });
                    
                    $(this).find(".navigation .nav-item").eq(tab).trigger("click");
                }); 
            },
            enumerable: false
        },
        onSubtasks : {
            value: function(data)
            {
                var self = this;
                
                $.each(data.issues, function()
                {
                    self.onSubtask(this);
                });
                
                this.progress.hide();
            },
            enumerable: false
        },
        onSubtask : {
            value: function(data)
            {
                $(".main-view .no-playlists").hide();
                $(".main-view .album-table").removeClass("hidden");
                
                var clone = this.row.clone();
                
                clone.find(".pause-icon").hide();
                clone.find(".playing-icon-container").hide();
                clone.find(".remove-track").hide();
                clone.find(".track-added").hide();
                clone.find(".track-name .ellipses").html(data.key);
                $("<img/>", {src: data.fields.issuetype.iconUrl}).appendTo(clone.find(".add-remove-track"));
                clone.find(".artist-name .artists").html(data.fields.summary);
                clone.find(".album-name .ellipses").html(data.fields.parent.key);
                
                if(data.fields.timetracking != undefined && data.fields.timetracking.originalEstimateSeconds != undefined)
                {
                    var time = secondsToHHMMSS(data.fields.timetracking.originalEstimateSeconds);
                    clone.find(".track-duration").html(time.hours + ":" + time.minutes);
                }
                
                if(this.settings.status.closed.find(function(x){return x == data.fields.status.id;}) == undefined)
                {
                    $("<div/>", {class: "popularity-widget", html: "<div class=\"popularity-fill\" style=\"width: " + data.fields.progress.percent + "%\"></div>"}).appendTo(clone.find(".popularity"));
                }
                else
                {
                    $("<i/>", {class: "icon icon-ok"}).appendTo(clone.find(".popularity"));
                    clone.addClass("complete");
                }
                
                clone.dblclick(function() 
                {
                    $(document).trigger("play", data.key);
                });
                
                clone.find(".play-icon").click(function() 
                {
                    $(document).trigger("play", data.key);
                });
                
                clone.contextmenu(function(evt) 
                {
                    $(document).trigger("context-menu", {key: data.key, pos: {left:evt.pageX,top:evt.pageY}});
                    evt.preventDefault();
                });
                
                clone.appendTo($(".album-table .rows"));
                
                clone.find(".track-index").html(clone.index() + 1);
            },
            enumerable: false
        },
        onWorklog : {
            value: function(seconds, date)
            {
                var day = moment(date).day();
                var weekday = this.template.find(".worklog .weekday").eq(day - 1);
                
                weekday.removeClass("disabled");
                
                if(weekday != undefined)
                {
                    var hours = weekday.find(".hours").html("");
                    var rates = weekday.find(".rates").html("");
                
                    if(this.days[day] == undefined)
                    {
                        this.days[day] = 0;
                    }
                    
                    this.days[day] += seconds;
                    
                    this.total += seconds;
                    
                    var secondsLeft = (40 * 60 * 60) - this.total;
                    
                    var countdown = this.template.find(".countdown");
                    
                    if(secondsLeft > 0)
                    {
                        var time = secondsToHHMMSS(secondsLeft);
                        countdown.html(time.hours + " hours " + time.minutes + " minutes left");
                    }
                    else
                    {
                        countdown.html("Happy weekend!");
                    }
                    
                    countdown.removeClass("hidden");
                    
                    var time = secondsToHHMMSS(this.days[day]);
                    
                    $("<span/>", {class: "", html: time.hours + ":" + time.minutes}).appendTo(hours);
                    
                    var rate = (this.days[day] / (60 * 60 * 8));
                    
                    if(rate < 1)
                    {
                        var trend = round((rate - 1) * 100, 2);
                        $("<span/>", {class: "", html: "<span class='icomoon-trending-down red-fg'></span><span class='trend red-fg'>" + trend + "%</span> of target"}).appendTo(rates);
                    }
                    else
                    {
                        var trend = Math.abs(round((1 - rate) * 100, 2));
                        $("<span/>", {class: "", html: "<span class='icomoon-trending-up green-fg'></span><span class='trend green-fg'>" + trend + "%</span> of target"}).appendTo(rates);
                    }
                }
            },
            enumerable: false
        },
        onWorklogModified : {
            value: function(ids)
            {
                // this.max = ids.length;
                // this.cnt = 0;
            },
            enumerable: false
        },
        onWorklogList : {
            value: function()
            {
                // this.cnt++;
                // this.progress[0].MaterialProgress.setProgress(((this.cnt + 1) / this.max) * 100);
                // componentHandler.upgradeElement(this.progress[0]);
                
                this.progress.hide();
            },
            enumerable: false
        },
        onLoadSettings : {
            value: function(key, tab, data)
            {
                this.settings = data;
                this.presenter.getProfile(key, tab);
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

    views.UserView = UserView;
})(viewer.views);