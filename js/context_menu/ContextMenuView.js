(function(views)
{
    var self;

    function ContextMenuView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(ContextMenuView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;

                $(document).on("context-menu", function (evt, data)
                {             
                    self.key = data.key;
                    
                    $("#context-menu").load("js/context_menu/template.html", function()
                    {
                        self.presenter.getIssue(self.key);
                        
                        $(this).find(".context-menu-item").click(function()
                        {
                            switch($(this).index())
                            {
                                case 0:
                                    self.presenter.setUncommitted(data.key, 5*60);
                                    break;
                                case 1:
                                    self.presenter.setUncommitted(data.key, 15*60);
                                    break;
                                case 2:
                                    self.presenter.setUncommitted(data.key, 30*60);
                                    break;
                                case 3:
                                    self.presenter.setUncommitted(data.key, 60*60);
                                    break;
                            }
                        });
                        
                        componentHandler.upgradeAllRegistered();
                        
                        $(this).offset(data.pos);
                        $(this).show();
                    });
                });
                
                $(document).mouseup(function(e)
                {
                    var container = $("#context-menu");

                    if (!container.is(e.target) && container.has(e.target).length === 0) 
                    {
                        container.offset({left: 0, top: 0});
                        container.hide();
                        container.html("");
                    }
                });
            },
            enumerable: false
        },
        onIssue : {
            value: function(data)
            {
                if(data.fields.assignee != undefined)
                {
                    $("<img/>", {src: data.fields.assignee.avatarUrls["48x48"]}).appendTo($("#context-menu .header .image").html(""));
                }
                else
                {
                    $("#context-menu .header .image").remove();
                }
                
                $("#context-menu .header .info .name").html(data.key);
                $("#context-menu .header .info .sub-name").html(data.fields.summary);
            },
            enumerable: false
        },
        onSaveUncommitted : {
            value: function(data)
            {
                var container = $("#context-menu");
                
                container.offset({left: 0, top: 0});
                container.hide();
                container.html("");
                
                var uncommitted = $(".left-panel-inner .content .main-menu .menu-item:first-child");
                
                if(uncommitted.hasClass("active"))
                {
                    uncommitted.trigger("click");
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

    views.ContextMenuView = ContextMenuView;
})(viewer.views);