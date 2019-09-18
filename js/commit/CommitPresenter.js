(function(presenters)
{
    function CommitPresenter(Context)
    {
        this.interactor = Context.getCommitInteractor();
        this.interactorUncommitted = Context.getUncommittedInteractor();
       
        this.view = Context.getCommitView(this);
        this.view.init();
    }

    Object.defineProperties(CommitPresenter.prototype,
    {
        load : {
            value: function()
            {
                var self = this;
                    
                this.interactor.load(new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onLoad(data);
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
        getTransitions : {
            value: function(element, key)
            {
                var self = this;
                    
                this.interactor.getTransitions(key, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onTransitions(element, data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        addWorklog : {
            value: function(key, content, query)
            {
                var self = this;
                    
                this.interactor.addWorklog(key, content, query, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onAddWorklog(data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        empty : {
            value: function()
            {
                var self = this;
                    
                this.interactor.save({}, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onEmpty(data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        removeUncommitted : {
            value: function(key)
            {
                var self = this;
                this.interactorUncommitted.load(new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        if(data[key] != undefined)
                        {
                            delete data[key];
                        }
                        
                        self.interactorUncommitted.save(data, new viewer.listeners.BaseDecisionListener(
                        function(data)
                        {
                            self.view.onRemoveUncommitted(data);
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

    presenters.CommitPresenter = CommitPresenter;
})(viewer.presenters);