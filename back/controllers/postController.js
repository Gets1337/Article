import { createPost, findById } from '../models/post.js';

export const create = async (req, res) => {
  try {
    const post = await createPost({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
    }, req.userId);
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: 'не удалось создать статью',
    });
  }
};

export const findAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);
  } catch (err) {
    res.status(500).json({
      message: 'Не получить статьи',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await findById(postId);
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не получить статьи',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          res.status(500).json({
            message: 'Не удалось удалить статью',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }
        res.json({ success: true });
      }
    ).populate('user');
  } catch (err) {
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      }
    );
    res.json({ sucess: true });
  } catch (err) {
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить тэги',
    });
  }
};
