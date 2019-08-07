(function(presenters)
{
    function BoardPresenter(Context)
    {
        this.interactor = Context.getBoardInteractor();
       
        this.view = Context.getBoardView(this);
        this.view.init();
    }

    Object.defineProperties(BoardPresenter.prototype,
    {
        getBoards : {
            value: function()
            {
                var self = this;
                    
                this.interactor.getBoards(new viewer.listeners.BaseDecisionListener(
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
        getSprint : {
            value: function(board)
            {
                var self = this;
                
                this.interactor.getSprint(board, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.view.onSprint(data);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        getIssues : {
            value: function(board, sprint)
            {
                var self = this;
                
                this.interactor.getIssues(board, sprint, new viewer.listeners.BaseDecisionListener(
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

    presenters.BoardPresenter = BoardPresenter;
})(viewer.presenters);