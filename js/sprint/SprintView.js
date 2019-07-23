(function(views)
{
    var self;

    function SprintView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(SprintView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;

                $(document).on("login", function()
                {
                    
                });
            },
            enumerable: false
        },
        load : {
            value: function(data)
            {
                
            },
            enumerable: false
        },
        showError : {
            value: function(data)
            {
                document.querySelector('#toast').MaterialSnackbar.showSnackbar({message: data.message});
            },
            enumerable: false
        }
    });

    views.SprintView = SprintView;
})(viewer.views);