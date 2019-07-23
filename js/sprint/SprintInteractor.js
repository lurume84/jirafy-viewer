(function(interactors)
{
    function SprintInteractor()
    {
        
    }

    Object.defineProperties(SprintInteractor.prototype,
    {
        login : {
            value: function(server, user, password, listener)
            {
				$.ajax
				({
					type: "POST",
					url: "/token.json",
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
        }
    });

    interactors.SprintInteractor = SprintInteractor;
})(viewer.interactors);