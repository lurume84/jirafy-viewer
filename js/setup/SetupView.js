(function(views)
{
    var self;

    function SetupView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(SetupView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;
                
                $(document).on("login", function ()
                {
                    self.presenter.getSettings();
                });
                
                $(document).on("setup", function ()
                {
                    self.presenter.getSettings(true);
                });
            },
            enumerable: false
        },
        load : {
            value: function(data)
            {
                var self = this;
                
                $(".modal-dialog").load("js/setup/template.html", function()
                {
                    self.template = $(this);
                    
                    var issuetype = self.template.find(".body li").detach();
                    
                    self.dialog = $(this).find(".setup-dialog");
                    
                    self.dialog.find(".mdl-button.close").click(function()
                    {
                        self.dialog[0].close();
                        $(document).trigger("setup_complete");
                    });
                    
                    self.dialog.find(".mdl-button.confirm").click(function()
                    {
                        self.commit();
                    });
                   
                    var issuetypes = self.template.find(".body");
                    
                    $.each(data, function()
                    {
                        var clone = issuetype.clone();
                        clone.html("<img class='icon' src='" + this.iconUrl + "'/><span class='status_id'>" + this.id +"</span>" + this.name);
                        
                        var id = this.id;
                        var name = this.name;
                        
                        clone.click(function()
                        {
                            $(this).toggleClass("active");
                            self.showSelection();
                        }).appendTo(issuetypes);
                        
                        if((self.settings.status.closed.length == 0 && this.statusCategory.key == "done") || 
                        self.settings.status.closed.find(function(x){return x == id;}) != undefined)
                        {
                            clone.trigger("click");
                        }
                    });
                    
                    self.dialog[0].showModal();
                });
            },
            enumerable: false
        },
        commit : {
            value: function(data)
            {
                var self = this;
                
                this.settings.status.closed = [];
                
                $.each($(this.dialog).find(".body .setup-menu-item.active"), function()
                {
                    self.settings.status.closed.push($(this).find(".status_id").text());
                });
                            
                this.presenter.setSetting("status", this.settings.status);
            },
            enumerable: false
        },
        showSelection : {
            value: function()
            {
                var cnt = this.dialog.find(".body .setup-menu-item.active").length;
                this.dialog.find(".selection").html(cnt + " elements selected");
            },
            enumerable: false
        },
        onLoadSettings : {
            value: function(force, data)
            {
                this.settings = data;
                
                if(force)
                {
                    this.presenter.getIssueStatus();
                }
                else
                {
                    if(this.settings.status == undefined)
                    {
                        this.settings.status = {};
                    }
                    
                    if(this.settings.status.closed == undefined)
                    {
                        this.settings.status.closed = [];
                        this.presenter.getIssueStatus();
                    }
                    else
                    {
                        $(document).trigger("setup_complete");
                    }
                }
            },
            enumerable: false
        },
        onSaveSetting : {
            value: function(data)
            {
                this.dialog[0].close();
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

    views.SetupView = SetupView;
})(viewer.views);