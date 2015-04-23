Posts = new Mongo.Collection('posts');

Posts.allow({
    update: function (userId, post) {
        return ownsDocument(userId, post);
    },
    remove: function (userId, post) {
        return ownsDocument(userId, post);
    }
});

Posts.deny({
    update: function (userId, post, fieldNames) {
        //只能更改如下兩個字段：
        return ( _.without(fieldNames, 'url', 'title').length > 0 );
    }
});

Meteor.methods({
    postInsert: function (postAttributes) {
        check(Meteor.userId(), String);
        check(postAttributes, {
            title: String,
            url: String
        });

        if (Meteor.isServer) {
            postAttributes.title += "(server)";
            // wait for 5 seconds
            Meteor._sleepForMs(5000);
        } else {
            postAttributes.title += "(client)";
        }

        var postWithSameLink = Posts.findOne({url: postAttributes.url});
        if (postWithSameLink) {
            return {
                postExists: true,
                _id: postWithSameLink._id
            }
        }

        var user = Meteor.user();
        var post = _.extend(postAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date()
        });
        var postId = Posts.insert(post);
        return {
            _id: postId
        };
    },

    postUpdate: function (currentPostId, postProperties) {
        check(Meteor.userId(), String);
        check(currentPostId, String);
        check(postProperties, {
            title: String,
            url: String
        });

        var postWithSameLink = Posts.findOne({url: postProperties.url});
        if (postWithSameLink._id !== currentPostId) {
            return {
                postExists: true,
                _id: postWithSameLink._id
            }
        }

        var postId = Posts.update(currentPostId, {$set: postProperties})
        return {
            _id: postId
        };
    }
});