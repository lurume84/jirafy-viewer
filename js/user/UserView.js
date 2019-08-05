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

                $(document).on("login", function (evt, data)
                {
                    self.presenter.getUser(data.name);
                });
            },
            enumerable: false
        },
        load : {
            value: function(data)
            {
                $("<img/>", {src: data.avatarUrls["48x48"]}).appendTo($(".current-user-widget"));
                $("<a/>", {class: "user-email", href: "/user/52625", html: data.displayName}).appendTo($(".current-user-widget"));
                
                var container = $("<div/>", {class: "dropdown-container", dropdown: ""});
                
                $("<i/>", {class: "icon icon-cog edit-profile dropdown-trigger"}).appendTo(container);
                $("<div/>", {class: "dropdown-menu hidden"}).appendTo(container);
                
                container.appendTo($(".current-user-widget"));
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

    views.UserView = UserView;
})(viewer.views);