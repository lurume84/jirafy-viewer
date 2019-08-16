var viewer = viewer || {};
viewer.helpers = viewer.helpers || {};
viewer.presenters = viewer.presenters || {};
viewer.views = viewer.views || {};
viewer.models = viewer.models || {};
viewer.interactors = viewer.interactors || {};
viewer.listeners = viewer.listeners || {};

(function(helpers)
{
    function Context()
    {
        
    }

    Object.defineProperties(Context.prototype,
    {
        getLoginPresenter : {
            value: function()
            {
                return new viewer.presenters.LoginPresenter(this);
            },
            enumerable: false
        },
        getLoginView : {
            value: function(presenter)
            {
                return new viewer.views.LoginView(presenter);
            },
            enumerable: false
        },
        getLoginInteractor : {
            value: function()
            {
                return new viewer.interactors.LoginInteractor();
            },
            enumerable: false
        },
        getSprintPresenter : {
            value: function()
            {
                return new viewer.presenters.SprintPresenter(this);
            },
            enumerable: false
        },
        getSprintView : {
            value: function(presenter)
            {
                return new viewer.views.SprintView(presenter);
            },
            enumerable: false
        },
        getSprintInteractor : {
            value: function()
            {
                return new viewer.interactors.SprintInteractor();
            },
            enumerable: false
        },
        getUncommittedPresenter : {
            value: function()
            {
                return new viewer.presenters.UncommittedPresenter(this);
            },
            enumerable: false
        },
        getUncommittedView : {
            value: function(presenter)
            {
                return new viewer.views.UncommittedView(presenter);
            },
            enumerable: false
        },
        getUncommittedInteractor : {
            value: function()
            {
                return new viewer.interactors.UncommittedInteractor();
            },
            enumerable: false
        },
        getExplorePresenter : {
            value: function()
            {
                return new viewer.presenters.ExplorePresenter(this);
            },
            enumerable: false
        },
        getExploreView : {
            value: function(presenter)
            {
                return new viewer.views.ExploreView(presenter);
            },
            enumerable: false
        },
        getExploreInteractor : {
            value: function()
            {
                return new viewer.interactors.ExploreInteractor();
            },
            enumerable: false
        },
        getUserPresenter : {
            value: function()
            {
                return new viewer.presenters.UserPresenter(this);
            },
            enumerable: false
        },
        getUserView : {
            value: function(presenter)
            {
                return new viewer.views.UserView(presenter);
            },
            enumerable: false
        },
        getUserInteractor : {
            value: function()
            {
                return new viewer.interactors.UserInteractor();
            },
            enumerable: false
        },
        getBoardPresenter : {
            value: function()
            {
                return new viewer.presenters.BoardPresenter(this);
            },
            enumerable: false
        },
        getBoardView : {
            value: function(presenter)
            {
                return new viewer.views.BoardView(presenter);
            },
            enumerable: false
        },
        getBoardInteractor : {
            value: function()
            {
                return new viewer.interactors.BoardInteractor();
            },
            enumerable: false
        },
        getUserStoryPresenter : {
            value: function()
            {
                return new viewer.presenters.UserStoryPresenter(this);
            },
            enumerable: false
        },
        getUserStoryView : {
            value: function(presenter)
            {
                return new viewer.views.UserStoryView(presenter);
            },
            enumerable: false
        },
        getUserStoryInteractor : {
            value: function()
            {
                return new viewer.interactors.UserStoryInteractor();
            },
            enumerable: false
        },
        getPlayerPresenter : {
            value: function()
            {
                return new viewer.presenters.PlayerPresenter(this);
            },
            enumerable: false
        },
        getPlayerView : {
            value: function(presenter)
            {
                return new viewer.views.PlayerView(presenter);
            },
            enumerable: false
        },
        getPlayerInteractor : {
            value: function()
            {
                return new viewer.interactors.PlayerInteractor();
            },
            enumerable: false
        },
        getCommitPresenter : {
            value: function()
            {
                return new viewer.presenters.CommitPresenter(this);
            },
            enumerable: false
        },
        getCommitView : {
            value: function(presenter)
            {
                return new viewer.views.CommitView(presenter);
            },
            enumerable: false
        },
        getCommitInteractor : {
            value: function()
            {
                return new viewer.interactors.CommitInteractor();
            },
            enumerable: false
        },
        getContextMenuPresenter : {
            value: function()
            {
                return new viewer.presenters.ContextMenuPresenter(this);
            },
            enumerable: false
        },
        getContextMenuView : {
            value: function(presenter)
            {
                return new viewer.views.ContextMenuView(presenter);
            },
            enumerable: false
        },
        getContextMenuInteractor : {
            value: function()
            {
                return new viewer.interactors.ContextMenuInteractor();
            },
            enumerable: false
        },
        getSettingsInteractor : {
            value: function()
            {
                return new viewer.interactors.SettingsInteractor();
            },
            enumerable: false
        }
    });

    helpers.Context = Context;
})(viewer.helpers);

(function(helpers)
{
    var list =  {
                    login : "getLoginPresenter",
                    sprint: "getSprintPresenter",
                    uncommitted: "getUncommittedPresenter",
                    explore: "getExplorePresenter",
                    user: "getUserPresenter",
                    board: "getBoardPresenter",
                    user_story: "getUserStoryPresenter",
                    player: "getPlayerPresenter",
                    commit: "getCommitPresenter",
                    context_menu: "getContextMenuPresenter",
                };

    function Initializer()
    {
        var initList = initializeConfig || {};

        var context = new helpers.Context();
        for(var k in initList)
        {
            if(list.hasOwnProperty(initList[k]))
            {
                context[list[initList[k]]]();
            }
        }
    }

    helpers.Initializer = Initializer;
})(viewer.helpers);