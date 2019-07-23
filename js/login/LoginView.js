(function(views)
{
    var self;

    function LoginView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(LoginView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;

                $(document).ready(function ()
                {             
                    $("#login")[0].showModal();
                    $("#login form").submit(function(evt)
                    {
                        $("#login .progress").show();
                        $("#login .submit").hide();
                        self.presenter.login($("#login .server").val(), $("#login .user").val(), $("#login .password").val());
                        evt.preventDefault();
                    });
                    
                    componentHandler.upgradeAllRegistered();
                    
                    self.drawEyes();
                    
                    self.presenter.checkToken();
                });
            },
            enumerable: false
        },
        drawEyes : {
            value: function()
            {
                var canvas = $(".canvas")[0], context = canvas.getContext("2d");
                  
                var size = 9;

                var rect = canvas.getBoundingClientRect();
                canvas.width = size * 2 + 15;
                canvas.height = size + 10;

                onMouseMove({clientX: 0, clientY: 0});

                document.addEventListener("mousemove", onMouseMove);

                function onMouseMove(event)
                {
                    var x = event.clientX - rect.left,
                        y = event.clientY - rect.top;
                        
                    context.clearRect(0, 0, size * 2 + 20, size + 20);

                    drawEye(x, y, size / 2 + 5, size / 2 + 5);
                    drawEye(x, y, size * 2.5 + 5, size / 2 + 5);
                }

                function drawEye(x, y, cx, cy)
                {
                    var dx = x - cx,
                        dy = y - cy,
                        angle = Math.atan2(dy, dx);
                        
                    context.save();
                    context.fillStyle = "#FFFFFF";
                    context.translate(cx, cy);
                    context.rotate(angle);
                    // context.beginPath();
                    // context.arc(0, 0, size / 2, 0, Math.PI * 2);
                    // context.stroke();
                    context.beginPath();
                    context.arc(size * 0.4, 0, size * 0.17, 0, Math.PI * 2);
                    context.fill();
                    context.restore();
                }
            },
            enumerable: false
        },
        load : {
            value: function(data)
            {
                $("#login .progress").hide();
                $("#login")[0].close();
                
                $(document).trigger( "login");
            },
            enumerable: false
        },
        showError : {
            value: function(data)
            {
                $("#login .progress").hide();
                $("#login .submit").show();
                
                document.querySelector('#toast').MaterialSnackbar.showSnackbar({message: data.message});
            },
            enumerable: false
        }
    });

    views.LoginView = LoginView;
})(viewer.views);