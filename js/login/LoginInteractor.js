(function(interactors)
{
    function LoginInteractor()
    {
        
    }

    Object.defineProperties(LoginInteractor.prototype,
    {
        login : {
            value: function(server, user, password, listener)
            {
				$.ajax
				({
					type: "POST",
					url: "/data/token.json",
					data: JSON.stringify({server: server, token: btoa(user + ":" + password)}),
					dataType: 'json',
                    contentType: 'application/json',
					success: function (json)
					{
						listener.onSuccess(json);
					},
					error: function (jqxhr, textStatus, error)
					{
						listener.onError(jqxhr.responseJSON);
					}
				});
            },
            enumerable: false
        },
        getToken : {
            value: function(listener)
            {
				$.ajax
				({
					type: "GET",
					url: "/data/token.json",
					dataType: 'json',
                    contentType: 'application/json',
					success: function (json)
					{
						listener.onSuccess(json);
					},
					error: function (jqxhr, textStatus, error)
					{
						listener.onError(jqxhr.responseJSON);
					}
				});
            },
            enumerable: false
        },
        healthCheck : {
            value: function(listener)
            {
				$.ajax
				({
					type: "GET",
                    dataType: 'json',
                    contentType: 'application/json',
					url: credentials.server + "/rest/auth/1/session",
                    beforeSend: function(xhr) { 
						xhr.setRequestHeader("Authorization", "Basic " + credentials.token);
					},
					success: function (json)
					{
						listener.onSuccess(json);
					},
					error: function (jqxhr, textStatus, error)
					{
						listener.onError(jqxhr.responseJSON);
					}
				});
            },
            enumerable: false
        }
    });

    interactors.LoginInteractor = LoginInteractor;
})(viewer.interactors);