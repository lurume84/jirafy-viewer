(function(presenters)
{
    function ExplorePresenter(Context)
    {
        this.interactor = Context.getExploreInteractor();
        this.interactorSettings = Context.getSettingsInteractor();
       
        this.view = Context.getExploreView(this);
        this.view.init();
    }

    Object.defineProperties(ExplorePresenter.prototype,
    {
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
        getIssues : {
            value: function(issues)
            {
                var self = this;
                    
                this.interactor.getIssues(issues, new viewer.listeners.BaseDecisionListener(
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
    });

    presenters.ExplorePresenter = ExplorePresenter;
})(viewer.presenters);