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
                    //self.presenter.getSettings();
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
                    
                    self.dialog = $(this).find(".board-dialog");
                    
                    self.dialog.find(".mdl-button.close").click(function()
                    {
                        self.dialog[0].close();
                    });
                   
                    var issuetypes = self.template.find(".body");
                    
                    $.each(data.values, function()
                    {
                        var clone = issuetype.clone();
                        clone.html(this.name);
                        
                        var id = this.id;
                        var name = this.name;
                        
                        clone.click(function()
                        {
                            self.presenter.setSetting("board", {id: id, name: name});
                        }).appendTo(issuetypes);
                    });
                    
                    self.dialog[0].showModal();
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

    views.SetupView = SetupView;
})(viewer.views);