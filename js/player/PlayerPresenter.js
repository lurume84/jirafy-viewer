(function(presenters)
{
    function PlayerPresenter(Context)
    {
        this.interactor = Context.getPlayerInteractor();
       
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
        }
    });

    presenters.PlayerPresenter = PlayerPresenter;
})(viewer.presenters);