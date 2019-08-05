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

    presenters.ExplorePresenter = ExplorePresenter;
})(viewer.presenters);