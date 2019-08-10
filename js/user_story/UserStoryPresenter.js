(function(presenters)
{
    function UserStoryPresenter(Context)
    {
        this.interactor = Context.getUserStoryInteractor();
       
        this.view = Context.getUserStoryView(this);
        this.view.init();
    }

    Object.defineProperties(UserStoryPresenter.prototype,
    {
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
        getIssue : {
            value: function(element, key)
            {
                var self = this;
                    
                this.interactor.load(key, new viewer.listeners.BaseDecisionListener(
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
        }
    });

    presenters.UserStoryPresenter = UserStoryPresenter;
})(viewer.presenters);