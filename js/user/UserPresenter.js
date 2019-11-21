(function(presenters)
{
    function UserPresenter(Context)
    {
        this.interactor = Context.getUserInteractor();
        this.interactorSettings = Context.getSettingsInteractor();
        this.interactorUncommitted = Context.getUncommittedInteractor();
        
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
        getIssues : {
            value: function(user, issues)
            {
                var self = this;
                    
                this.interactor.getIssues(user, issues, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onSubtasks(data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        getIssue : {
            value: function(element, key)
            {
                var self = this;
                    
                this.interactor.getIssue(key, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onIssue(element, data);
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
                                            self.view.onWorklog(value);
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
        },
        getUncommitted : {
            value: function()
            {
                var self = this;
                    
                this.interactorUncommitted.load(new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onLoadUncommitted(data);
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