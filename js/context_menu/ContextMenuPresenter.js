(function(presenters)
{
    function ContextMenuPresenter(Context)
    {
        this.interactor = Context.getContextMenuInteractor();
        this.interactorUncommitted = Context.getUncommittedInteractor();
       
        this.view = Context.getContextMenuView(this);
        this.view.init();
    }

    Object.defineProperties(ContextMenuPresenter.prototype,
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
        setUncommitted : {
            value: function(key, seconds)
            {
                var self = this;
                this.interactorUncommitted.load(new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        if(data[key] == undefined)
                        {
                            data[key] = {};
                            data[key].seconds = 0;
                            data[key].started = moment().local().format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
                        }
                        
                        data[key].seconds += seconds;
                        
                        self.interactorUncommitted.save(data, new viewer.listeners.BaseDecisionListener(
                        function(data)
                        {
                            self.view.onSaveUncommitted(data);
                        },
                        function(data)
                        {
                            self.view.showError(data);
                        }));
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        }
    });

    presenters.ContextMenuPresenter = ContextMenuPresenter;
})(viewer.presenters);