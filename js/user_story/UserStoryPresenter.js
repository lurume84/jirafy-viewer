(function(presenters)
{
    function UserStoryPresenter(Context)
    {
        this.interactor = Context.getUserStoryInteractor();
        this.interactorSettings = Context.getSettingsInteractor();
       
        this.view = Context.getUserStoryView(this);
        this.view.init();
    }

    Object.defineProperties(UserStoryPresenter.prototype,
    {
        getSettings : {
            value: function(index)
            {
                var self = this;
                    
                this.interactorSettings.load(new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onLoadSettings(index, data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        load : {
            value: function(key)
            {
                var self = this;
                    
                this.interactor.load(key, new viewer.listeners.BaseDecisionListener(
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
        getIssues : {
            value: function(key)
            {
                var self = this;
                    
                this.interactor.getIssues(key, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onIssues(data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        }
    });

    presenters.UserStoryPresenter = UserStoryPresenter;
})(viewer.presenters);