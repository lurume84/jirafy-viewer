(function(presenters)
{
    function UserPresenter(Context)
    {
        this.interactor = Context.getUserInteractor();
        this.interactorSettings = Context.getSettingsInteractor();
        
        this.view = Context.getUserView(this);
        this.view.init();
    }

    Object.defineProperties(UserPresenter.prototype,
    {
        getSettings : {
            value: function(key, tab = 0)
            {
                var self = this;
                    
                this.interactorSettings.load(new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onLoadSettings(key, tab, data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        getUser : {
            value: function(userName)
            {
                var self = this;
                    
                this.interactor.getUserByName(userName, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.load(data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        getProfile : {
            value: function(key, tab = 0)
            {
                var self = this;
                
                this.interactor.getUserByKey(key, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onProfile(data, tab);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        getIssue : {
            value: function(userKey, issueKey)
            {
                var self = this;
                    
                this.interactor.getIssue(issueKey, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        $.each(data.fields.subtasks, function()
                        {
                            self.getSubtask(userKey, this.key);
                        });
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        getSubtask : {
            value: function(userKey, issueKey)
            {
                var self = this;
                    
                this.interactor.getSubtask(issueKey, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        var assignee = data.fields.assignee;
                        
                        if(assignee != undefined && assignee.key == userKey)
                        {
                            self.view.onSubtask(data);
                        }
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        getWorklog : {
            value: function(beginDate, endDate, userKey)
            {
                var self = this;
                    
                this.interactor.getWorklogModified(beginDate, endDate, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        var ids = [];
                        $.each( data.values, function( key, value )
                        {
                            if(value.updatedTime < endDate)
                            {
                                ids.push(value.worklogId);
                            }
                        });

                        if(ids.length > 0)
                        {
                            self.view.onWorklogModified(ids);
                            
                            self.interactor.getWorklogList(ids, new viewer.listeners.BaseDecisionListener(
                                function(data)
                                {
                                    $.each(data, function( key, value )
                                    {
                                        if(value.author.key == userKey)
                                        {
                                            self.view.onWorklog(value.timeSpentSeconds, value.updated);
                                        }
                                    });
                                    
                                    self.view.onWorklogList(data);
                                },
                                function(data)
                                {
                                    self.view.showError(data);
                                }));
                        }
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        }
    });

    presenters.UserPresenter = UserPresenter;
})(viewer.presenters);