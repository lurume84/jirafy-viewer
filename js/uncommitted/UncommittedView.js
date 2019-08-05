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
                    var menu = $("<div/>", {class: "menu-item active", href: "", html: "Uncommited"});
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

    views.UncommittedView = UncommittedView;
})(viewer.views);