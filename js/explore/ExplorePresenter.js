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
        getIssue : {
            value: function(key)
            {
                var self = this;
                    
                this.interactor.getIssue(key, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        $.each(data.fields.subtasks, function()
                        {
                            self.getSubtask(this.key);
                        });
                        
                        self.view.onIssue(data.fields.subtasks.length);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        },
        getSubtask : {
            value: function(key)
            {
                var self = this;
                    
                this.interactor.getSubtask(key, new viewer.listeners.BaseDecisionListener(
                    function(data)
                    {
                        if(g_status_map.closed[data.fields.status.id] == undefined)
                        {
                            self.view.onOpenedSubtask(data);
                        }
                        
                        self.view.onSubtask(data);
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