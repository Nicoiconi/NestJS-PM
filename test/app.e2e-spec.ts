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

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
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

      // You can also check for specific fields that are expected to be returned
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

      // You can also check for specific fields that are expected to be returned
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


});
