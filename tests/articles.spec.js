const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const articlesService = require("../api/articles/articles.service");

describe("Test API Articles", () => {
  let token;
  const USER_ID = "fakeUserId";
  const MOCK_ARTICLE = {
    _id: "fakeArticleId",
    title: "Mon article test",
    content: "Contenu de test",
    user: USER_ID,
    status: "draft",
  };

  const MOCK_ARTICLE_CREATED = {
    title: "Nouvel article",
    content: "Contenu nouvel article",
    user: USER_ID,
    status: "draft",
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID, role: "admin" }, config.secretJwtToken);
    mockingoose(Article).toReturn([MOCK_ARTICLE], "find");
    mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "save");
    mockingoose(Article).toReturn(MOCK_ARTICLE, "findOneAndUpdate");
    mockingoose(Article).toReturn(MOCK_ARTICLE, "findOneAndDelete");
  });

  test("[Articles] Get All", async () => {
    const articles = await articlesService.getAll();
    expect(articles.length).toBeGreaterThan(0);
  });

  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_ARTICLE_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_ARTICLE_CREATED.title);
  });

  test("[Articles] Update Article", async () => {
    const res = await request(app)
      .put(`/api/articles/${MOCK_ARTICLE._id}`)
      .send({ title: "Mise à jour titre" })
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(MOCK_ARTICLE.title);
  });

  test("[Articles] Delete Article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${MOCK_ARTICLE._id}`)
      .set("x-access-token", token);
    expect([200, 204]).toContain(res.status);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
