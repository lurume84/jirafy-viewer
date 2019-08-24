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

                var issues = [];
                
                $(".playlists-list").on("loaded", function (evt, data)
                {             
                    issues = data.issues;
                });
                
                $(document).on("login", function ()
                {             
                    var menu = $("<div/>", {class: "menu-item", href: "", html: "Explore"});
                    menu.appendTo($(".left-panel-inner .content .main-menu"));
                    menu.click(function()
                    {
                        $(".menu-item").removeClass("active");
                        $(this).addClass("active");
                
                        $(".main-view").load("js/explore/template.html", function()
                        {
                            self.figure = $(this).find("figure.album").detach();
                            
                            $.each(issues, function()
                            {
                                self.presenter.getIssue(this.key);
                            }); 
                            
                            var ps = new PerfectScrollbar($(".albums-page")[0], { suppressScrollX: true });
                        });
                    });
                });
            },
            enumerable: false
        },
        onSubtask : {
            value: function(data)
            {
                var cover = this.figure.clone();
                
                var user = data.fields.assignee;
                
                if(user != undefined)
                {
                    var container = $(".albums-page").find("section.albums");
                    
                    if(container.find("figure." + user.key).length == 0)
                    {
                        cover.addClass(user.key);
                        cover.find(".image img").attr("src", user.avatarUrls["48x48"]);
                        cover.find(".title").html(user.displayName);
                        cover.find(".subtitle span").html("1");
                        cover.click(function()
                        {
                           $(document).trigger("user_profile", user.key); 
                        });
                        cover.appendTo(container);
                    }
                    else
                    {
                        var cnt = container.find("figure." + user.key + " .subtitle span");
                        cnt.html(parseInt(cnt.html(), 10) + 1);
                    }
                }
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