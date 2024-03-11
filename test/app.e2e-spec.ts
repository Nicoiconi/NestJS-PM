import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Clients module', () => {

    const firstTestClientData = {
      userClerkId: "test",
      name: "test",
      description: "test",
      email: "test@mail.com",
      phone: "1234",
      buyerPosts: [],
      sellerPosts: [],
    }

    const secondTestClient = {
      userClerkId: "test2",
      name: "test2",
      description: "test2",
      email: "test2@mail.com",
      phone: "4321",
      buyerPosts: [],
      sellerPosts: [],
    }

    let createdFirstTestClient
    let createdSecondTestClient

    it('/clients/add (POST)', async () => {

      createdFirstTestClient = await request(app.getHttpServer())
        .post('/clients/add')
        .send(firstTestClientData)
        .set('Accept', 'application/json')

      expect(createdFirstTestClient.status).toEqual(201)

      expect(createdFirstTestClient.body).toHaveProperty('userClerkId', firstTestClientData.userClerkId);
      expect(createdFirstTestClient.body).toHaveProperty('name', firstTestClientData.name)
      expect(createdFirstTestClient.body).toHaveProperty('description', firstTestClientData.description)
      expect(createdFirstTestClient.body).toHaveProperty('email', firstTestClientData.email)
      expect(createdFirstTestClient.body).toHaveProperty('phone', firstTestClientData.phone)

      expect(createdFirstTestClient.body).toHaveProperty('id')
      expect(createdFirstTestClient.body).toHaveProperty('created_at')
      expect(createdFirstTestClient.body).toHaveProperty('updated_at')
      expect(createdFirstTestClient.body).toHaveProperty('is_active')
      expect(createdFirstTestClient.body).toHaveProperty('disabled')

    })

    it("/clients/add (POST) Should not create when name already exist", async () => {

      const createTestClient2 = await request(app.getHttpServer())
        .post('/clients/add')
        .send(firstTestClientData)
        .set('Accept', 'application/json')

      expect(createTestClient2.body)
        .toMatchObject({
          message: expect.stringContaining('duplicate key value violates unique constraint')
        })
    })

    it("/clients/add (POST) Should not create when email already exist", async () => {

      const newTestData = {
        ...firstTestClientData,
        name: "test2"
      }

      const createTestClient2 = await request(app.getHttpServer())
        .post('/clients/add')
        .send(newTestData)
        .set('Accept', 'application/json')

      expect(createTestClient2.body)
        .toMatchObject({
          message: expect.stringContaining('duplicate key value violates unique constraint')
        })
    })

    it("/clients/add (POST) Should not create when phone already exist", async () => {

      const newTestData = {
        ...firstTestClientData,
        name: "test2",
        email: "test2@mail.com"
      }

      const createTestClient2 = await request(app.getHttpServer())
        .post('/clients/add')
        .send(newTestData)
        .set('Accept', 'application/json')

      expect(createTestClient2.body)
        .toMatchObject({
          message: expect.stringContaining('duplicate key value violates unique constraint')
        })
    })

    it('/clients/all (GET)', async () => {

      const allTestClients = await request(app.getHttpServer())
        .get("/clients/all")
        .set('Accept', 'application/json')

      expect(allTestClients.status).toEqual(200)

      expect(allTestClients.body.length).toEqual(1)
    })

    it('/clients/:id (GET)', async () => {

      const clientById = await request(app.getHttpServer())
        .get(`/clients/${createdFirstTestClient.body.id}`)
        .set('Accept', 'application/json')

      expect(clientById.status).toEqual(200)

      expect(clientById.body).toHaveProperty('userClerkId', firstTestClientData.userClerkId);
      expect(clientById.body).toHaveProperty('name', firstTestClientData.name)
      expect(clientById.body).toHaveProperty('description', firstTestClientData.description)
      expect(clientById.body).toHaveProperty('email', firstTestClientData.email)
      expect(clientById.body).toHaveProperty('phone', firstTestClientData.phone)

      expect(clientById.body).toHaveProperty('id')
      expect(clientById.body).toHaveProperty('created_at')
      expect(clientById.body).toHaveProperty('updated_at')
      expect(clientById.body).toHaveProperty('is_active')
      expect(clientById.body).toHaveProperty('disabled')
    })

    describe('/clients/edit/:id (PUT)', () => {

      it("Should create a second test Client", async () => {
        createdSecondTestClient = await request(app.getHttpServer())
          .post('/clients/add')
          .send(secondTestClient)
          .set('Accept', 'application/json')

        expect(createdSecondTestClient.status).toEqual(201)
      })


      const updateClientData = {
        name: "test",
        description: "test",
        email: "test@mail.com",
        phone: "1234"
      }

      it("Should not edit if name already exist", async () => {

        const updateTestClient = await request(app.getHttpServer())
          .put(`/clients/edit/${createdSecondTestClient.body.id}`)
          .send(updateClientData)
          .set('Accept', 'application/json')

        expect(updateTestClient.body)
          .toMatchObject({
            message: expect.stringContaining('duplicate key value violates unique constraint')
          })
      })

      it("Should not edit if email already exist", async () => {

        updateClientData.name = "test3"

        const updateTestClient = await request(app.getHttpServer())
          .put(`/clients/edit/${createdSecondTestClient.body.id}`)
          .send(updateClientData)
          .set('Accept', 'application/json')

        expect(updateTestClient.body)
          .toMatchObject({
            message: expect.stringContaining('duplicate key value violates unique constraint')
          })
      })

      it("Should not edit if phone already exist", async () => {

        updateClientData.email = "test3@mail.com"

        const updateTestClient = await request(app.getHttpServer())
          .put(`/clients/edit/${createdSecondTestClient.body.id}`)
          .send(updateClientData)
          .set('Accept', 'application/json')

        expect(updateTestClient.body)
          .toMatchObject({
            message: expect.stringContaining('duplicate key value violates unique constraint')
          })
      })

      it('/clients/edit/:id (PUT)', async () => {

        updateClientData.phone = "123456"

        const updateTestClient = await request(app.getHttpServer())
          .put(`/clients/edit/${createdSecondTestClient.body.id}`)
          .send(updateClientData)
          .set('Accept', 'application/json')

        expect(updateTestClient.status).toEqual(200)
        expect(updateTestClient.body.affected).toEqual(1)

        const clientById = await request(app.getHttpServer())
          .get(`/clients/${createdSecondTestClient.body.id}`)
          .set('Accept', 'application/json')

        expect(clientById.body).toHaveProperty('name', updateClientData.name)
        expect(clientById.body).toHaveProperty('description', updateClientData.description)
        expect(clientById.body).toHaveProperty('email', updateClientData.email)
        expect(clientById.body).toHaveProperty('phone', updateClientData.phone)
      })
    })

    it('/clients/delete/:id (DELETE)', async () => {
      const deleteFirstTestClient = await request(app.getHttpServer())
        .delete(`/clients/delete/${createdFirstTestClient.body.id}`)
        .set('Accept', 'application/json')

      const firstClientById = await request(app.getHttpServer())
        .get(`/clients/${createdFirstTestClient.body.id}`)
        .set('Accept', 'application/json')

      expect(firstClientById.body.message).toEqual('NOT_FOUND :: Client not found.')

      const deleteSecondTestClient = await request(app.getHttpServer())
        .delete(`/clients/delete/${createdSecondTestClient.body.id}`)
        .set('Accept', 'application/json')

      const secondClientById = await request(app.getHttpServer())
        .get(`/clients/${createdSecondTestClient.body.id}`)
        .set('Accept', 'application/json')

      expect(secondClientById.body.message).toEqual('NOT_FOUND :: Client not found.')

      const allTestClients = await request(app.getHttpServer())
        .get("/clients/all")
        .set('Accept', 'application/json')

      expect(allTestClients.status).toEqual(200)

      expect(allTestClients.body.message).toEqual("NOT_FOUND :: There are no clients.")
    })
  })

  describe('Categories module', () => {

    const firstTestCategoryData = {
      name: "testCategory",
      description: "testCategory",
    }

    const secondTestCategory = {
      name: "testCategory2",
      description: "testCategory2",
    }

    let createdFirstTestCategory
    let createdSecondTestCategory

    it('/categories/add (POST)', async () => {

      createdFirstTestCategory = await request(app.getHttpServer())
        .post('/categories/add')
        .send(firstTestCategoryData)
        .set('Accept', 'application/json')

      expect(createdFirstTestCategory.status).toEqual(201)

      expect(createdFirstTestCategory.body).toHaveProperty('name', firstTestCategoryData.name)
      expect(createdFirstTestCategory.body).toHaveProperty('description', firstTestCategoryData.description)

      expect(createdFirstTestCategory.body).toHaveProperty('id')
      expect(createdFirstTestCategory.body).toHaveProperty('created_at')
      expect(createdFirstTestCategory.body).toHaveProperty('updated_at')
      expect(createdFirstTestCategory.body).toHaveProperty('is_active')
      expect(createdFirstTestCategory.body).toHaveProperty('disabled')

    })

    it("/categories/add (POST) Should not create when name already exist", async () => {

      const createTestCategory2 = await request(app.getHttpServer())
        .post('/categories/add')
        .send(firstTestCategoryData)
        .set('Accept', 'application/json')

      expect(createTestCategory2.body)
        .toMatchObject({
          message: expect.stringContaining('duplicate key value violates unique constraint')
        })
    })

    it('/categories/all (GET)', async () => {

      const allTestCategories = await request(app.getHttpServer())
        .get("/categories/all")
        .set('Accept', 'application/json')

      expect(allTestCategories.status).toEqual(200)

      expect(allTestCategories.body.length).toEqual(1)
    })

    it('/categories/:id (GET)', async () => {

      const clientById = await request(app.getHttpServer())
        .get(`/categories/${createdFirstTestCategory.body.id}`)
        .set('Accept', 'application/json')

      expect(clientById.status).toEqual(200)

      expect(clientById.body).toHaveProperty('name', firstTestCategoryData.name)
      expect(clientById.body).toHaveProperty('description', firstTestCategoryData.description)

      expect(clientById.body).toHaveProperty('id')
      expect(clientById.body).toHaveProperty('created_at')
      expect(clientById.body).toHaveProperty('updated_at')
      expect(clientById.body).toHaveProperty('is_active')
      expect(clientById.body).toHaveProperty('disabled')
    })

    describe('/categories/edit/:id (PUT)', () => {

      it("Should create a second test Client", async () => {
        createdSecondTestCategory = await request(app.getHttpServer())
          .post('/categories/add')
          .send(secondTestCategory)
          .set('Accept', 'application/json')

        expect(createdSecondTestCategory.status).toEqual(201)
      })


      const updateCategoryData = {
        name: "testCategory",
        description: "testCategory",
      }

      it("Should not edit if name already exist", async () => {

        const updateTestClient = await request(app.getHttpServer())
          .put(`/categories/edit/${createdSecondTestCategory.body.id}`)
          .send(updateCategoryData)
          .set('Accept', 'application/json')

        expect(updateTestClient.body)
          .toMatchObject({
            message: expect.stringContaining('duplicate key value violates unique constraint')
          })
      })

      it('/categories/edit/:id (PUT)', async () => {

        updateCategoryData.name = "testCategory3"
        updateCategoryData.description = "testCategory3"

        const updateTestClient = await request(app.getHttpServer())
          .put(`/categories/edit/${createdSecondTestCategory.body.id}`)
          .send(updateCategoryData)
          .set('Accept', 'application/json')

        expect(updateTestClient.status).toEqual(200)
        expect(updateTestClient.body.affected).toEqual(1)

        const clientById = await request(app.getHttpServer())
          .get(`/categories/${createdSecondTestCategory.body.id}`)
          .set('Accept', 'application/json')

        expect(clientById.body).toHaveProperty('name', updateCategoryData.name)
        expect(clientById.body).toHaveProperty('description', updateCategoryData.description)
      })
    })

    it('/categories/delete/:id (DELETE)', async () => {
      const deleteFirstTestCategory = await request(app.getHttpServer())
        .delete(`/categories/delete/${createdFirstTestCategory.body.id}`)
        .set('Accept', 'application/json')

      const firstCategoryById = await request(app.getHttpServer())
        .get(`/categories/${createdFirstTestCategory.body.id}`)
        .set('Accept', 'application/json')

      expect(firstCategoryById.body.message).toEqual('NOT_FOUND :: Category not found.')

      const deleteSecondTestCategory = await request(app.getHttpServer())
        .delete(`/categories/delete/${createdSecondTestCategory.body.id}`)
        .set('Accept', 'application/json')

      const secondCategoryById = await request(app.getHttpServer())
        .get(`/categories/${createdSecondTestCategory.body.id}`)
        .set('Accept', 'application/json')

      expect(secondCategoryById.body.message).toEqual('NOT_FOUND :: Category not found.')

      const allTestCategories = await request(app.getHttpServer())
        .get("/categories/all")
        .set('Accept', 'application/json')

      expect(allTestCategories.status).toEqual(200)

      expect(allTestCategories.body.message).toEqual("NOT_FOUND :: There are no categories.")
    })
  })

  describe('Buyer Posts module', () => {

    let testClient
    let testCategory
    let firstTestBuyerPost
    let secondTestBuyerPost
    let buyerPostById

    const firstTestBuyerPostData = {
      price: "1000",
      description: "First Test Buyer Post"
    }

    const secondTestBuyerPostData = {
      price: "2000",
      description: "Second Test Buyer Post"
    }

    const updateBuyerPostData = {
      price: "",
      client: "",
      category: ""
    }

    it("Should create a new Client", async () => {

      const firstTestClientData = {
        userClerkId: "test",
        name: "test",
        description: "test",
        email: "test@mail.com",
        phone: "1234",
        buyerPosts: [],
        sellerPosts: [],
      }

      testClient = await request(app.getHttpServer())
        .post('/clients/add')
        .send(firstTestClientData)
        .set('Accept', 'application/json')

      expect(testClient.status).toEqual(201)
    })

    it("Should create a new Category", async () => {

      const firstTestCategoryData = {
        name: "testCategory",
        description: "testCategory",
      }

      testCategory = await request(app.getHttpServer())
        .post('/categories/add')
        .send(firstTestCategoryData)
        .set('Accept', 'application/json')

      expect(testCategory.status).toEqual(201)
    })

    it("/buyer-posts/add (POST)", async () => {

      firstTestBuyerPost = await request(app.getHttpServer())
        .post('/buyer-posts/add')
        .send({
          ...firstTestBuyerPostData,
          client: testClient.body.id,
          category: testCategory.body.id
        })
        .set('Accept', 'application/json')

      expect(testCategory.status).toEqual(201)

      expect(firstTestBuyerPost.body).toHaveProperty('price', firstTestBuyerPostData.price)
      expect(firstTestBuyerPost.body).toHaveProperty('description', firstTestBuyerPostData.description)
      expect(firstTestBuyerPost.body).toHaveProperty('client', testClient.body.id)
      expect(firstTestBuyerPost.body).toHaveProperty('category', testCategory.body.id)

      expect(firstTestBuyerPost.body).toHaveProperty('id')
      expect(firstTestBuyerPost.body).toHaveProperty('created_at')
      expect(firstTestBuyerPost.body).toHaveProperty('updated_at')
      expect(firstTestBuyerPost.body).toHaveProperty('is_active')
      expect(firstTestBuyerPost.body).toHaveProperty('disabled')
    })

    it("/buyer-posts/add (POST) Should not create when a buyer post with the same information already exists.", async () => {

      const createTestBuyerPost2 = await request(app.getHttpServer())
        .post('/buyer-posts/add')
        .send({
          ...firstTestBuyerPostData,
          client: testClient.body.id,
          category: testCategory.body.id
        })
        .set('Accept', 'application/json')

      expect(createTestBuyerPost2.body)
        .toMatchObject({
          message: expect.stringContaining('There is already a buyer post with that information.')
        })
    })

    it('/buyer-posts/:id (GET)', async () => {

      buyerPostById = await request(app.getHttpServer())
        .get(`/buyer-posts/${firstTestBuyerPost.body.id}`)
        .set('Accept', 'application/json')

      expect(buyerPostById.status).toEqual(200)

      expect(buyerPostById.body).toHaveProperty('price', firstTestBuyerPostData.price)
      expect(buyerPostById.body).toHaveProperty('description', firstTestBuyerPostData.description)
      expect(buyerPostById.body).toHaveProperty('client.id', testClient.body.id)
      expect(buyerPostById.body).toHaveProperty('category.id', testCategory.body.id)

      expect(buyerPostById.body).toHaveProperty('id')
      expect(buyerPostById.body).toHaveProperty('created_at')
      expect(buyerPostById.body).toHaveProperty('updated_at')
      expect(buyerPostById.body).toHaveProperty('is_active')
      expect(buyerPostById.body).toHaveProperty('disabled')
    })

    describe('/buyer-posts/edit/:id (PUT)', () => {

      it("Should create a second test Buyer Post", async () => {
        secondTestBuyerPost = await request(app.getHttpServer())
          .post('/buyer-posts/add')
          .send({
            ...secondTestBuyerPostData,
            client: testClient.body.id,
            category: testCategory.body.id
          })
          .set('Accept', 'application/json')

        updateBuyerPostData.price = "1000"
        updateBuyerPostData.client = secondTestBuyerPost.body.client
        updateBuyerPostData.category = secondTestBuyerPost.body.category

        expect(secondTestBuyerPost.status).toEqual(201)
      })


      it("Should not edit if there is alredy a buyer post with same information.", async () => {

        const updateTestClient = await request(app.getHttpServer())
          .put(`/buyer-posts/edit/${secondTestBuyerPost.body.id}`)
          .send(updateBuyerPostData)
          .set('Accept', 'application/json')

        expect(updateTestClient.body)
          .toMatchObject({
            message: expect.stringContaining('There is already a buyer post with that information.')
          })
      })

      it('/buyer-posts/edit/:id (PUT)', async () => {

        updateBuyerPostData.price = "3000"

        const updateTestClient = await request(app.getHttpServer())
          .put(`/buyer-posts/edit/${secondTestBuyerPost.body.id}`)
          .send(updateBuyerPostData)
          .set('Accept', 'application/json')

        expect(updateTestClient.status).toEqual(200)
        expect(updateTestClient.body.affected).toEqual(1)

        const clientById = await request(app.getHttpServer())
          .get(`/buyer-posts/${secondTestBuyerPost.body.id}`)
          .set('Accept', 'application/json')

        expect(clientById.body).toHaveProperty('price', updateBuyerPostData.price)
        expect(clientById.body).toHaveProperty('client.id', testClient.body.id)
        expect(clientById.body).toHaveProperty('category.id', testCategory.body.id)

        expect(clientById.body).toHaveProperty('id')
        expect(clientById.body).toHaveProperty('created_at')
        expect(clientById.body).toHaveProperty('updated_at')
        expect(clientById.body).toHaveProperty('is_active')
        expect(clientById.body).toHaveProperty('disabled')
      })
    })

    describe("Should delete everything", () => {

      // delete created buyer posts
      it('/buyer-posts/delete/:id (DELETE)', async () => {

        const deleteFirstTestBuyerPost = await request(app.getHttpServer())
          .delete(`/buyer-posts/delete/${firstTestBuyerPost.body.id}`)
          .set('Accept', 'application/json')

        const firstBuyerPostById = await request(app.getHttpServer())
          .get(`/buyer-posts/${firstTestBuyerPost.body.id}`)
          .set('Accept', 'application/json')

        expect(firstBuyerPostById.body.message).toEqual('NOT_FOUND :: Buyer Post not found.')
        // expect(firstBuyerPostById.body.message).toEqual(undefined)

        const deleteSecondTestBuyerPost = await request(app.getHttpServer())
          .delete(`/buyer-posts/delete/${secondTestBuyerPost.body.id}`)
          .set('Accept', 'application/json')

        const secondBuyerPostById = await request(app.getHttpServer())
          .get(`/buyer-posts/${secondTestBuyerPost.body.id}`)
          .set('Accept', 'application/json')

        expect(secondBuyerPostById.body.message).toEqual('NOT_FOUND :: Buyer Post not found.')
      })

      // delete created client
      it('/clients/delete/:id (DELETE)', async () => {

        const deleteFirstTestClient = await request(app.getHttpServer())
          .delete(`/clients/delete/${testClient.body.id}`)
          .set('Accept', 'application/json')

        const firstClientById = await request(app.getHttpServer())
          .get(`/clients/${testClient.body.id}`)
          .set('Accept', 'application/json')

        expect(firstClientById.body.message).toEqual('NOT_FOUND :: Client not found.')
        // expect(firstClientById.body.message).toEqual(undefined)
      })

      // delete created category
      it('/categories/delete/:id (DELETE)', async () => {

        const deleteFirstTestCategory = await request(app.getHttpServer())
          .delete(`/categories/delete/${testCategory.body.id}`)
          .set('Accept', 'application/json')

        const firstCategoryById = await request(app.getHttpServer())
          .get(`/categories/${testCategory.body.id}`)
          .set('Accept', 'application/json')

        expect(firstCategoryById.body.message).toEqual('NOT_FOUND :: Category not found.')
        // expect(firstCategoryById.body.message).toEqual(undefined)
      })
    })

  })

});
