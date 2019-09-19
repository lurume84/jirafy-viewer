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
                });
                
                $(".new-playlist").click(function()
                {
                    self.onNewTask();
                });
                
                $(".current-track .add-track").click(function()
                {
                    self.onNewTask();
                });
                
                $(document).on("login", function (evt, data)
                {
                    self.myself = data;
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
                        self.templateDialog = $(this).find(".task-template-dialog");
                    
                        componentHandler.upgradeAllRegistered();
                    
                        self.dialog.find(".mdl-button.close").click(function()
                        {
                            self.dialog[0].close();
                        });
                    
                        self.dialog.find(".mdl-button.confirm").click(function()
                        {
                            self.commit();
                        });
                        
                        self.dialog.find(".mdl-button.save").click(function()
                        {
                            self.save();
                        });
                        
                        var dropdown = self.dialog.find(".dropdown").html("").change(function(element, element2)
                        {
                            self.onUserStory($(this).find("option:selected").index());
                        });
                        
                        $.each(self.issues, function()
                        {
                            $("<option/>", {value: this.key, name: "parent", text: this.fields.summary}).appendTo(dropdown);
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
                
                    this.issuetype = us.fields.issuetype.id;
                
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
                label.appendTo(this.dialog.find(".body .user-story > .label").html(""));
                
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
                    
                    var dropdown = $("<select/>", {class: "dropdown", name: "issuetype"}).change(function()
                                    {
                                        var sel = $(this).find("option:selected");
                                        
                                        self.settings["issuetype"][self.issuetype].default_subtask = sel.val();
                                        
                                        self.presenter.setSetting("issuetype", self.settings["issuetype"]);
                                        
                                        self.onClickIssueType(sel.index());
                                    }).appendTo($(self.dialog.find(".body .issuetype")));
                    
                    self.issuetypes = [];
                    
                    self.project = data.projects[0].key;
                    
                    $.each(data.projects[0].issuetypes, function()
                    {
                        if(this.subtask)
                        {
                            self.issuetypes.push(this);
                            $("<option/>", {value: this.id, text: this.name}).appendTo(dropdown);
                        }
                    });
                    
                    self.presenter.getSettings();
                }
            },
            enumerable: false
        },
        onClickIssueType : {
            value: function(index)
            {
                var self = this;
                
                var issueType = this.issuetypes[index];
                
                var fields = this.dialog.find(".body .fields").html("");
                var worklog = this.dialog.find(".body .worklog").html("");
                
                var label = $("<label/>", {class: "label", html: issueType.name});
                $("<img/>", {src: issueType.iconUrl}).prependTo(label);
                label.appendTo(this.dialog.find(".body .issuetypeLabel").html(""));
                
                this.presenter.getUserDefs();
                
                $.each(issueType.fields, function(key)
                {
                    switch(this.schema.type)
                    {
                        case "string":
                            if(this.allowedValues == undefined)
                            {
                                if(this.schema.system == "description" || this.schema.custom == "com.atlassian.jira.plugin.system.customfieldtypes:textarea")
                                {
                                    $("<textarea/>", {class: "fieldNewTask", name: key, placeholder: this.name}).appendTo(fields);
                                }
                                else
                                {
                                    $("<input/>", {class: "fieldNewTask", name: key, placeholder: this.name}).appendTo(fields);
                                }
                            }
                            else
                            {
                                var dropdown = $("<select/>", {class: "dropdown fieldNewTask", name: key}).appendTo(fields);
                                
                                $("<option/>", {disabled: "disabled", selected: "selected", text: this.name}).appendTo(dropdown);
                                
                                $.each(this.allowedValues, function()
                                {
                                    $("<option/>", {value: this.id, text: this.value}).appendTo(dropdown);
                                });
                            }
                            break;
                        case "timetracking":
                            $("<input/>", {class: "fieldNewTask timetracking", name: "originalEstimate", placeholder: "Original Estimate"}).appendTo(fields);
                            $("<input/>", {class: "fieldNewTask timetracking", name: "remainingEstimate", placeholder: "Remaining Estimate"}).appendTo(fields);
                        break;
                    }
                    
                    if(this.schema.system == "worklog")
                    {
                        $("<input/>", {class: "fieldNewTask worklog", name: "TimeSpent", placeholder: "Time spent"}).appendTo(worklog);
                    }
                });
            },
            enumerable: false
        },
        onLoadSettings : {
            value: function(data)
            {
                this.settings = data;
                
                if(this.settings["issuetype"] == undefined)
                {
                    this.settings["issuetype"] = {};
                }
                
                if(this.settings["issuetype"][this.issuetype] == undefined)
                {
                    this.settings["issuetype"][this.issuetype] = {};
                }
                
                var first;
                
                if(this.settings["issuetype"][this.issuetype].default_subtask != undefined)
                {
                    first = this.dialog.find("select[name=issuetype] option[value=" + this.settings["issuetype"][this.issuetype].default_subtask + "]");
                }
                else
                {
                    first = this.dialog.find("select[name=issuetype] option:first-child");
                }
                        
                first.attr("selected", "selected");
                
                this.onClickIssueType(first.index());
            },
            enumerable: false
        },
        onSaveSetting : {
            value: function(data)
            {
                
            },
            enumerable: false
        },
        commit : {
            value: function()
            {
                var content = {};
                
                content.fields = {};
                
                content.fields.project = {"key": this.project};

                $.each(this.dialog.find(".fieldNewTask:not(.worklog):not(.timetracking)"), function()
                {
                    if($(this).is("select"))
                    {
                        content.fields[this.name] = {"id": this.value};
                    }
                    else
                    {
                        content.fields[this.name] = this.value;
                    }
                });
                
                content.fields.assignee = {"name": this.myself.name};
                content.fields.parent = {"key": this.dialog.find("select[name=user-story]").val()};
                content.fields.issuetype = {"id": this.dialog.find("select[name=issuetype]").val()};
                
                content.fields["timetracking"] = {"originalEstimate": this.dialog.find("input[name=originalEstimate]").val(),
                                          "remainingEstimate": this.dialog.find("input[name=remainingEstimate]").val()};
                                          
                
                var timespent = this.dialog.find("input[name=TimeSpent]").val()
                
                if(timespent != "")
                {
                    content.update = {"worklog" : [
                                                    {
                                                        "add": {
                                                            "timeSpent": timespent,
                                                            "started": moment().local().format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
                                                        }
                                                    }
                                                  ]};
                }
                
                this.presenter.createIssue(content);
            },
            enumerable: false
        },
        save : {
            value: function()
            {
                var self = this
                var task = {fields: [], autoclose: self.dialog.find(".mdl-switch__input").prop("checked")};
                
                var templateDialog = this.templateDialog;
                
                templateDialog[0].showModal();
                
                templateDialog.find(".mdl-button.close").click(function()
                {
                    templateDialog[0].close();
                });
            
                templateDialog.find(".mdl-button.confirm").click(function()
                {
                    $.each(self.dialog.find(".fieldNewTask"), function()
                    {
                        task.fields.push($(this).val());
                    });
                    
                    var name = templateDialog.find(".body input").val();
                    
                    self.userdefs.tasks[self.issuetype][name] = task;
                    
                    self.presenter.setUserDefs("tasks", self.userdefs.tasks);
                    
                    templateDialog[0].close();
                });
            },
            enumerable: false
        },
        onLoadUserDefs : {
            value: function(data)
            {
                var self = this;
                
                if(data.tasks != undefined)
                {
                    if(data.tasks[this.issuetype] != undefined)
                    {
                        var dropdown = $("<select/>", {class: "dropdown", name: "template"}).appendTo(this.dialog.find(".body .template"));
                                        
                        $("<option/>", {disabled: "disabled", selected: "selected", text: "Load user-defined task"}).appendTo(dropdown);
                        
                        $.each(data.tasks[this.issuetype], function(name)
                        {
                            $("<option/>", {value: name, text: name}).appendTo(dropdown);
                        });
                        
                        dropdown.change(function()
                        {
                            var selection = $(this).find("option:selected").val();
                         
                            var task = data.tasks[self.issuetype][selection];
                         
                            $.each(self.dialog.find(".fieldNewTask"), function(index)
                            {
                                $(this).val(task.fields[index]);
                            });
                            
                            var autoclose = self.dialog.find(".mdl-switch__input");
                            
                            if(autoclose.prop("checked") != task.autoclose)
                            {
                                autoclose.trigger("click");
                            }
                        });
                    }
                    else
                    {
                        data.tasks[this.issuetype] = {};
                    }
                }
                else
                {
                    data.tasks = {};
                    data.tasks[this.issuetype] = {};
                }
                
                this.userdefs = data;
            },
            enumerable: false
        },
        onSaveUserDefs : {
            value: function(data)
            {
                
            },
            enumerable: false
        },
        onCommit : {
            value: function(data)
            {
                //data = {id: "56849", key: "ALBA-6629", self: "http://snowserver.systelab.net:8081/rest/api/2/issue/56849"};
                
                if(this.dialog.find(".transition > label.is-checked") != undefined)
                {
                    this.presenter.getIssue(data.key);
                }
            },
            enumerable: false
        },
        onIssue : {
            value: function(data)
            {
                this.presenter.transit(data.key, data.transitions[0].id);
            },
            enumerable: false
        },
        onTransit : {
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

    views.NewTaskView = NewTaskView;
})(viewer.views);