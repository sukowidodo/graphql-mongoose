import User from "../../../server/models/User";
import Post from "../../../server/models/Post";
import Comment from "../../../server/models/Comment";

export default {
  Query: {
    comment: async (parent, { _id }, context, info) => {
      return await Comment.find({ _id });
    },
    comments: async (parent, args, context) => {
      const res = await Comment.find({}).populate().exec();

      return res.map(comment => ({
        _id: comment._id.toString(),
        text: comment.text,
        author: comment.author,
        post: comment.post
      }));
    }
  },
  Mutation: {
    createComment: async (parent, { comment }, context, info) => {
      console.log(context)
      const newComment = await new Comment({
        text: comment.text,
        author: comment.author,
        post: comment.post
      });

      return new Promise((resolve, reject) => {
        newComment.save((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    updateComment: async (parent, { _id, comment }, context, info) => {
      return new Promise((resolve, reject) => {
        Comment.findByIdAndUpdate(
          _id,
          { $set: { ...comment } },
          { new: true }
        ).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    deleteComment: async (parent, { _id }, context, info) => {
      return new Promise((resolve, reject) => {
        Comment.findByIdAndDelete(_id).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    }
  },
  Subscription: {
    comment: {
      subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator(channel)
      }
    }
  },
  Comment: {
    author: async ({ author }, args, context, info) => {
      return await User.findById({ _id: author });
    },
    post: async ({ post }, args, context, info) => {
      return await Post.findById({ _id: post });
    }
  }
};
