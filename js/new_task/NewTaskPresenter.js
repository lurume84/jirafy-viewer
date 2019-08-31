(function(presenters)
{
    function NewTaskPresenter(Context)
    {
        this.interactor = Context.getNewTaskInteractor();
        this.interactorSettings = Context.getSettingsInteractor();
       
        this.view = Context.getNewTaskView(this);
        this.view.init();
    }

    Object.defineProperties(NewTaskPresenter.prototype,
    {
        getIssueProject : {
            value: function(key)
            {
                var self = this;
                    
                this.interactor.getIssue(key, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onIssueProject(data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        getIssueType : {
            value: function(id)
            {
                var self = this;
                    
                this.interactor.getIssueType(id, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onIssueType(data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        getCreateIssueMeta : {
            value: function(project)
            {
                var self = this;
                    
                this.interactor.getCreateIssueMeta(project, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onCreateIssueMeta(data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        getSettings : {
            value: function()
            {
                var self = this;
                    
                this.interactorSettings.load(new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onLoadSettings(data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        setSetting : {
            value: function(setting, value)
            {
                var self = this;
                this.interactorSettings.load(new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        data[setting] = value;
                        
                        self.interactorSettings.save(data, new viewer.listeners.BaseDecisionListener(
                        function()
                        {
                            self.view.onSaveSetting(data);
                        },
                        function(data)
                        {
                            self.view.showError(data);
                        }));
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        getUserDefs : {
            value: function()
            {
                var self = this;
                    
                this.interactor.loadUserDefs(new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onLoadUserDefs(data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        setUserDefs : {
            value: function(setting, value)
            {
                var self = this;
                this.interactor.loadUserDefs(new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        data[setting] = value;
                        
                        self.interactor.saveUserDefs(data, new viewer.listeners.BaseDecisionListener(
                        function()
                        {
                            self.view.onSaveUserDefs(data);
                        },
                        function(data)
                        {
                            self.view.showError(data);
                        }));
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        }
    });

    presenters.NewTaskPresenter = NewTaskPresenter;
})(viewer.presenters);