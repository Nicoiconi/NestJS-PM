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

      expect(allTestClients.body.message).toEqual("NOT_FOUND :: There are no Clients.")
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

      expect(allTestCategories.body.message).toEqual("NOT_FOUND :: There are no Categories.")
    })
  })

  describe('Buyer Posts module', () => {

    let testClient
    let testCategory
    let firstTestBuyerPost
    let secondTestBuyerPost
    let buyerPostById

    const clientsToDelete = []
    const categoriesToDelete = []
    const buyerPostsToDelete = []

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

      clientsToDelete.push(testClient.body.id)
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

      categoriesToDelete.push(testCategory.body.id)
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

      buyerPostsToDelete.push(firstTestBuyerPost.body.id)
    })

    it("The 'posts[]' property within Client should include the Buyer Post 'id'", async () => {

      const clientById = await request(app.getHttpServer())
        .get(`/clients/${testClient.body.id}`)
        .set('Accept', 'application/json')


      expect(clientById.status).toEqual(200)

      const postWithIdExists = clientById.body.buyerPosts.some(post => post.id === firstTestBuyerPost.body.id);
      expect(postWithIdExists).toBe(true)
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

        buyerPostsToDelete.push(secondTestBuyerPost.body.id)
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
        if (buyerPostsToDelete.length > 0) {

          for (const eachBuyerPostsToDelete of buyerPostsToDelete) {

            const deleteTestBuyerPost = await request(app.getHttpServer())
              .delete(`/buyer-posts/delete/${eachBuyerPostsToDelete}`)
              .set('Accept', 'application/json')

            const testBuyerPostById = await request(app.getHttpServer())
              .get(`/buyer-posts/${eachBuyerPostsToDelete}`)
              .set('Accept', 'application/json')

            expect(testBuyerPostById.body.message).toEqual('NOT_FOUND :: Buyer Post not found.')
          }
        }
      })

      // delete created client
      it('/clients/delete/:id (DELETE)', async () => {
        if (clientsToDelete.length > 0) {

          for (const eachClientToDelete of clientsToDelete) {
            const deleteTestClient = await request(app.getHttpServer())
              .delete(`/clients/delete/${eachClientToDelete}`)
              .set('Accept', 'application/json')

            const testClientById = await request(app.getHttpServer())
              .get(`/clients/${eachClientToDelete}`)
              .set('Accept', 'application/json')

            expect(testClientById.body.message).toEqual('NOT_FOUND :: Client not found.')
          }
        }
      })

      // delete created category
      it('/categories/delete/:id (DELETE)', async () => {
        if (categoriesToDelete.length > 0) {

          for (const eachCategoriesToDelete of categoriesToDelete) {

            const deletTestCategory = await request(app.getHttpServer())
              .delete(`/categories/delete/${eachCategoriesToDelete}`)
              .set('Accept', 'application/json')

            const testCategoryById = await request(app.getHttpServer())
              .get(`/categories/${eachCategoriesToDelete}`)
              .set('Accept', 'application/json')

            expect(testCategoryById.body.message).toEqual('NOT_FOUND :: Category not found.')
          }
        }
      })
    })
  })

  describe('Seller Posts module', () => {

    let testClient
    let testCategory
    let firstTestSellerPost
    let secondTestSellerPost
    let sellerPostById

    const clientsToDelete = []
    const categoriesToDelete = []
    const sellerPostsToDelete = []

    const firstTestSellerPostData = {
      price: "1000",
      description: "First Test Seller Post"
    }

    const secondTestSellerPostData = {
      price: "2000",
      description: "Second Test Seller Post"
    }

    const updateSellerPostData = {
      price: "",
      client: "",
      category: ""
    }

    it("Should create a new Client", async () => {

      const firstTestClientData = {
        userClerkId: "testseller",
        name: "testseller",
        description: "testseller",
        email: "testseller@mail.com",
        phone: "12345",
        buyerPosts: [],
        sellerPosts: [],
      }

      testClient = await request(app.getHttpServer())
        .post('/clients/add')
        .send(firstTestClientData)
        .set('Accept', 'application/json')


      expect(testClient.status).toEqual(201)

      clientsToDelete.push(testClient.body.id)
    })

    it("Should create a new Category", async () => {

      const firstTestCategoryData = {
        name: "testCategorySeller",
        description: "testCategorySeller",
      }

      testCategory = await request(app.getHttpServer())
        .post('/categories/add')
        .send(firstTestCategoryData)
        .set('Accept', 'application/json')

      expect(testCategory.status).toEqual(201)

      categoriesToDelete.push(testCategory.body.id)
    })

    it("/seller-posts/add (POST)", async () => {

      firstTestSellerPost = await request(app.getHttpServer())
        .post('/seller-posts/add')
        .send({
          ...firstTestSellerPostData,
          client: testClient.body.id,
          category: testCategory.body.id
        })
        .set('Accept', 'application/json')

      expect(testCategory.status).toEqual(201)

      expect(firstTestSellerPost.body).toHaveProperty('price', firstTestSellerPostData.price)
      expect(firstTestSellerPost.body).toHaveProperty('description', firstTestSellerPostData.description)
      expect(firstTestSellerPost.body).toHaveProperty('client', testClient.body.id)
      expect(firstTestSellerPost.body).toHaveProperty('category', testCategory.body.id)

      expect(firstTestSellerPost.body).toHaveProperty('id')
      expect(firstTestSellerPost.body).toHaveProperty('created_at')
      expect(firstTestSellerPost.body).toHaveProperty('updated_at')
      expect(firstTestSellerPost.body).toHaveProperty('is_active')
      expect(firstTestSellerPost.body).toHaveProperty('disabled')

      sellerPostsToDelete.push(firstTestSellerPost.body.id)
    })

    it("The 'posts[]' property within Client should include the Seller Post 'id'", async () => {

      const clientById = await request(app.getHttpServer())
        .get(`/clients/${testClient.body.id}`)
        .set('Accept', 'application/json')

      expect(clientById.status).toEqual(200)

      const postWithIdExists = clientById.body.sellerPosts.some(post => post.id === firstTestSellerPost.body.id);
      expect(postWithIdExists).toBe(true)
    })

    it("/seller-posts/add (POST) Should not create when a seller post with the same information already exists.", async () => {

      const createTestSellerPost2 = await request(app.getHttpServer())
        .post('/seller-posts/add')
        .send({
          ...firstTestSellerPostData,
          client: testClient.body.id,
          category: testCategory.body.id
        })
        .set('Accept', 'application/json')

      expect(createTestSellerPost2.body)
        .toMatchObject({
          message: expect.stringContaining('There is already a seller post with that information.')
        })
    })

    it('/seller-posts/:id (GET)', async () => {

      sellerPostById = await request(app.getHttpServer())
        .get(`/seller-posts/${firstTestSellerPost.body.id}`)
        .set('Accept', 'application/json')

      expect(sellerPostById.status).toEqual(200)

      expect(sellerPostById.body).toHaveProperty('price', firstTestSellerPostData.price)
      expect(sellerPostById.body).toHaveProperty('description', firstTestSellerPostData.description)
      expect(sellerPostById.body).toHaveProperty('client.id', testClient.body.id)
      expect(sellerPostById.body).toHaveProperty('category.id', testCategory.body.id)

      expect(sellerPostById.body).toHaveProperty('id')
      expect(sellerPostById.body).toHaveProperty('created_at')
      expect(sellerPostById.body).toHaveProperty('updated_at')
      expect(sellerPostById.body).toHaveProperty('is_active')
      expect(sellerPostById.body).toHaveProperty('disabled')
    })

    describe('/seller-posts/edit/:id (PUT)', () => {

      it("Should create a second test Seller Post", async () => {

        secondTestSellerPost = await request(app.getHttpServer())
          .post('/seller-posts/add')
          .send({
            ...secondTestSellerPostData,
            client: testClient.body.id,
            category: testCategory.body.id
          })
          .set('Accept', 'application/json')

        updateSellerPostData.price = "1000"
        updateSellerPostData.client = secondTestSellerPost.body.client
        updateSellerPostData.category = secondTestSellerPost.body.category

        expect(secondTestSellerPost.status).toEqual(201)

        sellerPostsToDelete.push(secondTestSellerPost.body.id)
      })


      it("Should not edit if there is alredy a seller post with same information.", async () => {

        const updateTestClient = await request(app.getHttpServer())
          .put(`/seller-posts/edit/${secondTestSellerPost.body.id}`)
          .send(updateSellerPostData)
          .set('Accept', 'application/json')

        expect(updateTestClient.body)
          .toMatchObject({
            message: expect.stringContaining('CONFLICT :: There is already a seller post with that information.')
          })
      })

      it('/seller-posts/edit/:id (PUT)', async () => {

        updateSellerPostData.price = "3000"

        const updateTestClient = await request(app.getHttpServer())
          .put(`/seller-posts/edit/${secondTestSellerPost.body.id}`)
          .send(updateSellerPostData)
          .set('Accept', 'application/json')

        expect(updateTestClient.status).toEqual(200)
        expect(updateTestClient.body.affected).toEqual(1)

        const clientById = await request(app.getHttpServer())
          .get(`/seller-posts/${secondTestSellerPost.body.id}`)
          .set('Accept', 'application/json')

        expect(clientById.body).toHaveProperty('price', updateSellerPostData.price)
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

      // delete created seller posts
      it('/seller-posts/delete/:id (DELETE)', async () => {

        if (sellerPostsToDelete.length > 0) {

          for (const eachSellerPostsToDelete of sellerPostsToDelete) {

            const deleteTestSellerPost = await request(app.getHttpServer())
              .delete(`/seller-posts/delete/${eachSellerPostsToDelete}`)
              .set('Accept', 'application/json')

            const testSellerPostById = await request(app.getHttpServer())
              .get(`/seller-posts/${eachSellerPostsToDelete}`)
              .set('Accept', 'application/json')

            expect(testSellerPostById.body.message).toEqual('NOT_FOUND :: Seller Post not found.')
          }
        }
      })

      // delete created client
      it('/clients/delete/:id (DELETE)', async () => {

        if (clientsToDelete.length > 0) {

          for (const eachClientToDelete of clientsToDelete) {
            const deleteTestClient = await request(app.getHttpServer())
              .delete(`/clients/delete/${eachClientToDelete}`)
              .set('Accept', 'application/json')

            const testClientById = await request(app.getHttpServer())
              .get(`/clients/${eachClientToDelete}`)
              .set('Accept', 'application/json')

            expect(testClientById.body.message).toEqual('NOT_FOUND :: Client not found.')
          }
        }
      })

      // delete created category
      it('/categories/delete/:id (DELETE)', async () => {

        if (categoriesToDelete.length > 0) {

          for (const eachCategoriesToDelete of categoriesToDelete) {

            const deletTestCategory = await request(app.getHttpServer())
              .delete(`/categories/delete/${eachCategoriesToDelete}`)
              .set('Accept', 'application/json')

            const testCategoryById = await request(app.getHttpServer())
              .get(`/categories/${eachCategoriesToDelete}`)
              .set('Accept', 'application/json')

            expect(testCategoryById.body.message).toEqual('NOT_FOUND :: Category not found.')
          }
        }
      })
    })
  })

  describe('Matches module', () => {

    let firstTestClient
    let secondTestClient
    let testCategory
    let firstTestBuyerPost
    let firstTestSellerPost
    let firstTestMatch

    const clientsToDelete = []
    const categoriesToDelete = []
    const buyerPostsToDelete = []
    const sellerPostsToDelete = []
    const matchesToDelete = []

    const firstTestBuyerPostData = {
      price: "2000",
      description: "First Test Buyer Post"
    }

    const firstTestSellerPostData = {
      price: "1000",
      description: "First Test Seller Post"
    }

    it("Should create two new Client", async () => {

      const firstTestClientData = {
        userClerkId: "test",
        name: "test",
        description: "test",
        email: "test@mail.com",
        phone: "1234",
        buyerPosts: [],
        sellerPosts: [],
      }

      const secondTestClientData = {
        userClerkId: "secondTest",
        name: "secondTest",
        description: "second test",
        email: "secondtest@mail.com",
        phone: "4321",
        buyerPosts: [],
        sellerPosts: [],
      }

      firstTestClient = await request(app.getHttpServer())
        .post('/clients/add')
        .send(secondTestClientData)
        .set('Accept', 'application/json')

      expect(firstTestClient.status).toEqual(201)

      clientsToDelete.push(firstTestClient.body.id)

      secondTestClient = await request(app.getHttpServer())
        .post('/clients/add')
        .send(firstTestClientData)
        .set('Accept', 'application/json')

      expect(secondTestClient.status).toEqual(201)

      clientsToDelete.push(secondTestClient.body.id)
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

      categoriesToDelete.push(testCategory.body.id)
    })

    it("Should create a new Buyer Post", async () => {

      firstTestBuyerPost = await request(app.getHttpServer())
        .post('/buyer-posts/add')
        .send({
          ...firstTestBuyerPostData,
          client: firstTestClient.body.id,
          category: testCategory.body.id
        })
        .set('Accept', 'application/json')

      expect(testCategory.status).toEqual(201)

      expect(firstTestBuyerPost.body).toHaveProperty('price', firstTestBuyerPostData.price)
      expect(firstTestBuyerPost.body).toHaveProperty('description', firstTestBuyerPostData.description)
      expect(firstTestBuyerPost.body).toHaveProperty('client', firstTestClient.body.id)
      expect(firstTestBuyerPost.body).toHaveProperty('category', testCategory.body.id)

      expect(firstTestBuyerPost.body).toHaveProperty('id')
      expect(firstTestBuyerPost.body).toHaveProperty('created_at')
      expect(firstTestBuyerPost.body).toHaveProperty('updated_at')
      expect(firstTestBuyerPost.body).toHaveProperty('is_active')
      expect(firstTestBuyerPost.body).toHaveProperty('disabled')

      buyerPostsToDelete.push(firstTestBuyerPost.body.id)

      // once created, check if client has the buyer post id at posts[]
    })

    it("Should create a new Seller Post", async () => {

      firstTestSellerPost = await request(app.getHttpServer())
        .post('/seller-posts/add')
        .send({
          ...firstTestSellerPostData,
          client: secondTestClient.body.id,
          category: testCategory.body.id
        })
        .set('Accept', 'application/json')

      expect(testCategory.status).toEqual(201)

      expect(firstTestSellerPost.body).toHaveProperty('price', firstTestSellerPostData.price)
      expect(firstTestSellerPost.body).toHaveProperty('description', firstTestSellerPostData.description)
      expect(firstTestSellerPost.body).toHaveProperty('client', secondTestClient.body.id)
      expect(firstTestSellerPost.body).toHaveProperty('category', testCategory.body.id)

      expect(firstTestSellerPost.body).toHaveProperty('id')
      expect(firstTestSellerPost.body).toHaveProperty('created_at')
      expect(firstTestSellerPost.body).toHaveProperty('updated_at')
      expect(firstTestSellerPost.body).toHaveProperty('is_active')
      expect(firstTestSellerPost.body).toHaveProperty('disabled')

      sellerPostsToDelete.push(firstTestSellerPost.body.id)
    })

    it('/matches/add (POST)', async () => {

      firstTestMatch = await request(app.getHttpServer())
        .post('/matches/add')
        .send({
          profit: (+firstTestBuyerPost.body.price - +firstTestSellerPost.body.price).toString(),
          buyerPost: firstTestBuyerPost.body.id,
          sellerPost: firstTestSellerPost.body.id,
          category: testCategory.body.id,
          description: "First Test Match"
        })
        .set('Accept', 'application/json')

      expect(firstTestMatch.status).toEqual(201)

      expect(firstTestMatch.body).toHaveProperty('profit', (+firstTestBuyerPost.body.price - +firstTestSellerPost.body.price).toString());
      expect(firstTestMatch.body).toHaveProperty('buyerPost', firstTestBuyerPost.body.id)
      expect(firstTestMatch.body).toHaveProperty('sellerPost', firstTestSellerPost.body.id)
      expect(firstTestMatch.body).toHaveProperty('category', testCategory.body.id)
      expect(firstTestMatch.body).toHaveProperty('description', "First Test Match")

      expect(firstTestMatch.body).toHaveProperty('id')
      expect(firstTestMatch.body).toHaveProperty('created_at')
      expect(firstTestMatch.body).toHaveProperty('updated_at')
      expect(firstTestMatch.body).toHaveProperty('is_active')
      expect(firstTestMatch.body).toHaveProperty('disabled')

      matchesToDelete.push(firstTestMatch.body.id)
    })

    it('/matches/:id (GET)', async () => {

      const matchById = await request(app.getHttpServer())
        .get(`/matches/${firstTestMatch.body.id}`)
        .set('Accept', 'application/json')

      expect(matchById.status).toEqual(200)

      expect(matchById.body).toHaveProperty('profit', (+firstTestBuyerPost.body.price - +firstTestSellerPost.body.price).toString())
      expect(matchById.body).toHaveProperty('description', "First Test Match")
      expect(matchById.body).toHaveProperty('buyerPost.id', firstTestBuyerPost.body.id)
      expect(matchById.body).toHaveProperty('sellerPost.id', firstTestSellerPost.body.id)
      expect(matchById.body).toHaveProperty('category.id', testCategory.body.id)

      expect(matchById.body).toHaveProperty('id')
      expect(matchById.body).toHaveProperty('created_at')
      expect(matchById.body).toHaveProperty('updated_at')
      expect(matchById.body).toHaveProperty('is_active')
      expect(matchById.body).toHaveProperty('disabled')
    })

    // NO it('/matches/edit/:id (PUT)', async () => {
    // })

    // it("/matches/add (POST) Should not create when a match with the same information already exists.", async () => {
    //   It would be unnecessary. 
    //   It is not possible to create a Post if there is a Post with the same information. 
    //   It could be possible to create similar Posts where only the price differs.
    //   It should be possible to create Posts, Matches, and Campaigns where there is already one with the same Client buyer, Client seller, and Category
    //   // Client buyer and Client seller should not be the same?
    //   // I think it sould be possible that the Client buy and sell for the same Category
    //   // When could be possible to be the same?
    //   // If the Client has his owns business. Same Client for us, not the same client for our Client.
    // })

    describe("Should delete everything", () => {

      // delete created match
      it('/matches/delete/:id (DELETE)', async () => {

        if (matchesToDelete.length > 0) {

          for (const eachMatchToDelete of matchesToDelete) {

            const deleteTestMatchPost = await request(app.getHttpServer())
              .delete(`/matches/delete/${eachMatchToDelete}`)
              .set('Accept', 'application/json')

            const testMatchPostById = await request(app.getHttpServer())
              .get(`/matches/${eachMatchToDelete}`)
              .set('Accept', 'application/json')

            expect(testMatchPostById.body.message).toEqual('NOT_FOUND :: Match not found.')
          }
        }

        const allMatches = await request(app.getHttpServer())
          .get("/matches/all")
          .set('Accept', 'application/json')

        expect(allMatches.status).toEqual(200)

        expect(allMatches.body.message).toEqual('NOT_FOUND :: There are no matches.')
      })

      // delete created buyer posts
      it('/buyer-posts/delete/:id (DELETE)', async () => {

        if (buyerPostsToDelete.length > 0) {

          for (const eachBuyerPostsToDelete of buyerPostsToDelete) {

            const deleteTestBuyerPost = await request(app.getHttpServer())
              .delete(`/buyer-posts/delete/${eachBuyerPostsToDelete}`)
              .set('Accept', 'application/json')

            const testBuyerPostById = await request(app.getHttpServer())
              .get(`/buyer-posts/${eachBuyerPostsToDelete}`)
              .set('Accept', 'application/json')

            expect(testBuyerPostById.body.message).toEqual('NOT_FOUND :: Buyer Post not found.')
          }
        }

        const allBuyerPosts = await request(app.getHttpServer())
          .get("/buyer-posts/all")
          .set('Accept', 'application/json')

        expect(allBuyerPosts.status).toEqual(200)

        expect(allBuyerPosts.body.message).toEqual('NOT_FOUND :: There are no Buyer Posts.')
      })

      // delete created seller posts
      it('/seller-posts/delete/:id (DELETE)', async () => {

        if (sellerPostsToDelete.length > 0) {

          for (const eachSellerPostsToDelete of sellerPostsToDelete) {

            const deleteTestSellerPost = await request(app.getHttpServer())
              .delete(`/seller-posts/delete/${eachSellerPostsToDelete}`)
              .set('Accept', 'application/json')

            const testSellerPostById = await request(app.getHttpServer())
              .get(`/seller-posts/${eachSellerPostsToDelete}`)
              .set('Accept', 'application/json')

            expect(testSellerPostById.body.message).toEqual('NOT_FOUND :: Seller Post not found.')
          }
        }

        const allSellerPosts = await request(app.getHttpServer())
          .get("/seller-posts/all")
          .set('Accept', 'application/json')

        expect(allSellerPosts.status).toEqual(200)

        expect(allSellerPosts.body.message).toEqual('NOT_FOUND :: There are no Seller Posts.')
      })

      // delete created client
      it('/clients/delete/:id (DELETE)', async () => {

        if (clientsToDelete.length > 0) {

          for (const eachClientToDelete of clientsToDelete) {
            const deleteTestClient = await request(app.getHttpServer())
              .delete(`/clients/delete/${eachClientToDelete}`)
              .set('Accept', 'application/json')

            const testClientById = await request(app.getHttpServer())
              .get(`/clients/${eachClientToDelete}`)
              .set('Accept', 'application/json')

            expect(testClientById.body.message).toEqual('NOT_FOUND :: Client not found.')
          }
        }

        const allClients = await request(app.getHttpServer())
          .get("/clients/all")
          .set('Accept', 'application/json')

        expect(allClients.status).toEqual(200)

        expect(allClients.body.message).toEqual('NOT_FOUND :: There are no Clients.')
      })

      // delete created category
      it('/categories/delete/:id (DELETE)', async () => {

        if (categoriesToDelete.length > 0) {

          for (const eachCategoriesToDelete of categoriesToDelete) {

            const deletTestCategory = await request(app.getHttpServer())
              .delete(`/categories/delete/${eachCategoriesToDelete}`)
              .set('Accept', 'application/json')

            const testCategoryById = await request(app.getHttpServer())
              .get(`/categories/${eachCategoriesToDelete}`)
              .set('Accept', 'application/json')

            expect(testCategoryById.body.message).toEqual('NOT_FOUND :: Category not found.')
          }
        }

        const allCategories = await request(app.getHttpServer())
          .get("/categories/all")
          .set('Accept', 'application/json')

        expect(allCategories.status).toEqual(200)

        expect(allCategories.body.message).toEqual('NOT_FOUND :: There are no Categories.')
      })
    })
  })

  describe('Campaigns module', () => {

    let firstTestClient
    let secondTestClient
    let testCategory
    let firstTestBuyerPost
    let firstTestSellerPost
    let firstTestMatch
    let firstTestCampaign

    const clientsToDelete = []
    const categoriesToDelete = []
    let buyerPostsToDelete = []
    let sellerPostsToDelete = []
    let matchesToDelete = []
    let campaignsToDelete = []

    const firstTestBuyerPostData = {
      price: "2000",
      description: "First Test Buyer Post"
    }

    const firstTestSellerPostData = {
      price: "1000",
      description: "First Test Seller Post"
    }

    it("Should create two new Client", async () => {

      const firstTestClientData = {
        userClerkId: "test",
        name: "test",
        description: "test",
        email: "test@mail.com",
        phone: "1234",
        buyerPosts: [],
        sellerPosts: [],
      }

      const secondTestClientData = {
        userClerkId: "secondTest",
        name: "secondTest",
        description: "second test",
        email: "secondtest@mail.com",
        phone: "4321",
        buyerPosts: [],
        sellerPosts: [],
      }

      firstTestClient = await request(app.getHttpServer())
        .post('/clients/add')
        .send(secondTestClientData)
        .set('Accept', 'application/json')

      expect(firstTestClient.status).toEqual(201)

      clientsToDelete.push(firstTestClient.body.id)

      secondTestClient = await request(app.getHttpServer())
        .post('/clients/add')
        .send(firstTestClientData)
        .set('Accept', 'application/json')

      expect(secondTestClient.status).toEqual(201)

      clientsToDelete.push(secondTestClient.body.id)
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

      categoriesToDelete.push(testCategory.body.id)
    })

    it("Should create a new Buyer Post", async () => {

      firstTestBuyerPost = await request(app.getHttpServer())
        .post('/buyer-posts/add')
        .send({
          ...firstTestBuyerPostData,
          client: firstTestClient.body.id,
          category: testCategory.body.id
        })
        .set('Accept', 'application/json')

      expect(testCategory.status).toEqual(201)

      expect(firstTestBuyerPost.body).toHaveProperty('price', firstTestBuyerPostData.price)
      expect(firstTestBuyerPost.body).toHaveProperty('description', firstTestBuyerPostData.description)
      expect(firstTestBuyerPost.body).toHaveProperty('client', firstTestClient.body.id)
      expect(firstTestBuyerPost.body).toHaveProperty('category', testCategory.body.id)

      expect(firstTestBuyerPost.body).toHaveProperty('id')
      expect(firstTestBuyerPost.body).toHaveProperty('created_at')
      expect(firstTestBuyerPost.body).toHaveProperty('updated_at')
      expect(firstTestBuyerPost.body).toHaveProperty('is_active')
      expect(firstTestBuyerPost.body).toHaveProperty('disabled')

      buyerPostsToDelete.push(firstTestBuyerPost.body.id)

      // once created, check if client has the buyer post id at posts[]
    })

    it("Should create a new Seller Post", async () => {

      firstTestSellerPost = await request(app.getHttpServer())
        .post('/seller-posts/add')
        .send({
          ...firstTestSellerPostData,
          client: secondTestClient.body.id,
          category: testCategory.body.id
        })
        .set('Accept', 'application/json')

      expect(testCategory.status).toEqual(201)

      expect(firstTestSellerPost.body).toHaveProperty('price', firstTestSellerPostData.price)
      expect(firstTestSellerPost.body).toHaveProperty('description', firstTestSellerPostData.description)
      expect(firstTestSellerPost.body).toHaveProperty('client', secondTestClient.body.id)
      expect(firstTestSellerPost.body).toHaveProperty('category', testCategory.body.id)

      expect(firstTestSellerPost.body).toHaveProperty('id')
      expect(firstTestSellerPost.body).toHaveProperty('created_at')
      expect(firstTestSellerPost.body).toHaveProperty('updated_at')
      expect(firstTestSellerPost.body).toHaveProperty('is_active')
      expect(firstTestSellerPost.body).toHaveProperty('disabled')

      sellerPostsToDelete.push(firstTestSellerPost.body.id)

      // once created, check if client has the buyer post id at posts[]
    })

    it('Should create a new Match', async () => {

      firstTestMatch = await request(app.getHttpServer())
        .post('/matches/add')
        .send({
          profit: (+firstTestBuyerPost.body.price - +firstTestSellerPost.body.price).toString(),
          buyerPost: firstTestBuyerPost.body.id,
          sellerPost: firstTestSellerPost.body.id,
          category: testCategory.body.id,
          description: "First Test Match"
        })
        .set('Accept', 'application/json')

      expect(firstTestMatch.status).toEqual(201)

      expect(firstTestMatch.body).toHaveProperty('profit', (+firstTestBuyerPost.body.price - +firstTestSellerPost.body.price).toString());
      expect(firstTestMatch.body).toHaveProperty('buyerPost', firstTestBuyerPost.body.id)
      expect(firstTestMatch.body).toHaveProperty('sellerPost', firstTestSellerPost.body.id)
      expect(firstTestMatch.body).toHaveProperty('category', testCategory.body.id)
      expect(firstTestMatch.body).toHaveProperty('description', "First Test Match")

      expect(firstTestMatch.body).toHaveProperty('id')
      expect(firstTestMatch.body).toHaveProperty('created_at')
      expect(firstTestMatch.body).toHaveProperty('updated_at')
      expect(firstTestMatch.body).toHaveProperty('is_active')
      expect(firstTestMatch.body).toHaveProperty('disabled')

      matchesToDelete.push(firstTestMatch.body.id)
    })

    it('/campaigns/add (POST)', async () => {

      const matchToCampaign = await request(app.getHttpServer())
        .get(`/matches/${firstTestMatch.body.id}`)
        .set('Accept', 'application/json')

      expect(matchToCampaign.status).toEqual(200)

      firstTestCampaign = await request(app.getHttpServer())
        .post('/campaigns/add')
        .send({
          match: matchToCampaign.body.id,
          description: "First Test Campaign"
        })
        .set('Accept', 'application/json')

      expect(firstTestMatch.status).toEqual(201)

      expect(firstTestCampaign.body).toHaveProperty('status', "Active")
      expect(firstTestCampaign.body).toHaveProperty('profit', matchToCampaign.body.profit)
      expect(firstTestCampaign.body).toHaveProperty('description', "First Test Campaign")
      expect(firstTestCampaign.body).toHaveProperty('buyer.id', matchToCampaign.body.buyerPost.client.id)
      expect(firstTestCampaign.body).toHaveProperty('buyerPay', matchToCampaign.body.buyerPost.price)
      expect(firstTestCampaign.body).toHaveProperty('seller.id', matchToCampaign.body.sellerPost.client.id)
      expect(firstTestCampaign.body).toHaveProperty('sellerCharge', matchToCampaign.body.sellerPost.price)
      expect(firstTestCampaign.body).toHaveProperty('category.id', matchToCampaign.body.category.id)

      expect(firstTestCampaign.body).toHaveProperty('id')
      expect(firstTestCampaign.body).toHaveProperty('created_at')
      expect(firstTestCampaign.body).toHaveProperty('updated_at')
      expect(firstTestCampaign.body).toHaveProperty('is_active')
      expect(firstTestCampaign.body).toHaveProperty('disabled')

      campaignsToDelete.push(firstTestCampaign.body.id)
    })

    // WHEN CREATE A CAMPAIGN SHOULD DELETE MATCH, BUYERPOST, AND SELLERPOST!!
    // When create a Campaign should delete Match, Buyer Post, and Seller Post
    // also, each id should be removed from delete array
    it("The Match should be deleted when the Campaign is created.", async () => {

      const testMatchPostById = await request(app.getHttpServer())
        .get(`/matches/${firstTestMatch.body.id}`)
        .set('Accept', 'application/json')

      expect(testMatchPostById.body.message).toEqual('NOT_FOUND :: Match not found.')

      matchesToDelete = matchesToDelete.filter(m => m !== firstTestMatch.body.id)
    })

    it("The Buyer Post should be deleted when the Campaign is created.", async () => {

      const testBuyerPostById = await request(app.getHttpServer())
        .get(`/buyer-posts/${firstTestMatch.body.buyerPost}`)
        .set('Accept', 'application/json')

      expect(testBuyerPostById.body.message).toEqual('NOT_FOUND :: Buyer Post not found.')

      buyerPostsToDelete = buyerPostsToDelete.filter(m => m !== firstTestBuyerPost.body.id)
    })

    it("The Seller Post should be deleted when the Campaign is created.", async () => {

      const testSellerPostById = await request(app.getHttpServer())
        .get(`/seller-posts/${firstTestMatch.body.sellerPost}`)
        .set('Accept', 'application/json')

      expect(testSellerPostById.body.message).toEqual('NOT_FOUND :: Seller Post not found.')

      sellerPostsToDelete = sellerPostsToDelete.filter(m => m !== firstTestSellerPost.body.id)
    })

    it('/campaigns/all (GET)', async () => {

      const allTestCampaigns = await request(app.getHttpServer())
        .get("/campaigns/all")
        .set('Accept', 'application/json')

      expect(allTestCampaigns.status).toEqual(200)

      expect(allTestCampaigns.body.length).toEqual(1)
    })

    it('/campaigns/:id (GET)', async () => {

      const campaignById = await request(app.getHttpServer())
        .get(`/campaigns/${firstTestCampaign.body.id}`)
        .set('Accept', 'application/json')

      expect(campaignById.status).toEqual(200)

      expect(campaignById.body).toHaveProperty('profit', firstTestCampaign.body.profit)
      expect(campaignById.body).toHaveProperty('description', firstTestCampaign.body.description)
      expect(campaignById.body).toHaveProperty('buyer.id', firstTestCampaign.body.buyer.id)
      expect(campaignById.body).toHaveProperty('buyerPay', firstTestCampaign.body.buyerPay)
      expect(campaignById.body).toHaveProperty('seller.id', firstTestCampaign.body.seller.id)
      expect(campaignById.body).toHaveProperty('sellerCharge', firstTestCampaign.body.sellerCharge)
      expect(campaignById.body).toHaveProperty('category.id', firstTestCampaign.body.category.id)

      expect(campaignById.body).toHaveProperty('id')
      expect(campaignById.body).toHaveProperty('created_at')
      expect(campaignById.body).toHaveProperty('updated_at')
      expect(campaignById.body).toHaveProperty('is_active')
      expect(campaignById.body).toHaveProperty('disabled')
    })

    it("campaigns/edit/:id (PUT)", async () => {

      const campaignById = await request(app.getHttpServer())
        .get(`/campaigns/${firstTestCampaign.body.id}`)
        .set('Accept', 'application/json')

      expect(campaignById.status).toEqual(200)

      const updateCampaignData = {
        buyerPay: (+campaignById.body.buyerPay + 1),
        sellerCharge: (+campaignById.body.sellerCharge - 1)
      }

      const updateTestCampaign = await request(app.getHttpServer())
        .put(`/campaigns/edit/${campaignById.body.id}`)
        .send(updateCampaignData)
        .set('Accept', 'application/json')

      expect(updateTestCampaign.status).toEqual(200)
      expect(updateTestCampaign.body.affected).toEqual(1)

      const clientByIdUpdated = await request(app.getHttpServer())
        .get(`/campaigns/${campaignById.body.id}`)
        .set('Accept', 'application/json')

      expect(clientByIdUpdated.body).toHaveProperty('buyerPay', (+campaignById.body.buyerPay + 1).toString())
      expect(clientByIdUpdated.body).toHaveProperty('sellerCharge', (+campaignById.body.sellerCharge - 1).toString())
      expect(clientByIdUpdated.body).toHaveProperty('profit', (Math.abs(+campaignById.body.profit + 2)).toString())
    })

    // When delete a Campaign
    // Test recreating Posts & Match, both Posts, and just one post (test both)

    describe("Should recreate Match, Buyer Post, and/or Seller Post if it is requested when delete a Campaign.", () => {

      it("Should recreate Match, Buyer Post, and Seller Post", async () => {

        // Verify that no Matches and Posts have been created

        const allMatches = await request(app.getHttpServer())
          .get("/matches/all")
          .set('Accept', 'application/json')

        expect(allMatches.status).toEqual(200)

        expect(allMatches.body.message).toEqual('NOT_FOUND :: There are no matches.')

        const allBuyerPosts = await request(app.getHttpServer())
          .get("/buyer-posts/all")
          .set('Accept', 'application/json')

        expect(allBuyerPosts.status).toEqual(200)

        expect(allBuyerPosts.body.message).toEqual('NOT_FOUND :: There are no Buyer Posts.')

        const allSellerPosts = await request(app.getHttpServer())
          .get("/seller-posts/all")
          .set('Accept', 'application/json')

        expect(allSellerPosts.status).toEqual(200)

        expect(allSellerPosts.body.message).toEqual('NOT_FOUND :: There are no Seller Posts.')

        // Delete Campaign + create Match (include Posts)

        const deleteTestCampaign = await request(app.getHttpServer())
          .delete(`/campaigns/delete/${firstTestCampaign.body.id}/match`)
          .set('Accept', 'application/json')

        expect(deleteTestCampaign.status).toEqual(200)

        const testCampaignById = await request(app.getHttpServer())
          .get(`/campaigns/${firstTestCampaign.body.id}`)
          .set('Accept', 'application/json')

        expect(testCampaignById.body.message).toEqual('NOT_FOUND :: Campaign not found.')

        campaignsToDelete = campaignsToDelete.filter(m => m !== firstTestCampaign.body.id)

        // Verify that Match and Posts were created

        const allBuyerPostsUpdated = await request(app.getHttpServer())
          .get("/buyer-posts/all")
          .set('Accept', 'application/json')

        expect(allBuyerPostsUpdated.status).toEqual(200)

        expect(allBuyerPostsUpdated.body.length).toEqual(1)

        const allSellerPostsUpdated = await request(app.getHttpServer())
          .get("/seller-posts/all")
          .set('Accept', 'application/json')

        expect(allSellerPostsUpdated.status).toEqual(200)

        expect(allSellerPostsUpdated.body.length).toEqual(1)

        sellerPostsToDelete.push(allSellerPostsUpdated.body[0].id)

        const allMatchesUpdated = await request(app.getHttpServer())
          .get("/matches/all")
          .set('Accept', 'application/json')

        expect(allMatchesUpdated.status).toEqual(200)

        expect(allMatchesUpdated.body.length).toEqual(1)
      })

      it("Should recreate Buyer Post and Seller Post", async () => {

        // Retrieve all matches; only one should have been created

        const allMatchesUpdated = await request(app.getHttpServer())
          .get("/matches/all")
          .set('Accept', 'application/json')

        expect(allMatchesUpdated.status).toEqual(200)
        expect(allMatchesUpdated.body.length).toEqual(1)

        // Create a new Campaign with the existing Match
        const newTestCampaign = await request(app.getHttpServer())
          .post('/campaigns/add')
          .send({
            match: allMatchesUpdated.body[0].id,
            description: "New Test Campaign"
          })
          .set('Accept', 'application/json')

        expect(newTestCampaign.status).toEqual(201)
        expect(newTestCampaign.body).toHaveProperty('id')

        // Delete the new Campaign + recreate both posts

        const deleteTestCampaign = await request(app.getHttpServer())
          .delete(`/campaigns/delete/${newTestCampaign.body.id}/posts`)
          .set('Accept', 'application/json')

        const testCampaignById = await request(app.getHttpServer())
          .get(`/campaigns/${firstTestCampaign.body.id}`)
          .set('Accept', 'application/json')

        expect(testCampaignById.body.message).toEqual('NOT_FOUND :: Campaign not found.')

        // Verify that both Posts have been created

        const allBuyerPosts = await request(app.getHttpServer())
          .get("/buyer-posts/all")
          .set('Accept', 'application/json')

        expect(allBuyerPosts.status).toEqual(200)
        expect(allBuyerPosts.body.length).toEqual(1)

        const allSellerPosts = await request(app.getHttpServer())
          .get("/seller-posts/all")
          .set('Accept', 'application/json')

        expect(allSellerPosts.status).toEqual(200)
        expect(allSellerPosts.body.length).toEqual(1)

        // Verify no Match have been created

        const allMatches = await request(app.getHttpServer())
          .get("/matches/all")
          .set('Accept', 'application/json')

        expect(allMatches.status).toEqual(200)

        expect(allMatches.body.message).toEqual('NOT_FOUND :: There are no matches.')
      })

      it("Should recreate Buyer Post", async () => {

        // Retrieve buyer and seller posts, only one of each should have been created

        const allBuyerPosts = await request(app.getHttpServer())
          .get("/buyer-posts/all")
          .set('Accept', 'application/json')

        expect(allBuyerPosts.status).toEqual(200)
        expect(allBuyerPosts.body.length).toEqual(1)

        const allSellerPosts = await request(app.getHttpServer())
          .get("/seller-posts/all")
          .set('Accept', 'application/json')

        expect(allSellerPosts.status).toEqual(200)
        expect(allSellerPosts.body.length).toEqual(1)

        // Create a new Match with the existing Posts

        const newTestMatch = await request(app.getHttpServer())
          .post('/matches/add')
          .send({
            profit: (+allBuyerPosts.body[0].price - +allSellerPosts.body[0].price).toString(),
            buyerPost: allBuyerPosts.body[0].id,
            sellerPost: allSellerPosts.body[0].id,
            category: testCategory.body.id,
            description: "New Test Match"
          })
          .set('Accept', 'application/json')

        expect(firstTestMatch.status).toEqual(201)
        expect(firstTestMatch.body).toHaveProperty('id')

        // Create a new Campaign with the new Match

        const newTestCampaign = await request(app.getHttpServer())
          .post('/campaigns/add')
          .send({
            match: newTestMatch.body.id,
            description: "New Test Campaign"
          })
          .set('Accept', 'application/json')

        expect(newTestCampaign.status).toEqual(201)
        expect(newTestCampaign.body).toHaveProperty('id')

        // Delete the new Campaign

        const deleteTestMatchPost = await request(app.getHttpServer())
          .delete(`/campaigns/delete/${newTestCampaign.body.id}/buyer-post`)
          .set('Accept', 'application/json')

        const testMatchPostById = await request(app.getHttpServer())
          .get(`/campaigns/${newTestCampaign.body.id}`)
          .set('Accept', 'application/json')

        expect(testMatchPostById.body.message).toEqual('NOT_FOUND :: Campaign not found.')

        // Verify the Buyer Post have been created

        const allBuyerPostsUpdated = await request(app.getHttpServer())
          .get("/buyer-posts/all")
          .set('Accept', 'application/json')

        expect(allBuyerPostsUpdated.status).toEqual(200)
        expect(allBuyerPostsUpdated.body.length).toEqual(1)

        // Verify no Match and Seller Post have been created

        const allSellerPostsUpdated = await request(app.getHttpServer())
          .get("/seller-posts/all")
          .set('Accept', 'application/json')

        expect(allSellerPostsUpdated.status).toEqual(200)
        expect(allSellerPostsUpdated.body.message).toEqual('NOT_FOUND :: There are no Seller Posts.')

        const allMatches = await request(app.getHttpServer())
          .get("/matches/all")
          .set('Accept', 'application/json')

        expect(allMatches.status).toEqual(200)

        expect(allMatches.body.message).toEqual('NOT_FOUND :: There are no matches.')
      })

      it("Should recreate Seller Post", async () => {

        // Retrieve all Buyer Posts, only one should have beed created

        const allBuyerPosts = await request(app.getHttpServer())
          .get("/buyer-posts/all")
          .set('Accept', 'application/json')

        expect(allBuyerPosts.status).toEqual(200)
        expect(allBuyerPosts.body.length).toEqual(1)

        // Create new Seller Post

        const newTestSellerPost = await request(app.getHttpServer())
          .post('/seller-posts/add')
          .send({
            price: "2000",
            description: "New Test Seller Post",
            client: firstTestClient.body.id,
            category: testCategory.body.id
          })
          .set('Accept', 'application/json')

        expect(testCategory.status).toEqual(201)
        expect(newTestSellerPost.body).toHaveProperty('id')

        // Create a new test Match

        const newTestMatch = await request(app.getHttpServer())
          .post('/matches/add')
          .send({
            profit: (+allBuyerPosts.body[0].price - +newTestSellerPost.body.price).toString(),
            buyerPost: allBuyerPosts.body[0].id,
            sellerPost: newTestSellerPost.body.id,
            category: testCategory.body.id,
            description: "New Test Match"
          })
          .set('Accept', 'application/json')

        expect(firstTestMatch.status).toEqual(201)
        expect(firstTestMatch.body).toHaveProperty('id')

        // Create a new Campaign

        const newTestCampaign = await request(app.getHttpServer())
          .post('/campaigns/add')
          .send({
            match: newTestMatch.body.id,
            description: "New Test Campaign"
          })
          .set('Accept', 'application/json')

        expect(newTestCampaign.status).toEqual(201)
        expect(newTestCampaign.body).toHaveProperty('id')

        // Delete the new Campaign

        const deleteTestCampaign = await request(app.getHttpServer())
          .delete(`/campaigns/delete/${newTestCampaign.body.id}/seller-post`)
          .set('Accept', 'application/json')

        const testCampaignById = await request(app.getHttpServer())
          .get(`/campaigns/${firstTestCampaign.body.id}`)
          .set('Accept', 'application/json')

        expect(testCampaignById.body.message).toEqual('NOT_FOUND :: Campaign not found.')

        // Verify the Seller Post have been created

        const allSellerPostsUpdated = await request(app.getHttpServer())
          .get("/seller-posts/all")
          .set('Accept', 'application/json')

        expect(allSellerPostsUpdated.status).toEqual(200)
        expect(allSellerPostsUpdated.body.length).toEqual(1)

        sellerPostsToDelete.push(allSellerPostsUpdated.body[0].id)

        // Verify no Match and Buyer Post have been created

        const allBuyerPostsUpdated = await request(app.getHttpServer())
          .get("/buyer-posts/all")
          .set('Accept', 'application/json')

        expect(allBuyerPostsUpdated.status).toEqual(200)
        expect(allBuyerPostsUpdated.body.message).toEqual('NOT_FOUND :: There are no Buyer Posts.')

        const allMatches = await request(app.getHttpServer())
          .get("/matches/all")
          .set('Accept', 'application/json')

        expect(allMatches.status).toEqual(200)

        expect(allMatches.body.message).toEqual('NOT_FOUND :: There are no matches.')

      })
    })

    describe("Should delete everything", () => {

      // delete created campaign
      it('/campaigns/delete/:id (DELETE)', async () => {

        if (campaignsToDelete.length > 0) {

          for (const eachCampaignToDelete of campaignsToDelete) {

            const deleteTestMatch = await request(app.getHttpServer())
              .delete(`/campaigns/delete/${eachCampaignToDelete}`)
              .set('Accept', 'application/json')

            const testMatchById = await request(app.getHttpServer())
              .get(`/campaigns/${eachCampaignToDelete}`)
              .set('Accept', 'application/json')

            expect(testMatchById.body.message).toEqual('NOT_FOUND :: Campaign not found.')
          }
        }
      })

      // delete created campaign
      it('/seller-posts/delete/:id (DELETE)', async () => {

        if (sellerPostsToDelete.length > 0) {

          for (const eachSellerPostToDelete of sellerPostsToDelete) {

            const deleteTestSellerPost = await request(app.getHttpServer())
              .delete(`/seller-posts/delete/${eachSellerPostToDelete}`)
              .set('Accept', 'application/json')

            const testSellerPostById = await request(app.getHttpServer())
              .get(`/seller-posts/${eachSellerPostToDelete}`)
              .set('Accept', 'application/json')

            expect(testSellerPostById.body.message).toEqual('NOT_FOUND :: Seller Post not found.')
          }
        }
      })

      // delete created client
      it('/clients/delete/:id (DELETE)', async () => {

        if (clientsToDelete.length > 0) {

          for (const eachClientToDelete of clientsToDelete) {
            const deleteTestClient = await request(app.getHttpServer())
              .delete(`/clients/delete/${eachClientToDelete}`)
              .set('Accept', 'application/json')

            const testClientById = await request(app.getHttpServer())
              .get(`/clients/${eachClientToDelete}`)
              .set('Accept', 'application/json')

            expect(testClientById.body.message).toEqual('NOT_FOUND :: Client not found.')
          }
        }
      })

      // delete created category
      it('/categories/delete/:id (DELETE)', async () => {

        if (categoriesToDelete.length > 0) {

          for (const eachCategoriesToDelete of categoriesToDelete) {

            const deletTestCategory = await request(app.getHttpServer())
              .delete(`/categories/delete/${eachCategoriesToDelete}`)
              .set('Accept', 'application/json')

            const testCategoryById = await request(app.getHttpServer())
              .get(`/categories/${eachCategoriesToDelete}`)
              .set('Accept', 'application/json')

            expect(testCategoryById.body.message).toEqual('NOT_FOUND :: Category not found.')
          }
        }
      })
    })
  })
});
