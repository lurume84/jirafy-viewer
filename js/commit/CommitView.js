(function(views)
{
    var self;

    function CommitView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(CommitView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;

                $(document).on("commit", function (evt, data)
                {             
                    self.data = data;
                    self.index = 0;
                    
                    $(".modal-dialog").load("js/commit/template.html", function()
                    {
                        self.template = $(this).find(".commit-task").detach();
                        
                        var dialog = $(this).find(".commit-dialog");
                        
                        dialog.find(".mdl-button.close").click(function()
                        {
                            dialog[0].close();
                        });
                        
                        dialog.find(".mdl-button.confirm").click(function()
                        {
                            self.commit();
                        });
                        
                        self.scrolllbar = new PerfectScrollbar($(".mdl-dialog__content")[0], { suppressScrollX: true });
                        
                        self.next();
                        
                        dialog[0].showModal();
                    });
                });
            },
            enumerable: false
        },
        onIssue : {
            value: function(element, data)
            {
                $("<img/>", {src: data.fields.assignee.avatarUrls["48x48"]}).appendTo(element.find(".header .image"));
                element.find(".header .info .sub-name").html(data.fields.summary);
                
                // element.find(".album-name .ellipses").html(data.fields.parent.key);
            },
            enumerable: false
        },
        next : {
            value: function()
            {
                var key = Object.keys(this.data)[this.index]
                
                var seconds = this.data[key];
                var clone = this.template.clone();
                
                clone.find(".header .info .name").html(key);
                clone.find("#commit-timespent").val(moment.utc(seconds*1000).format('HH:mm:ss'));
                
                clone.appendTo($(".commit-dialog .mdl-dialog__content"));
                
                clone.find("input[name=adjustEstimate]").change(function()
                {
                    clone.find("input[name=newEstimate]").prop("disabled", this.value != "new");
                    clone.find("input[name=adjustmentAmount]").prop("disabled", this.value != "manual");
                });
                
                this.scrolllbar.update();
                componentHandler.upgradeAllRegistered();
                
                this.presenter.getIssue(clone, key);
            },
            enumerable: false
        },
        commit : {
            value: function()
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

    views.CommitView = CommitView;
})(viewer.views);