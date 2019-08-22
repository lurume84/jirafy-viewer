(function(presenters)
{
    function ExplorePresenter(Context)
    {
        this.interactor = Context.getExploreInteractor();
       
        this.view = Context.getExploreView(this);
        this.view.init();
    }

    Object.defineProperties(ExplorePresenter.prototype,
    {
        getIssue : {
            value: function(key)
            {
                var self = this;
                    
                this.interactor.getIssue(key, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onIssue(data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        getSubtask : {
            value: function(key)
            {
                var self = this;
                    
                this.interactor.getSubtask(key, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onSubtask(data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        }
    });

    presenters.ExplorePresenter = ExplorePresenter;
})(viewer.presenters);