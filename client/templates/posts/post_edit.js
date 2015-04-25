/**
 * Created by zaoldyeck on 2015/4/23.
 */
Template.postEdit.events({
    'submit form': function (e) {
        e.preventDefault();

        var currentPostId = this._id;

        var postProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        }

        /*
         Posts.update(currentPostId, {$set: postProperties}, function (error) {
         if (error) {
         //向用戶顯示錯誤信息
         throwError(error.reason);
         } else {
         Router.go('postPage', {_id: currentPostId});
         }
         });
         */

        //作業 內置方法
        Meteor.call('postUpdate', currentPostId, postProperties, function (error, result) {
            //顯示錯誤信息並退出
            if (error)
                return alert(error.reason);

            //顯示結果，跳轉頁面
            if (result.postExists)
                alert('This link has already been posted（該鏈接已經存在）');

            Router.go('postPage', {_id: currentPostId});
        });
    },

    'click .delete': function (e) {
        e.preventDefault();

        if (confirm("Delete this post?")) {
            var currentPostId = this._id;
            Posts.remove(currentPostId);
            Router.go('postsList');
        }
    }
});