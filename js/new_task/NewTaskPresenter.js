(function(presenters)
{
    function NewTaskPresenter(Context)
    {
        this.interactor = Context.getNewTaskInteractor();
       
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
    });

    presenters.NewTaskPresenter = NewTaskPresenter;
})(viewer.presenters);