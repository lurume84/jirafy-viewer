(function(views)
{
    var self;

    function UncommittedView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(UncommittedView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;

                $(document).on("login", function ()
                {             
                    var menu = $("<div/>", {class: "menu-item active", href: "", html: "Uncommitted"});
                    menu.appendTo($(".left-panel-inner .content .main-menu"));
                    menu.click(function()
                    {
                        $.xhrPool.abortAll();
                        
                        $(".menu-item").removeClass("active");
                        $(this).addClass("active");
                
                        self.presenter.load();
                    });
                });
                
                $(".playlists-list").on("loaded", function (evt, data)
                {   
                    $(".menu-item").removeClass("active").eq(0).addClass("active");
                    self.presenter.load();
                });
            },
            enumerable: false
        },
        onLoad : {
            value: function(data)
            {
                var self = this;
                
                $(".main-view").load("js/uncommitted/template.html", function()
                {
                    if(Object.keys(data).length > 0)
                    {
                        $(".playlist-page .actions .primary").click(function()
                        {
                            $(document).trigger("commit", data);
                        });
                        
                        $(".playlist-page .actions .option-btn").click(function()
                        {
                            var dialog = $(".playlist-page .actions .empty-dialog");
                            
                            dialog[0].showModal();
                            
                            dialog.find(".mdl-button.close").click(function()
                            {
                                dialog[0].close();
                            });
                            
                            dialog.find(".mdl-button.confirm").click(function()
                            {
                                self.presenter.empty();
                            });
                        });
                            
                        $(".playlist-page .playlist-header").removeClass("hidden");
                        $(".playlist-page .album-table").removeClass("hidden");
                        $(".playlist-page .no-tracks").addClass("hidden");
                        
                        var row = $(this).find(".album-table .flex-table-row:nth-child(2)").detach();
                    
                        var index = 1;
                        
                        const keys = Object.keys(data)
                        for (const key of keys)
                        {
                            var seconds = data[key].seconds;
                            var clone = row.clone();
                            
                            clone.find(".track-index").html(index);
                            
                            clone.find(".pause-icon").hide();
                            clone.find(".playing-icon-container").hide();
                            clone.find(".remove-track").hide();
                            clone.find(".track-added").hide();
                            clone.find(".track-name .ellipses").html(key);
                            
                            var time = secondsToHHMMSS(seconds);
                            
                            clone.find(".track-duration").html(time.hours + ":" + time.minutes + ":" + time.seconds);
                            
                            clone.appendTo($(".album-table"));
                            
                            clone.dblclick(function() 
                            {
                                $(document).trigger("play", {key: key, assignee: undefined});
                            });
                            
                            clone.find(".play-icon").click(function() 
                            {
                                $(document).trigger("play", {key: key, assignee: undefined});
                            });
                            
                            clone.contextmenu(function(evt) 
                            {
                                $(document).trigger("context-menu", {key: key, pos: {left:evt.pageX,top:evt.pageY}});
                                evt.preventDefault();
                            });
                            
                            self.presenter.getIssue(clone, key);
                            index++;
                        }
                    }
                });
            },
            enumerable: false
        },
        onIssue : {
            value: function(element, data)
            {
                $("<img/>", {src: data.fields.issuetype.iconUrl}).appendTo(element.find(".add-remove-track"));
                element.find(".artist-name .artists").html(data.fields.summary);
                element.find(".album-name .ellipses").html(data.fields.parent.key);
            },
            enumerable: false
        },
        onEmpty : {
            value: function()
            {
                this.presenter.load();
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

    views.UncommittedView = UncommittedView;
})(viewer.views);