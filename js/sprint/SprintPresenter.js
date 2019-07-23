(function(presenters)
{
    function SprintPresenter(Context)
    {
        this.interactor = Context.getSprintInteractor();
       
        this.sprintView = Context.getSprintView(this);
        this.sprintView.init();
    }

    Object.defineProperties(SprintPresenter.prototype,
    {
        login : {
            value: function(server, user, password)
            {
                var self = this;
                    
                this.interactor.login(server, user, password, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        
                    },
                    function(data)
                    {
                        self.loginView.showError(data);
                    }));
            },
            enumerable: false
        }
    });

    presenters.SprintPresenter = SprintPresenter;
})(viewer.presenters);