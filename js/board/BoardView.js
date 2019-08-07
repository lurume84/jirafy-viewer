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
                var button = $("<button/>", {id: "playlist-lower-right", class: "mdl-button mdl-js-button mdl-button--icon", 
                                html: "<i class='material-icons'>more_vert</i>"});
                
                button.appendTo($(".playlists > h2"));
                
                var boards = $("<ul/>", {for: "playlist-lower-right", class: "mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect", 
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
                    $("<div/>", {class: "menu-item", alt: this.key, html: "<i><img src='" + this.fields.issuetype.iconUrl + "'></i> " + this.fields.summary}).appendTo($(".playlists-list"));
                });
                
                this.ps.update();
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

    views.BoardView = BoardView;
})(viewer.views);