(function(views)
{
    var self;

    function ExploreView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(ExploreView.prototype,
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
                
                $(document).on("login", function ()
                {             
                    var menu = $("<div/>", {class: "menu-item", href: "", html: "Explore"});
                    menu.appendTo($(".left-panel-inner .content .main-menu"));
                    menu.click(function()
                    {
                        $.xhrPool.abortAll();
                        
                        $(".menu-item").removeClass("active");
                        $(this).addClass("active");
                
                        self.presenter.getSettings();
                    });
                });
            },
            enumerable: false
        },
        loadProfile : {
            value: function(data)
            {
                var self = this;
                var user = data.fields.assignee;
                
                if(user != undefined)
                {
                    var container = $(".albums-page").find("section.albums");
                    var cover;
                    
                    if(container.find("figure." + user.key).length == 0)
                    {
                        cover = this.figure.clone();
                        
                        cover.addClass(user.key);
                        cover.find(".image img").attr("src", user.avatarUrls["48x48"]);
                        cover.find(".title").html(user.displayName);
                        cover.find(".subtitle span").html("0");
                        cover.find("figcaption").click(function()
                        {
                           $(document).trigger("user_profile", user.key); 
                        });
                        cover.appendTo(container);
                    }
                    
                    if(this.settings.status.closed.find(function(x){return x == data.fields.status.id;}) == undefined)
                    {
                        cover = container.find("figure." + user.key);
                        
                        var subtitle = cover.find(".subtitle span");
                        subtitle.html(parseInt(subtitle.html(), 10) + 1);
                        var li = $("<li/>", {});
                        li.appendTo(cover.find(".tasks"));
                        
                        li.contextmenu(function(evt) 
                        {
                            $(document).trigger("context-menu", {key: data.key, pos: {left:evt.pageX,top:evt.pageY}});
                            evt.preventDefault();
                        });
                        
                        $("<img/>", {src: data.fields.issuetype.iconUrl}).appendTo(li);
                        $("<span/>", {html: data.key + " " + data.fields.summary}).appendTo(li);
                    }
                }
            },
            enumerable: false
        },
        onIssue : {
            value: function(length)
            {
                this.numTasks += length;
            },
            enumerable: false
        },
        onSubtask : {
            value: function(data)
            {
                this.loadProfile(data);
                
                this.cnt++;
                
                componentHandler.upgradeElement(this.progress[0]);
                
                this.progress[0].MaterialProgress.setProgress(((this.cnt + 1) / this.numTasks) * 100);
                    
                if(this.cnt >= this.numTasks)
                {
                    this.progress.hide();
                }
                else
                {
                    this.progress.show();
                }
            },
            enumerable: false
        },
        onLoadSettings : {
            value: function(data)
            {
                this.settings = data;
                
                var self = this;
                
                $(".main-view").load("js/explore/template.html", function()
                {
                    self.figure = $(this).find("figure.album").detach();
                    
                    self.progress = $(this).find(".friends-progress");
                    componentHandler.upgradeElement(self.progress[0]);
                    
                    self.numTasks = 0;
                    self.cnt = 0;
                    
                    $.each(self.issues, function()
                    {
                        self.presenter.getIssue(this.key);
                    }); 
                });
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

    views.ExploreView = ExploreView;
})(viewer.views);