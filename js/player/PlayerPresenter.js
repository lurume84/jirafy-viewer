(function(presenters)
{
    function PlayerPresenter(Context)
    {
        this.interactor = Context.getPlayerInteractor();
        this.interactorUncommitted = Context.getUncommittedInteractor();
       
        this.view = Context.getPlayerView(this);
        this.view.init();
    }

    Object.defineProperties(PlayerPresenter.prototype,
    {
        playInfo : {
            value: function(key)
            {
                var self = this;
                    
                this.interactor.load(key, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onPlayInfo(data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        getUncommitted : {
            value: function()
            {
                var self = this;
                    
                this.interactorUncommitted.load(new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onLoadUncommitted(data);
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
                            data[key] = 0;
                        }
                        
                        data[key] += seconds;
                        
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

    presenters.PlayerPresenter = PlayerPresenter;
})(viewer.presenters);