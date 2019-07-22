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

                $(".eye").one("load",function()
                {
                    let svgDoc = this.contentDocument;
                    
                    let eyeBall = svgDoc.querySelector(".eyeball"),
                    pupil = svgDoc.querySelector(".pupil"),
                    eyeArea = eyeBall.getBoundingClientRect(),
                    pupilArea = pupil.getBoundingClientRect(),
                    R = eyeArea.width/2,
                    r = pupilArea.width/2,
                    centerX = eyeArea.left + R,
                    centerY = eyeArea.top + R;

                    document.addEventListener("mousemove", (e)=>{
                      let x = e.clientX - centerX,
                          y = e.clientY - centerY,
                          theta = Math.atan2(y,x),
                          angle = theta*180/Math.PI + 360;
                          
                      pupil.style.transform = `translateX(${R - r +"px"}) rotate(${angle + "deg"})`;
                      pupil.style.transformOrigin = `${r +"px"} center`;
                    });
                })
                
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
                    
                    //self.presenter.checkToken();
                });
            },
            enumerable: false
        },
        load : {
            value: function(data)
            {
                $("#login .progress").hide();
                
                var userName = $("#login .user").val();
                
                if(userName == "")
                {
                    userName = "Recovered session";
                }
                
                $(".avatar-dropdown > span").html(userName);
                $("#login")[0].close();
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