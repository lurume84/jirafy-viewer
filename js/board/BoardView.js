(function(views)
{
    var self;

    function BoardView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(BoardView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;

                this.ps = new PerfectScrollbar($(".content")[0], {    
                    suppressScrollX: true
                });
                
                $(document).on("login", function ()
                {    
                    self.presenter.getBoards();
                });
            },
            enumerable: false
        },
        load : {
            value: function(data)
            {
                $("<div/>", {class: "title", html: data.values[0].name}).appendTo($(".playlists > h2"));
                var button = $("<i/>", {class: "iconMenu fas fa-exchange-alt"});
                
                button.appendTo($(".playlists > h2"));
                
                var boards = $("<ul/>", {class: "mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect", 
                                html: ""});
                 
                $.each(data.values, function()
                {
                    $("<li/>", {class: "mdl-menu__item", html: this.name}).appendTo(boards);
                });
                                
                boards.appendTo($(".playlists > h2"));
                
                componentHandler.upgradeAllRegistered();
                componentHandler.upgradeElements(boards[0]);
                
                this.presenter.getSprint(data.values[0].id);
            },
            enumerable: false
        },
        onSprint : {
            value: function(data)
            {
                var self = this;
                
                $.each(data.values, function()
                {
                    self.presenter.getIssues(this.originBoardId, this.id);
                });
            },
            enumerable: false
        },
        onIssues : {
            value: function(data)
            {
                $.each(data.issues, function()
                {
                    var us = $("<div/>", {class: "menu-item", "us-id": this.key, html: "<i><img src='" + this.fields.issuetype.iconUrl + "'></i> " + this.fields.summary}).appendTo($(".playlists-list"));
                
                    us.click(function()
                    {
                        $(".menu-item").removeClass("active");
                        $(this).addClass("active");
                    }) 
                });
                
                this.ps.update();
                
                $(".playlists-list").trigger("loaded", data);
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

    views.BoardView = BoardView;
})(viewer.views);