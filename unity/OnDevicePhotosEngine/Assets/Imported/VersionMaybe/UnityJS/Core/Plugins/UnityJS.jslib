mergeInto(LibraryManager.library, {
    OnUnityMessage: function (json) {
        const data = JSON.parse(UTF8ToString(json));

        var message = {
            action: data.action || 'Undefined Action',
            data: data.data ? JSON.parse(data.data) : null
        };

        var event = new CustomEvent('onUnityMessage', { 'detail': message });
        document.dispatchEvent(event);
    }
});