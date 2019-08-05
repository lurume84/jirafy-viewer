(function(presenters)
{
    function UncommittedPresenter(Context)
    {
        this.interactor = Context.getUncommittedInteractor();
       
        this.view = Context.getUncommittedView(this);
        this.view.init();
    }

    Object.defineProperties(UncommittedPresenter.prototype,
    {
        getList : {
            value: function()
            {
                var self = this;
                    
                this.interactor.getList(new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        }
    });

    presenters.UncommittedPresenter = UncommittedPresenter;
})(viewer.presenters);