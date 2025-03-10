import { getPrismaClient } from '../db/index.js';

export const createPost = async (postData, userId) => {
  try {
    const post = await getPrismaClient().post.create({
      data: {
        title: postData.title,
        text: postData.text,
        imageUrl: postData.imageUrl,
        user: {
          connect: {
            id: userId
          }
        }
      },
      include: {
        user: true
      }
    });

    return post;
  } catch (error) {
    console.error('Ошибка при создании поста:', error);
    throw error;
  }
};

export const findAllPosts = async () => {
  try {
    const posts = await getPrismaClient().post.findMany({
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return posts;
  } catch (error) {
    console.error('Ошибка при получении всех постов:', error);
    throw error;
  }
};

export const findPostById = async (id) => {
  try {
    const post = await getPrismaClient().post.update({
      where: {
        id: parseInt(id)
      },
      data: {
        viewsCount: {
          increment: 1
        }
      },
      include: {
        user: true
      }
    });
    return post;
  } catch (error) {
    console.error('Ошибка при получении поста по id:', error);
    throw error;
  }
};

export const updatePost = async (id, postData, userId) => {
  try {
    const post = await getPrismaClient().post.update({
      where: {
        id: parseInt(id)
      },
      data: {
        title: postData.title,
        text: postData.text,
        imageUrl: postData.imageUrl,
        user: {
          connect: {
            id: userId
          }
        }
      }
    });
    return post;
  } catch (error) {
    console.error('Ошибка при обновлении поста:', error);
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    await getPrismaClient().post.delete({
      where: {
        id: parseInt(id)
      }
    });
    return true;
  } catch (error) {
    console.error('Ошибка при удалении поста:', error);
    throw error;
  }
};
