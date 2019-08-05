(function(presenters)
{
    function UserPresenter(Context)
    {
        this.interactor = Context.getUserInteractor();
       
        this.view = Context.getUserView(this);
        this.view.init();
    }

    Object.defineProperties(UserPresenter.prototype,
    {
        getUser : {
            value: function(userName)
            {
                var self = this;
                    
                this.interactor.getUser(userName, new viewer.listeners.BaseDecisionListener(
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
        }
    });

    presenters.UserPresenter = UserPresenter;
})(viewer.presenters);