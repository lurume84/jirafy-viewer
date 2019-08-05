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

                $(document).on("login", function ()
                {             
                    var menu = $("<div/>", {class: "menu-item", href: "", html: "Explore"});
                    menu.appendTo($(".left-panel-inner .content .main-menu"));
                });
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

    views.ExploreView = ExploreView;
})(viewer.views);