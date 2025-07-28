(function($) {
    'use strict';
    
    $(document).ready(function() {
        // Handle logout button click
        $('.wangov-logout-button').on('click', function(e) {
            e.preventDefault();
            
            $.ajax({
                url: wangovId.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'wangov_logout',
                    nonce: wangovId.logoutNonce
                },
                success: function(response) {
                    if (response.success && response.data.redirect) {
                        window.location.href = response.data.redirect;
                    }
                }
            });
        });
    });
})(jQuery);
