(function(interactors)
{
    function SettingsInteractor()
    {
        
    }

    Object.defineProperties(SettingsInteractor.prototype,
    {
        load : {
            value: function(listener)
            {
				$.ajax
				({
					type: "GET",
					url: "/data/settings.json",
					dataType: 'json',
                    contentType: 'application/json',
					success: function (json)
					{
						listener.onSuccess(json);
					},
					error: function (jqxhr, textStatus, error)
					{
                        if(jqxhr.status == 404)
                        {
                            listener.onSuccess({});
                        }
                        else
                        {
                            listener.onError(jqxhr);
                        }
					}
				});
            },
            enumerable: false
        },
        save : {
            value: function(data, listener)
            {
				$.ajax
				({
					type: "POST",
					url: "/data/settings.json",
					data: JSON.stringify(data),
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

    interactors.SettingsInteractor = SettingsInteractor;
})(viewer.interactors);