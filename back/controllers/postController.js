import { createPost, findPostById, findAllPosts, deletePost, updatePost } from '../models/post.js';

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

export const getAll = async (req, res) => {
  try {
    const posts = await findAllPosts();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не получить статьи',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await findPostById(postId);
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

    await deletePost(postId);
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await updatePost(postId, req.body, req.userId);
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};
