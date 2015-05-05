Template.postSubmit.onCreated(function () {
    Session.set('postSubmitErrors', {});
});

Template.postSubmit.helpers({
    errorMessage: function (field) {
        return Session.get('postSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
    }
});

Template.postSubmit.events({
    'submit form': function (e) {
        e.preventDefault();

        var post = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        };

        var errors = validatePost(post);
        if (errors.title || errors.url)
            return Session.set('postSubmitErrors', errors);

        Meteor.call('postInsert', post, function (error, result) {
            //向用戶顯示錯誤信息並終止
            if (error)
            // display the error to the user
                Errors.throw(error.reason);

            //顯示這個結果且繼續跳轉
            if (result.postExists)
                throwError('This link has already been posted（該鏈接已經存在）');

        });
        Router.go('postsList');
    }
});