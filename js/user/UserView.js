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
                    var template = $(this);
                    
                    self.row = template.find(".album-table .rows .flex-table-row").detach();
                    
                    template.find(".inner-header .avatar img").attr("src", data.avatarUrls["48x48"]);
                    template.find(".info .username").html(data.displayName);
                    
                    template.find(".navigation .nav-item").click(function()
                    {
                        $(this).addClass("active").siblings().removeClass("active");
                        template.find(".tabs > div").eq($(this).index()).removeClass("hidden").siblings().addClass("hidden");
                        self.ps.update();
                    });
                    
                    $.each(self.issues, function()
                    {
                        self.presenter.getIssue(data.key, this.key);
                    });
                    
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
            value: function(data)
            {
                console.log(data);
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