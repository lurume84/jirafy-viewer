(function(views)
{
    var self;

    function NewTaskView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(NewTaskView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;
                
                $(".playlists-list").on("loaded", function (evt, data)
                {
                    self.issues = data.issues;
                    
                    $(".new-playlist").click(function()
                    {
                        self.onNewTask();
                    });
                    
                    $(".current-track .add-track").click(function()
                    {
                        self.onNewTask();
                    });
                });
            },
            enumerable: false
        },
        onNewTask : {
            value: function(data)
            {
                if(this.issues.length > 0)
                {
                    var self = this;
                    
                    $(".modal-dialog").load("js/new_task/template.html", function()
                    {
                        self.dialog = $(this).find(".new-task-dialog");
                    
                        self.dialog.find(".mdl-button.close").click(function()
                        {
                            self.dialog[0].close();
                        });
                    
                        self.dialog.find(".mdl-button.confirm").click(function()
                        {
                            self.commit();
                        });
                        
                        var dropdown = self.dialog.find(".dropdown").html("").change(function(element, element2)
                        {
                            self.onUserStory($(this).find("option:selected").index());
                        });
                        
                        $.each(self.issues, function()
                        {
                            $("<option/>", {value: this.key, text: this.fields.summary}).appendTo(dropdown);
                        });
                        
                        var last = dropdown.find('option:last-child');
                        
                        last.attr("selected", "selected");
                        
                        self.onUserStory(last.index());
                        
                        self.dialog[0].showModal();
                    });
                }
            },
            enumerable: false
        },
        onUserStory : {
            value: function(index)
            {
                if(this.issues.length > 0)
                {
                    var us = this.issues[index];
                
                    this.presenter.getIssueType(us.fields.issuetype.id);
                }
            },
            enumerable: false
        },
        onIssueType : {
            value: function(data)
            {
                var issuetype = this.dialog.find(".body .issuetype").html("");
                
                var label = $("<label/>", {class: "label", html: data.name});
                $("<img/>", {src: data.iconUrl}).prependTo(label);
                label.appendTo(issuetype);
                
                this.presenter.getIssueProject(this.issues[0].key);
            },
            enumerable: false
        },
        onIssueProject : {
            value: function(data)
            {
                this.presenter.getCreateIssueMeta(data.fields.project.key);
            },
            enumerable: false
        },
        onCreateIssueMeta : {
            value: function(data)
            {
                if(data.projects.length > 0)
                {
                    var self = this;
                    
                    var dropdown = $("<select/>", {class: "dropdown"});
                    dropdown.appendTo($(self.dialog.find(".body .issuetype")));
                    
                    self.issuetypes = [];
                    
                    $.each(data.projects[0].issuetypes, function()
                    {
                        if(this.subtask)
                        {
                            self.issuetypes.push(this);
                            $("<option/>", {value: this.id, text: this.name}).appendTo(dropdown);
                        }
                    });
                }
            },
            enumerable: false
        },
        commit : {
            value: function()
            {
                
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

    views.NewTaskView = NewTaskView;
})(viewer.views);