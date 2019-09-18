(function(presenters)
{
    function PlayerPresenter(Context)
    {
        this.interactor = Context.getPlayerInteractor();
        this.interactorUncommitted = Context.getUncommittedInteractor();
        this.interactorSettings = Context.getSettingsInteractor();
       
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
        transit : {
            value: function(key, id)
            {
                var self = this;
                    
                this.interactor.transit(key, id, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onTransit(data);
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
        },
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
        setSetting : {
            value: function(setting, value)
            {
                var self = this;
                this.interactorSettings.load(new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        data[setting] = value;
                        
                        self.interactorSettings.save(data, new viewer.listeners.BaseDecisionListener(
                        function()
                        {
                            self.view.onSaveSetting(data);
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
        },
        assign : {
            value: function(key, who)
            {
                var self = this;
                this.interactor.assign(key, who, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onAssign(key, data);
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