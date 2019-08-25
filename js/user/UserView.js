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
                    self.presenter.getProfile(key);
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
                    
                    self.presenter.getProfile(data.key);
                }).appendTo($(".current-user-widget"));
                
                var container = $("<div/>", {class: "dropdown-container", dropdown: ""});
                
                $("<i/>", {class: "icon icon-cog edit-profile dropdown-trigger"}).appendTo(container);
                $("<div/>", {class: "dropdown-menu hidden"}).appendTo(container);
                
                container.appendTo($(".current-user-widget"));
                
                $("<div/>", {class: "menu-item", html: "<i class=\"icon icon-calendar-1\"></i>This week"}).appendTo($(".your-music-list")).click(function()
                {
                    $(".menu-item").removeClass("active");
                    $(this).addClass("active");
                    
                    self.presenter.getProfile(data.key);
                });
                
                $("<div/>", {class: "menu-item", html: "<i class=\"icon icon-users\"></i>Assigned to me"}).appendTo($(".your-music-list")).click(function()
                {
                    $(".menu-item").removeClass("active");
                    $(this).addClass("active");
                    
                    self.presenter.getProfile(data.key, 1);
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
                        $(this).addClass("active").siblings().removeClass("active");
                        self.template.find(".tabs > div").eq($(this).index()).removeClass("hidden").siblings().addClass("hidden");
                        self.ps.update();
                    });
                    
                    var monday = moment().startOf('isoweek');
                    
                    self.template.find(".weekday").eq(0).find(".title").append(monday.format('D'));
                    self.template.find(".weekday").eq(1).find(".title").append(monday.add(1, "days").format('D'));
                    self.template.find(".weekday").eq(2).find(".title").append(monday.add(1, "days").format('D'));
                    self.template.find(".weekday").eq(3).find(".title").append(monday.add(1, "days").format('D'));
                    self.template.find(".weekday").eq(4).find(".title").append(monday.add(1, "days").format('D'));
                    
                    $.each(self.issues, function()
                    {
                        self.presenter.getIssue(data.key, this.key);
                    });
                    
                    self.days = [];
                    
                    self.presenter.getWorklog(moment().startOf('isoweek').valueOf(), moment().endOf('isoweek').valueOf(), data.key);
                    
                    self.ps = new PerfectScrollbar($(".public-user-profile")[0], { suppressScrollX: true });
                    
                    if(tab > 0)
                    {
                        $(this).find(".navigation .nav-item").eq(tab).trigger("click");
                    }
                }); 
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
                    clone.find(".track-duration").html(moment.utc(data.fields.timetracking.originalEstimateSeconds*1000).format('HH:mm'));
                }
                
                if(g_status_map.closed[data.fields.status.id] == undefined)
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
                
                this.ps.update();
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
                    
                    $("<span/>", {class: "", html: moment.utc(this.days[day] * 1000).format("H:mm")}).appendTo(hours);
                    
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