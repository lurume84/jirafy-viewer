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
                        $(".menu-item").removeClass("active");
                        $(this).addClass("active");
                
                        self.presenter.load();
                    });
                    
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
                            var seconds = data[key];
                            var clone = row.clone();
                            
                            clone.find(".track-index").html(index);
                            
                            clone.find(".pause-icon").hide();
                            clone.find(".playing-icon-container").hide();
                            clone.find(".remove-track").hide();
                            clone.find(".track-added").hide();
                            clone.find(".track-name .ellipses").html(key);
                            clone.find(".track-duration").html(moment.utc(seconds*1000).format('HH:mm:ss'));
                            
                            clone.appendTo($(".album-table"));
                            
                            clone.dblclick(function() 
                            {
                                $(document).trigger("play", key);
                            });
                            
                            self.presenter.getIssue(clone, key);
                            index++;
                        }
                        
                        var ps = new PerfectScrollbar($(".playlist-page")[0], { suppressScrollX: true });
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
                document.querySelector('#toast').MaterialSnackbar.showSnackbar({message: data.message});
            },
            enumerable: false
        }
    });

    views.UncommittedView = UncommittedView;
})(viewer.views);