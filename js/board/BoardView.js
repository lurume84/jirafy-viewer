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
                
                $(document).on("login", function ()
                {    
                    self.presenter.getIssueTypes();
                });
            },
            enumerable: false
        },
        load : {
            value: function(data)
            {
                var self = this;
                
                $(".modal-dialog").load("js/board/template.html", function()
                {
                    self.template = $(this);
                    
                    var board = self.template.find(".body li").detach();
                    
                    self.dialog = $(this).find(".board-dialog");
                    
                    self.dialog.find(".mdl-button.close").click(function()
                    {
                        self.dialog[0].close();
                    });
                   
                    var boards = self.template.find(".body");
                    
                    $.each(data.values, function()
                    {
                        var clone = board.clone();
                        clone.html(this.name);
                        
                        var id = this.id;
                        var name = this.name;
                        
                        clone.click(function()
                        {
                            self.presenter.setSetting("board", {id: id, name: name});
                        }).appendTo(boards);
                    });
                    
                    self.dialog[0].showModal();
                });
            },
            enumerable: false
        },
        onSprint : {
            value: function(data)
            {
                var self = this;
                
                $.each(data.values, function()
                {
                    self.presenter.getIssues(this.originBoardId, this.id, self.issueTypes);
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
                        $.xhrPool.abortAll();
                        
                        $(".menu-item").removeClass("active");
                        $(this).addClass("active");
                    }) 
                });
                
                $(".playlists-list").trigger("loaded", data);
            },
            enumerable: false
        },
        changeBoard : {
            value: function(id, name)
            {
                var self = this;
                
                $(".playlists > h2").html("");
                
                $("<i/>", {class: "iconMenu fas fa-exchange-alt"}).click(function()
                {
                   self.presenter.getBoards();
                }).appendTo($(".playlists > h2"));
                
                $("<div/>", {class: "title", html: name}).appendTo($(".playlists > h2"));
                $(".playlists-list").html("");
                
                this.presenter.getSprint(id);
            },
            enumerable: false
        },
        onLoadSettings : {
            value: function(data)
            {
                if(data.board != undefined)
                {
                    this.changeBoard(data.board.id, data.board.name);
                }
                else
                {
                    self.presenter.getBoards();
                }
            },
            enumerable: false
        },
        onSaveSetting : {
            value: function(data)
            {
                this.changeBoard(data.board.id, data.board.name);
                this.dialog[0].close();
            },
            enumerable: false
        },
        onIssueTypes : {
            value: function(data)
            {
                this.issueTypes = data;
                this.presenter.getSettings();
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