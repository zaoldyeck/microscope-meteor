Template.postSubmit.events({
    'submit form': function (e) {
        e.preventDefault();

        var post = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        };

        Meteor.call('postInsert', post, function (error, result) {
            //顯示錯誤信息並退出
            if (error)
                return alert(error.reason);

            //顯示結果，跳轉頁面
            if (result.postExists)
                alert('This link has already been posted（該鏈接已經存在）');

            Router.go('postPage', {_id: result._id});
        });
    }
});