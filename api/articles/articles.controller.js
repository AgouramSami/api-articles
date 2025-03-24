const articlesService = require("./articles.service");
const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");

class ArticlesController {
  async create(req, res, next) {
    try {
      const article = await articlesService.create({
        ...req.body,
        user: req.user._id,
      });
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        throw new UnauthorizedError();
      }
      const updatedArticle = await articlesService.update(
        req.params.id,
        req.body
      );
      if (!updatedArticle) throw new NotFoundError();
      req.io.emit("article:update", updatedArticle);
      res.json(updatedArticle);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        throw new UnauthorizedError();
      }
      await articlesService.remove(req.params.id);
      req.io.emit("article:delete", { id: req.params.id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
