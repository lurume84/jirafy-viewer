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
            },
            enumerable: false
        },
        onTransitions : {
            value: function(element, data)
            {
                $.each(data.transitions, function(index)
                {
                    var transition = $("<div/>", {class: "radio", html: 
                    "    <label class=\"transitionRadio mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"transition-" + (index + 1) + "\">" +
                    "      <input type=\"radio\" id=\"transition-" + (index + 1) + "\" class=\"mdl-radio__button\" name=\"transition\" value=\"" + this.id + "\">" +
                    "      <span class=\"mdl-radio__label\">" + this.name + "</span>" +
                    "    </label>" +
                    "</div>"});
                    
                    transition.appendTo(element.find(".info3 > .radios"));
                    
                    $.each(this.fields, function()
                    {
                        if(this.schema.type == "string")
                        {
                            var field = "<textarea class=\"fieldTransition transition-" + (index + 1) + " hidden\" placeholder=\"" + this.name + "\"></textarea>";
                            
                            element.find(".info3 > .fields").append(field);
                        }
                    });
                });
                
                element.find(".transitionRadio input").change(function()
                {
                    element.find(".fieldTransition").addClass("hidden");
                    element.find("." + this.id).removeClass("hidden");
                })
                
                componentHandler.upgradeAllRegistered();
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
                this.presenter.getTransitions(clone, key);
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