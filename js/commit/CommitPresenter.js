(function(presenters)
{
    function CommitPresenter(Context)
    {
        this.interactor = Context.getCommitInteractor();
       
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
    });

    presenters.CommitPresenter = CommitPresenter;
})(viewer.presenters);