const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class Post extends Model {}

Post.init({
  // attributes
  id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  post_type: {
    post_type: Sequelize.STRING
  },
  post_slug: {
    post_slug: Sequelize.STRING
  },
  post_excerpt: {
    post_excerpt: Sequelize.STRING
  },
  post_content: {
    post_content: Sequelize.STRING
  },
  post_author: {
    post_author: Sequelize.STRING
  },
  thumbnail: {
    thumbnail: Sequelize.STRING
  },
  post_template: {
    post_template: Sequelize.STRING
  },
  post_status: {
    post_status: Sequelize.ENUM
  },
  edited_by: {
    edited_by: Sequelize.INTEGER
  },
  publish_at: {
    publish_at: Sequelize.DATE
  },
  display: {
    display: Sequelize.STRING
  },
  language: {
    language: Sequelize.STRING
  },
  create_date: {
    create_date: Sequelize.DATE
  },
  update_time: {
    update_time: Sequelize.DATE
  },
  site: {
    site: Sequelize.STRING
  },

}, {
  sequelize,
  modelName: 'user'
  // options
});